const Server = require('./src/server'),
  ValidationError = require('./src/errors/validationError'),
  errorHandler = require('./src/errors/errorHandler')
  ;

exports = module.exports = Server;

exports.ValidationError = ValidationError;
exports.errorHandler = errorHandler;
