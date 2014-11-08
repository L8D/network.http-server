'use strict';
/* global describe, it */

var request = require('supertest');
var Future = require('data.future');
var create = require('../');

describe('Res#resolve', function() {
  it('should encode text/html by default', function(done) {
    request(create(function(req, res) {
      return Future.of(res.send('Ok'));
    }))
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200, 'Ok', done);
  });

  it('should encode buffers as octet streams', function(done) {
    request(create(function(req, res) {
      return Future.of(res.send(new Buffer('Ok')));
    }))
      .get('/')
      .expect('Content-Type', /application\/octet-stream/)
      .expect(200, 'Ok', done);
  });

  it('should use custom type when supplied', function(done) {
    request(create(function(req, res) {
      return Future.of(res
        .set('Content-Type', 'foo/bar')
        .send());
    }))
      .get('/')
      .expect('Content-Type', 'foo/bar')
      .expect(200, done);
  });

  it('should set encoding on custom type for utf-8 strings', function(done) {
    request(create(function(req, res) {
      return Future.of(res.set('Content-Type', 'foo/bar').send(''));
    }))
      .get('/')
      .expect('Content-Type', 'foo/bar; charset=utf-8')
      .expect(200, done);
  });

  it('should set Content-Length for strings', function(done) {
    request(create(function(req, res) {
      return Future.of(res.send('okey-doke'));
    }))
      .get('/')
      .expect('Content-Length', '9')
      .expect(200, 'okey-doke', done);
  });

  it('should set Content-Length for buffers', function(done) {
    request(create(function(req, res) {
      return Future.of(res.send(new Buffer('okey-doke')));
    }))
      .get('/')
      .expect('Content-Length', '9')
      .expect(200, 'okey-doke', done);
  });

  it('should use custom status code', function(done) {
    request(create(function(req, res) {
      return Future.of(res.status(403).send());
    }))
      .get('/')
      .expect(403, done);
  });
});
