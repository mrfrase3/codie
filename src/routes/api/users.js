/* eslint-disable no-param-reassign */
const routes = require('express').Router();
const users = require('../../util/users');
const wrapAsync = require('../../util/wrapAsync');
const app = require('../../../app');

routes.get('/:id', (req, res) => {
  const user = users.get(req.params.id);
  res.json({ success: !!user, item: user });
});

routes.patch('/:id', wrapAsync(async (req, res) => {
  if(!res.locals.user.admin && req.params.id !== res.locals.user.id) {
    throw new app.errors.NoPerm();
  }
  if (!res.locals.user.admin) delete req.body.admin;
  const user = await users.patch(req.params.id, req.body);
  res.json({ success: !!user, item: user });
}));

routes.delete('/:id', wrapAsync(async (req, res) => {
  if(!res.locals.user.admin) {
    throw new app.errors.NoPerm();
  }
  await users.remove(req.params.id);
  res.json({ success: true });
}));

routes.post('/', wrapAsync(async (req, res) => {
  if(!res.locals.user.admin) {
    throw new app.errors.NoPerm();
  }
  const { username, password, admin } = req.body;
  const user = await users.create(username, password, admin);
  res.json({ success: !!user, item: user });
}));

routes.get('/', (req, res) => {
  res.json({ success: true, items: users.all() });
});

module.exports = routes;
