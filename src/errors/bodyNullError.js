'use strict';

class BodyNullError extends Error {
  constructor() {
    super();
    this.name = 'BodyNullError';
  }
}

module.exports = BodyNullError;
