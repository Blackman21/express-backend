'use strict';

const chai = require('chai'),
    request = require('supertest'),
    server = require('./testServer')
    ;

const expect = chai.expect;

describe('bodyNotNullMiddleware test', () => {

    // it's not relevant because body-parser always create req.body
    xit('no body of the request', (done) => {
        request(server)
            .post('/body-null')
            .expect(400)
            .expect((res) => {
                let result = JSON.parse(res.text);
                expect(result.name).to.be.equal('BodyNullError')
            })
            .end(done);
    });

    it('has body of the request', (done) => {
        let data = {
            field: 1
        };

        request(server)
            .post('/body-null')
            .send(data)
            .expect(200)
            .end(done);
    });
});