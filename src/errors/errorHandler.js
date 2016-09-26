'use strict';

const ValidationError = require('./validationError');

function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError')
    return res.status(400).json(err);

  if (err.name === 'Error' && err.code === 'ER_DUP_ENTRY')
    return res.status(400).json(new ValidationError('EntityAlreadyExists'));

  if (err.name === 'CustomError' && err.message === 'No Rows Updated')
    return res.status(400).json(new ValidationError('EntityNotFound'));

  if (err.name === 'UnauthorizedError' && err.code === 'credentials_required')
    return res.status(err.status).json(err.message);

  if (err.name === 'UnauthorizedError' && err.code === 'invalid_token')
    return res.status(err.status).json(err.message);

  if (err.name === 'EntityNotFoundError')
    return res.status(404).json(err);

  console.error(err);

  return res.status(500).json(err);
}

module.exports = errorHandler;
