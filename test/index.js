'use strict';

var request = require('supertest');
var Future = require('data.future');
var create = require('../');
var test = require('tape');

test('app', function(assert) {
  assert.plan(2);

  request(create(function(req, res) {
    return Future.of(res.send('Ok'));
  }))
    .get('/')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect('Content-Length', '2')
    .expect(200, 'Ok', function(err) {
      assert.error(err, 'should encode text/html by default');
    });

  request(create(function(req, res) {
    return Future.of(res.send(new Buffer('Ok')));
  }))
    .get('/')
    .expect('Content-Type', 'application/octet-stream')
    .expect('Content-Length', '2')
    .expect(200, 'Ok', function(err) {
      assert.error(err, 'should encode buffers as octet streams');
    });
});
