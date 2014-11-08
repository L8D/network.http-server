'use strict';

var finalhandler = require('finalhandler');
var typer = require('media-typer');
var mime = require('mime');
var Res = require('./lib/response');

module.exports = function(handler, options) {
  options = options || {};

  var onerror = options.onerror || logError;

  if (typeof handler !== 'function') {
    throw new TypeError('Request handler ' + handler + ' is not a function');
  }

  return function requestHandler(req, res, next) {
    if (typeof next !== 'function') {
      next = finalhandler(req, res, {onerror: onerror});
    }

    var future = handler(req, new Res(res.statusCode, res.headers));

    if (!(future && typeof future.fork === 'function')) {
      throw new TypeError(future + ' is not a future');
    }

    future.fork(next, function(result) {
      result.resolve(req, res, next);
    });
  };
};

function logError(err) {
  console.error(err.stack || err.toString());
}
