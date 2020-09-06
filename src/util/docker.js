/* eslint-disable no-console */
/* eslint-disable no-undef */
const fs = require('fs').promises;
const path = require('path');
const _ = require('lodash');
const { Docker } = require('node-docker-api');
const users = require('./users');
const startScripts = require('./startScripts');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const rootPath = path.join(__dirname, '../../');
const proxyVolume = process.env.PROXY_VOLUME || path.join(rootPath, 'proxy');
const proxyPort = process.env.PROXY_PORT || 9876;

const promisifyStream = (stream) => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-console
  stream.on('data', (d) => process.env.DEBUG && console.log(d.toString()));
  stream.on('end', resolve);
  stream.on('error', reject);
});

const safe = async (project) => _.omit({
  ...project,
  state: project.container ? _.get(await project.container.status(), 'data.State', {}) : null,
}, ['container']);

module.exports = (projects) => ({
  safe,

  async pullImage(image) {
    return promisifyStream(await docker.image.create({}, image));
  },

  async init() {
    console.log('Pulling Images...');
    await this.pullImage({ fromImage: 'nginx', tag: 'alpine' });
    if (!process.env.CODER_IMAGE) {
      await this.pullImage({ fromImage: 'codercom/code-server', tag: 'latest' });
    }
  },

  async createContainer(project) {
    const user = await users.get(project.ownerId);
    const port = process.env.CODER_PORT || 8080;
    return docker.container.create({
      Image: project.image,
      name: project.slug,
      Cmd: [
        '/usr/bin/entrypoint.sh',
        '--bind-addr',
        `0.0.0.0:${port}`,
        '--proxy-domain',
        `${project.slug}.${process.env.PROXY_DOMAIN || 'local.codie.cloud'}`,
        '--auth=none',
        '--disable-telemetry',
        `./${project.folderName}`,
      ],
      ExposedPorts: {
        [`${port}/tcp`]: {},
      },
      HostConfig: {
        Binds: [
          `${project.slug}:/home/coder/${project.folderName}`,
          `${user.slug}:/home/coder/`,
        ],
      },
    });
  },

  async deleteProxy(slug) {
    try {
      await fs.unlink(path.join(rootPath, `proxy/${slug}.conf`));
    } catch (err) {
      if (process.env.DEBUG) console.error(err);
    }
  },

  async restartProxy(detached = true) {
    const restart = async () => {
      const all = await Promise.all(projects.map(safe));
      try {
        const cont = await docker.container.get('codie-nginx');
        await cont.stop();
        await cont.delete({ force: true });
      } catch (err) {
        Math.random();
      }
      const proxyCont = await docker.container.create({
        Image: 'nginx:alpine',
        name: 'codie-nginx',
        ExposedPorts: {
          '80/tcp': {},
        },
        HostConfig: {
          Binds: [
            `${proxyVolume}:/etc/nginx/conf.d:ro`,
          ],
          PortBindings: {
            '80/tcp': [{ HostIp: '0.0.0.0', HostPort: `${proxyPort}` }],
          },
          Links: [
            ...(process.env.SERVER_LINK ? [process.env.SERVER_LINK] : []),
            ...all.filter((p) => _.get(p, 'state.Status') === 'running').map((p) => p.slug),
          ],
        },
        NetworkSettings: {
          Ports: {
            '80/tcp': [{ HostIp: '0.0.0.0', HostPort: `${proxyPort}` }],
          },
        },
      });
      return proxyCont.start();
    };
    if (detached) return setTimeout(restart, 50);
    return restart();
  },

  async initProject(project) {
    let status;
    try {
      // eslint-disable-next-line no-param-reassign
      project.container = await docker.container.get(project.slug);
      status = _.get(await project.container.status(), 'data.State.Status');
      console.log(project.slug, status);
    } catch (err) {
      if (err.reason.includes('no such container')) {
        // eslint-disable-next-line no-param-reassign
        project.container = await this.createContainer(project);
      } else {
        console.error(err);
      }
    }
    return status;
  },

  async runCommand(container, cmd) {
    const exec = await container.exec.create({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: [
        '/bin/bash',
        '-c',
        cmd,
      ],
      User: process.env.CODER_USER || 'coder',
    });
    return promisifyStream(await exec.start());
  },

  async startProject(project) {
    const preStatus = _.get(await project.container.status(), 'data.State.Status');
    await project.container.start();
    await Promise.all(Object.keys(startScripts).map(async (name) => {
      const script = startScripts[name];
      if (script.initOnly && preStatus !== 'created') return;
      if (script.required || _.get(project, 'scripts', []).includes(name)) {
        await script.commands(project).reduce(async (a, cmd) => {
          await a;
          await this.runCommand(project.container, cmd);
        }, Promise.resolve());
      }
    }));
  },
});
