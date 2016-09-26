'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  testController = require('./testController')
  ;

let server = express();
server.use(bodyParser.json());
server.use('/', testController);

module.exports = server;
