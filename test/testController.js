"use strict";

const Router = require('express').Router,
    bodyNotNullMiddleware = require('../src/middlewares/bodyNotNullMiddleware');

class TestController extends Router {
    constructor(dependency) {
        super();
        this.dependecy = dependency;

        this.get('/', [_index]);
        this.post('/body-null', [bodyNotNullMiddleware, _index]);

        function _index(req, res) {
            res.json({response: dependency.response})
        }
    }
}

module.exports = TestController;

