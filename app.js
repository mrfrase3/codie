
// initiate packages
/* eslint-env node */
require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const app = module.exports = {}; // eslint-disable-line no-multi-assign

app.errors = require('./src/util/errors');

require('./src');

require('./src/util/init')();


// eslint-disable-next-line global-require
// if (process.env.NODE_ENV === 'production') require('./src/lib/initConfigFiles')();
