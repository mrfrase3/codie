/* eslint-disable no-param-reassign */
const routes = require('express').Router();
const users = require('../../util/users');
const wrapAsync = require('../../util/wrapAsync');
const app = require('../../../app');

routes.post('/login/', wrapAsync(async (req, res) => {
  if(req.session.loggedIn) {
    const user = users.get(req.session.userId);
    return res.json({ success: true, item: user });
  }
  const { username, password } = req.body;
  if (!username || !password) throw new app.errors.InvalidLogin();
  const user = await users.login(username, password);
  req.session.userId = user.id;
  req.session.loggedIn = true;
  return req.session.save((err) => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
      throw new app.errors.Internal();
    }
    return res.json({ success: true, item: user });
  });
}));

routes.get('/logout/', (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      console.error(err); // eslint-disable-line no-console
      const error = new app.errors.Internal();
      return res.json({ success: false, message: error.message });
    }
    return res.json({ success: true });
  });
});

routes.get('/ping/', (req, res) => {
  if (!req.session.loggedIn) res.status(403).json({ success: false });
  else res.json({ success: req.session.loggedIn, item: users.get(req.session.userId) });
});

module.exports = routes;
