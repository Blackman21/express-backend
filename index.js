const Server = require('./src/server'),
    ValidationError = require('./src/errors/validationError')
;

exports = module.exports = Server;

exports.ValidationError = ValidationError;