const supertest = require('supertest');
const assert = require('assert');
const app = require('../index');

exports.default_route_should_respond_with_json = (done) => {
  supertest(app)
  .get('/')
  .expect(200)
  .end((err, res) => {
    assert.ok(!err);
    assert.ok(Object.keys(res.body).length > 0);
    return done();
  });
};

exports.agencies_route_should_list_agencies = (done) => {
	supertest(app)
	.get('/agencies')
	.expect(200)
	.end((err, res) => {
    assert.ok(!err);
    assert.ok(Object.keys(res.body).length > 1);
    return done();
  });
};