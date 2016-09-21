'use strict';

const express = require('express'),
    Promise = require('bluebird'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    extend = require('extend')
    ;

class Server {

    constructor(config, routes) {
        this.running = false;
        this.app = express();
        this.routes = routes;
        this.config = {};
        extend(this.config, config, this.defaultConfig());
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

        self.registerRoutes();

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

    defaultConfig() {
        return {
            port: 3000,
            appName: 'express-backend',
            logging: true,
            compression: true
        }
    }
}

module.exports = Server;
