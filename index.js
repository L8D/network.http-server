'use strict';

var EventEmitter = require('events').EventEmitter;
var finalhandler = require('finalhandler');
var typer = require('media-typer');
var mime = require('mime');
var Map = require('immutable').Map;
var url = require('url');

var ires = Map({
  status: 200,
  headers: Map()
});

module.exports = function(handler, options) {
  options = options || {};

  var onerror = options.onerror || logError;

  if (typeof handler !== 'function') {
    throw new TypeError('Request handler ' + handler + ' is not a function');
  }

  return function requestHandler(request, response, done) {
    if (typeof next !== 'function') {
      done = finalhandler(request, response, {onerror: onerror});
    }

    var urlData = url.parse(request.url, true);

    var ireq = Map({
      method: request.method,
      headers: Map(request.headers),
      httpVersion: request.httpVersion,
      url: request.url,
      path: urlData.pathname,
      query: Map(urlData.query),
      bodyStream: request
    });

    var future = handler(ireq, ires);

    if (!(future && typeof future.fork === 'function')) {
      throw new TypeError(future + ' is not a future');
    }

    future.fork(done, function writeRes(res) {
      var body = res.get('body');
      var status = res.get('status');
      var headers = res.get('headers');
      var encoding;
      var parsed;

      var type = headers.get('Content-Type');

      switch (typeof body) {
        // string defaulting to html
        case 'string':
          if (!type) {
            headers = headers.set('Content-Type', mime.lookup('html'));
          }
          break;

        case 'boolean':
        case 'number':
        case 'object':
          if (body == null) {
            body = '';
          } else if (Buffer.isBuffer(body)) {
            if (!type) {
              headers = headers.set('Content-Type', mime.lookup('bin'));
            }
          } else {
            // write a JSON object
            if (!type) {
              headers = headers.set('Content-Type', mime.lookup('json'));
            }

            body = JSON.stringify(body);
          }
          break;
      }

      // write strings in utf-8
      if (typeof body === 'string') {
        encoding = 'utf8';

        // reflect in content-type
        if (typeof type === 'string') {
          parsed = typer.parse(type);

          parsed.parameters.charset = 'utf-8';

          headers = headers.set('Content-Type', typer.format(parsed));
        }
      }

      // populate content-length
      if (body != null) {
        if (!Buffer.isBuffer(body)) {
          body = new Buffer(body, encoding);
          encoding = undefined;
        }

        headers = headers.set('Content-Length', body.length);
      }

      if (status === 204 || status === 304) {
        headers = headers
          .delete('Content-Type')
          .delete('Content-Length')
          .delete('Transfer-Encoding');

        body = '';
      }

      response.writeHead(status, headers.toObject());

      // skip body for HEAD
      if (request.method === 'HEAD') {
        response.end();
      }

      response.end(body, encoding);
    });
  };
};

function logError(err) {
  console.error(err.stack || err.toString());
}
