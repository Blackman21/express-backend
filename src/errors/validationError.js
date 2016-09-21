'use strict';

class ValidationError extends Error{
    constructor(message, extra){
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.extra = extra;
    }
}

module.exports = ValidationError;
