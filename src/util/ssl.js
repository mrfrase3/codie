const Greenlock = require('greenlock');
const path = require('path');
const pkg = require('../../package.json');

let gl;
let enabled = false;
let challenge = {};

module.exports = (projects) => ({
  init() {
    if (
      !process.env.SSL_EMAIL
      || !process.env.SSL_TYPE
      || !process.env.SSL_TOKEN
    ) return;
    switch (process.env.SSL_TYPE) {
      case 'cloudflare':
        challenge = {
          token: process.env.SSL_TOKEN,
          verifyPropagation: false,
          // verbose: true,
        };
        break;
      default:
        return;
    }
    enabled = true;

    gl = Greenlock.create({
      packageRoot: path.join(__dirname, '../../'),
      configDir: './storage/greenlock.d/',
      staging: !!process.env.SSL_DEV,
      maintainerEmail: process.env.SSL_EMAIL,
      packageAgent: `${pkg.name}/${pkg.version}`,
    });

    gl.manager.defaults({
      agreeToTerms: true,
      subscriberEmail: process.env.SSL_EMAIL,
      store: {
        module: 'greenlock-store-fs',
        basePath: './certs/',
      },
      challenges: {
        'dns-01': {
          module: 'acme-dns-01-cloudflare',
          ...challenge,
        },
      },
    });
  },

  async genCerts() {
    if (!enabled) return;
    const slugs = projects.map((p) => p.slug).sort();

    try {
      await gl.remove({ subject: process.env.PROXY_DOMAIN });
    } catch (err) { Math.random(err); }

    await gl.add({
      subject: process.env.PROXY_DOMAIN,
      altnames: [
        process.env.PROXY_DOMAIN,
        ...slugs.reduce((a, slug) => [
          ...a,
          `${slug}.${process.env.PROXY_DOMAIN}`,
          `*.${slug}.${process.env.PROXY_DOMAIN}`,
        ], []),
      ],
      challenges: {
        'dns-01': {
          module: 'acme-dns-01-cloudflare',
          ...challenge,
        },
      },
    });
  },
});
