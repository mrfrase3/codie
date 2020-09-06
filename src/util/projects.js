/* eslint-disable no-console */
const fsSync = require('fs');
const fs = fsSync.promises;
const { v4: uuidv4 } = require('uuid');
const namor = require('namor');
const _ = require('lodash');
const proxy = require('./proxy');
const Docker = require('./docker');
// eslint-disable-next-line no-unused-vars
const app = require('../../app');

const file = './storage/projects.json';
let projects;

try {
  projects = JSON.parse(fsSync.readFileSync(file));
} catch (err) {
  projects = [];
}
const save = () => fs.writeFile(file, JSON.stringify(projects.map((p) => _.omit(p, ['container'])), null, 2));
const { safe, ...docker } = Docker(projects);

module.exports = {
  async init() {
    await docker.init();
    await Promise.all(projects.map(async (project) => {
      const status = await docker.initProject(project);
      if (status === 'running') await proxy(project.slug, project.port);
      else await docker.deleteProxy(project.slug);
    }));
    await docker.restartProxy(true);
    return true;
  },

  get(id, userId) {
    const project = projects.find((p) => (p.id === id) && (!userId || p.ownerId === userId || _.get(p, 'memberIds', []).includes(userId)));
    return project ? safe(project) : null;
  },

  has(id, userId) {
    const project = projects.find((p) => (p.id === id) && (!userId || p.ownerId === userId || _.get(p, 'memberIds', []).includes(userId)));
    return !!project;
  },

  all(userId) {
    return Promise.all(projects
      .filter((p) => !userId || p.ownerId === userId || _.get(p, 'memberIds', []).includes(userId))
      .map(safe));
  },

  async create(name, ownerId, scripts = []) {
    let slug = `codie-${namor.generate({ words: 2, saltLength: 2 })}`;
    // eslint-disable-next-line no-loop-func
    while (projects.some((p) => p.slug === slug)) {
      slug = `codie-${namor.generate({ words: 2, saltLength: 2 })}`;
    }

    const project = {
      id: uuidv4(),
      slug,
      name,
      folderName: _.kebabCase(name),
      image: process.env.CODER_IMAGE || 'codercom/code-server',
      ownerId,
      scripts,
      memberIds: [],
    };
    project.container = await docker.createContainer(project);

    projects.push(project);
    await save();
    return safe(project);
  },

  async patch(id, data) {
    const project = projects.find((p) => p.id === id);
    Object.keys(safe(data)).forEach((i) => {
      _.set(project, i, _.get(data, i));
    });
    await save();
    return safe(project);
  },

  async start(id) {
    const project = projects.find((p) => p.id === id);
    await docker.startProject(project);

    await proxy(project.slug, project.port);
    await docker.restartProxy();
    return safe(project);
  },

  async stop(id) {
    const project = projects.find((p) => p.id === id);
    await project.container.stop();
    await docker.deleteProxy(project.slug);
    await docker.restartProxy();
    return safe(project);
  },

  async restart(id) {
    const project = projects.find((p) => p.id === id);
    await project.container.restart();
    await docker.restartProxy();
    return safe(project);
  },

  async remove(id) {
    const project = projects.find((p) => p.id === id);
    await project.container.stop();
    await project.container.delete({ force: true });
    project.container = null;
    projects = projects.filter((p) => p.id !== id);
    await save();
    await docker.deleteProxy(project.slug);
    await docker.restartProxy();
    return safe(project);
  },

  async rebuild(id) {
    const project = projects.find((p) => p.id === id);

    await project.container.stop();
    await project.container.delete({ force: true });

    project.container = await docker.createContainer(project);
    await docker.startProject(project);

    await proxy(project.slug, project.port);
    await docker.restartProxy();
    return safe(project);
  },
};
