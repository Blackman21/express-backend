'use strict';

const express = require('express'),
  Promise = require('bluebird'),
  morgan = require('morgan'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  extend = require('extend'),
  ejwt = require('express-jwt'),
  errorHandler = require('./errors/errorHandler')
  ;

class Server {

  constructor(config, routes) {
    this.running = false;
    this.app = express();
    this.routes = routes;
    this.config = {};
    extend(true, this.config, this.defaultConfig(), config);
  }

  get isRunning() {
    return this.running;
  }

  start() {
    let self = this;

    if (self.config.compress)
      self.app.use(compression());

    if (self.config.logging)
      self.app.use(morgan('combined'));

    self.app.use(bodyParser.urlencoded({extended: false}));
    self.app.use(bodyParser.json());

    self.registerJwt();

    if (self.config.cors.allowInDevelopment)
      self.app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
      });

    self.registerRoutes();

    self.app.use(errorHandler);

    return new Promise((resolve, reject) => {
      self.server = self.app.listen(self.config.port, (err) => {
        if (err) {
          reject(err);
          return;
        }
        self._isRunning = true;
        let host = self.server.address().address;
        let port = self.server.address().port;
        console.log('%s listening at http://%s:%s\n', self.config.appName, host, port);

        resolve(self);
      })
    })
  }

  stop() {
    let self = this;
    let host = self.server.address().address;
    let port = self.server.address().port;

    return new Promise((resolve, reject) => {
      self.server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        self._isRunning = false;

        console.log('%s stopped at http://%s:%s\n', self.config.appName, host, port);

        resolve();
      })
    })
  }

  registerRoutes() {
    if (!this.routes)
      return;

    for (let route of this.routes) {
      if (route.prefix)
        this.app.use(route.prefix, route.controller);
      else
        this.app.use(route.controller);
    }
  }

  registerJwt() {
    if (!this.config.secure || !this.config.secure.prefix || !this.config.secure.jwt)
      return;

    for (let prefix of this.config.secure.prefix) {
      this.app.use(prefix, ejwt({secret:this.config.secure.jwt}))
    }
  }

  defaultConfig() {
    return {
      port: 3000,
      appName: 'express-backend',
      logging: true,
      compression: true,
      cors: {
        allowInDevelopment: this.allowInDevelopment()
      },
      secure: {
        prefix: []
      }
    }
  }

  allowInDevelopment() {
    if (!process.env.ENV)
      return true;

    return process.env.ENV.toLowerCase() !== 'production';
  }
}

module.exports = Server;
