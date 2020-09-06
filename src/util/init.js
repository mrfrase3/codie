const users = require('./users');
const projects = require('./projects');

module.exports = async () => {
  // eslint-disable-next-line no-console
  if(await users.init()) console.log('Initialised Users');
  // eslint-disable-next-line no-console
  if(await projects.init()) console.log('Initialised Projects');
};
