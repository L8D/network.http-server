'use strict';

var request = require('supertest');
var Future = require('data.future');
var create = require('../');

describe('app', function() {
  it('should encode text/html by default', function(done) {
    request(create(function(req, res) {
      return Future.of(res.send('Ok'));
    }))
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Content-Length', '2')
      .expect(200, 'Ok', done);
  });

  it('should encode buffers as octet streams', function(done) {
    request(create(function(req, res) {
      return Future.of(res.send(new Buffer('Ok')));
    }))
      .get('/')
      .expect('Content-Type', 'application/octet-stream')
      .expect('Content-Length', '2')
      .expect(200, 'Ok', done);
  });
});
