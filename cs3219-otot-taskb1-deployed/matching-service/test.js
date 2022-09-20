import chai from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import app from './index.js';

chai.use(chaiHttp);
var assert = chai.assert;

describe("Waiting", () => {
    describe("POST /waiting", () => {
        it("should successfully post a waitee", (done) => {
            chai.request(app)
                .post('/waiting/testUuid/medium')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.uuid, "testUuid");
                    assert.equal(res.body.difficulty, "medium");
                    done();
                })
        })
    })
})

//Test POST error resiliency
describe("Waiting", () => {
    describe("POST /waiting", () => {
        it("should successfully post a waitee", (done) => {
            chai.request(app)
                .post('/waiting/testUuid/medium')
                .end((err, res) => {
                    assert.equal(res.status, 204);
                    done();
                })
        })
    })
})

describe("Waiting", () => {
    describe("PUT /waiting", () => {
        it("should successfully PUT a waitee", (done) => {
            chai.request(app)
                .put('/waiting/testUuid/hard')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0], "1");
                    done();
                })
        })
    })
})

describe("Waiting", () => {
    describe("GET /waiting", () => {
        it("should successfully GET a waitee", (done) => {
            chai.request(app)
                .get('/waiting/hard')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0].uuid, "testUuid");
                    assert.equal(res.body[0].difficulty, "hard");
                    done();
                })
        })
    })
})

describe("Waiting", () => {
    describe("DELETE /waiting", () => {
        it("should successfully delete a waitee", (done) => {
            chai.request(app)
                .delete('/waiting/testUuid/')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.uuid, "testUuid");
                    assert.equal(res.body.difficulty, "hard");
                    done();
                })
        })
    })
})

//Test DELETE error resiliency
describe("Waiting", () => {
    describe("DELETE /waiting", () => {
        it("should successfully delete a waitee", (done) => {
            chai.request(app)
                .delete('/waiting/testUuid/')
                .end((err, res) => {
                    assert.equal(res.status, 404);
                    done();
                })
        })
    })
})