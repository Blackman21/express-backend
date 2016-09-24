'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    TestController = require('./testController')
    ;

let dependency = {
    response: 'index'
};

let server = express();
server.use(bodyParser.json());
server.use('/', new TestController(dependency));

module.exports = server;
