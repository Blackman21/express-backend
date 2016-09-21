'use strict';

const chai = require('chai'),
    request = require('request')
    ;

const Server = require('../src/server');

chai.use(require('chai-as-promised'));
var expect = chai.expect;

describe('expressjs-backend test', () => {

    it('start and stop server with default config', () => {
        let routes = [{controller: require('./testController')}];
        let server = new Server({}, routes);
        return server.start()
            .then(() => {
                return new Promise((resolve, reject) => {
                    request('http://localhost:3000/', {}, (error, response, body) => {
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
    })
});