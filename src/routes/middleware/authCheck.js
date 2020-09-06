const users = require('../../util/users');
const app = require('../../../app');

module.exports = async (req, res, next) => {
  if(req.session.loggedIn) {
    res.locals.user = users.get(req.session.userId);
    return next();
  }
  if(req.path.indexOf('login') === -1 && req.hostname !== 'localhost') {
    // save the path that the user was trying to access for after login
    if(req.path !== '/') req.session.preLoginPath = req.path;
    next(new app.errors.NoLogin());
  } else {
    next();
  }
  return null;
};
