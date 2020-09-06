
const extendError = (defName, defStatus, defMessage = '') => {
  class CustomError extends Error {
    constructor(message) {
      super(message || defMessage);
      this.name = defName;
      this.status = defStatus;
    }
  }
  module.exports[defName] = CustomError;
  return CustomError;
};

extendError('UserExists', 400, 'User already exists.');
extendError('InvalidUsername', 400, 'Username provided is invalid.');

extendError('InvalidLogin', 401, 'Invalid login details provided.');

extendError('NoLogin', 403, 'You must be logged in to perform this action.');
extendError('UserDisabled', 403, 'Your account has been diabled, contact an admin.');
extendError('NoPerm', 403, 'You have insufficent permissions to do this action.');

extendError('ConfigNotFound', 404, 'Config data was not found.');
extendError('UserNotFound', 404, 'User was not found.');
extendError('ProjectNotFound', 404, 'Project was not found.');

extendError('Internal', 500, 'An internal server error occurred, please alert an admin.');
