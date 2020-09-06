const routes = require('express').Router();
const authCheck = require('../middleware/authCheck');

routes.use('/auth/', require('./auth'));
routes.use('/users/', authCheck, require('./users'));
routes.use('/projects/', authCheck, require('./projects'));

routes.use('/', require('../middleware/errorHandler'));

module.exports = routes;
