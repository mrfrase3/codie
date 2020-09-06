const _ = require('lodash');
const routes = require('express').Router();
const projects = require('../../util/projects');
const startScripts = require('../../util/startScripts');
const wrapAsync = require('../../util/wrapAsync');
const app = require('../../../app');

routes.get('/scripts', wrapAsync(async (req, res) => {
  res.json({
    success: true,
    item: Object.keys(startScripts).reduce((a, name) => {
      // eslint-disable-next-line no-param-reassign
      if (!startScripts[name].hidden) a[name] = startScripts[name];
      return a;
    }, {}),
  });
}));

routes.get('/:id/start', wrapAsync(async (req, res) => {
  if(!projects.has(req.params.id, res.locals.user.id)) {
    throw new app.errors.ProjectNotFound();
  }
  const project = await projects.start(req.params.id, res.locals.user.id);
  res.json({ success: !!project, item: project });
}));

routes.get('/:id/stop', wrapAsync(async (req, res) => {
  if(!projects.has(req.params.id, res.locals.user.id)) {
    throw new app.errors.ProjectNotFound();
  }
  const project = await projects.stop(req.params.id, res.locals.user.id);
  res.json({ success: !!project, item: project });
}));

routes.get('/:id/restart', wrapAsync(async (req, res) => {
  if(!projects.has(req.params.id, res.locals.user.id)) {
    throw new app.errors.ProjectNotFound();
  }
  const project = await projects.restart(req.params.id, res.locals.user.id);
  res.json({ success: !!project, item: project });
}));

routes.get('/:id/rebuild', wrapAsync(async (req, res) => {
  if(!projects.has(req.params.id, res.locals.user.id)) {
    throw new app.errors.ProjectNotFound();
  }
  const project = await projects.rebuild(req.params.id, res.locals.user.id);
  res.json({ success: !!project, item: project });
}));

routes.get('/:id', wrapAsync(async (req, res) => {
  const project = await projects.get(req.params.id, res.locals.user.id);
  res.json({ success: !!project, item: project });
}));

routes.patch('/:id', wrapAsync(async (req, res) => {
  if(!projects.has(req.params.id, res.locals.user.id)) {
    throw new app.errors.ProjectNotFound();
  }
  const project = await projects.patch(req.params.id, _.pick(req.body, ['name', 'memberIds']));
  res.json({ success: !!project, item: project });
}));

routes.delete('/:id', wrapAsync(async (req, res) => {
  if(!projects.has(req.params.id, res.locals.user.id)) {
    throw new app.errors.ProjectNotFound();
  }
  await projects.remove(req.params.id);
  res.json({ success: true });
}));

routes.post('/', wrapAsync(async (req, res) => {
  const { name, scripts } = req.body;
  const project = await projects.create(name, res.locals.user.id, scripts);
  res.json({ success: !!project, item: project });
}));

routes.get('/', wrapAsync(async (req, res) => {
  const pros = await projects.all(res.locals.user.id);
  res.json({ success: !!pros, items: pros });
}));

module.exports = routes;
