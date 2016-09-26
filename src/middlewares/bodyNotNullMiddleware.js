const BodyNullError = require('../errors/bodyNullError');

function bodyNotNullMiddleware(req, res, next) {
  if (!req.body)
    return res.status(400).json(new BodyNullError());

  next();
}

module.exports = bodyNotNullMiddleware;
