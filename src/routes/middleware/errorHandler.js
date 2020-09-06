/* eslint-disable no-console */
const app = require('../../../app');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  try{
    if(res.locals.log) res.locals.log.logError(err);
  } catch(error) { console.error(error.stack); }
  if(err.name === 'ValidationError') {
    return res.status(400).json({
      success: false, message: err.message, error: err.name, errors: err.errors,
    });
  } else if(!app.errors[err.name]) {
    console.error(err);
    err = new app.errors.Internal(); // eslint-disable-line no-param-reassign
  }
  return res.status(err.status).json({ success: false, message: err.message, error: err.name });
};
