'use strict';

const chai = require('chai'),
    request = require('request'),
    jwt = require('jsonwebtoken')
    ;

const Server = require('../src/server'),
    TestController = require('./testController');

chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));

const expect = chai.expect;

describe('expressjs-backend test', () => {
    let dependency = {
        response: 'index'
    };

    it('start and stop Server with default config', () => {
        let routes = [{controller: new TestController(dependency)}];
        let server = new Server({}, routes);

        return server.start()
            .then(() => {
                return new Promise((resolve, reject) => {
                    request('http://localhost:3000/', {}, (error, response, body) => {
                        expect(error).to.be.null;
                        expect(response.statusCode).to.be.equal(200);
                        let res = JSON.parse(body);
                        expect(res.response).to.be.equal('index');
                         expect(server.isRunning).to.be.true;
                        resolve();
                    })
                })
            })
            .then(() => {
                return server.stop();
            })
            .then(()=>{
                expect(server.isRunning).to.be.false;
            });
    });

    describe('secure resource', () => {
        let config = {
            port: 3000,
            appName: 'express-backend',
            logging: true,
            compression: true,
            secure: {
                prefix: ['/api/'],
                jwt: {secret: 'password'}
            }
        };

        let routes = [{prefix: '/api/', controller: new TestController(dependency)}];
        let server = new Server(config, routes);
        let options = {
            'auth': {
                'bearer': jwt.sign({name: 'test'}, 'password', {expiresIn: '1d'})
            }
        };

        it('access success', () => {
            return server.start()
                .then(() => {
                    return new Promise((resolve, reject) => {
                        request('http://localhost:3000/api/', options, (error, response, body) => {
                            expect(error).to.be.null;
                            expect(response.statusCode).to.be.equal(200);
                            let res = JSON.parse(body);
                            expect(res.response).to.be.equal('index');
                            resolve();
                        })
                    })
                })
                .then(() => {
                    return server.stop();
                });
        });

        it('access denied', () => {
            return server.start()
                .then(() => {
                    return new Promise((resolve, reject) => {
                        request('http://localhost:3000/api/', {}, (error, response, body) => {
                            expect(error).to.be.null;
                            expect(response.statusCode).to.be.equal(401);
                            expect(body).to.startsWith('"No authorization token was found"');
                            resolve();
                        })
                    })
                })
                .then(() => {
                    return server.stop();
                });
        })
    })
});