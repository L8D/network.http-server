'use strict';

var Future = require('data.future');
var typer = require('media-typer');
var http = require('http');
var mime = require('mime');
var _ = require('lodash');

module.exports = Res;

/** @class */
function Res(status, headers, body) {
  if (!(this instanceof Res)) {
    return new Res(status, headers, body);
  }

  this.statusCode = status;
  this.headers = headers;
  this.body = body;
}

var res = Res.prototype = {};

/**
 * Set status `code`.
 *
 * @param {Number} code
 * @return {Res}
 */

res.status = function(code) {
  return Res(code, this.headers, this.body);
};

/**
 * Set header `field` to `value`, or pass
 * an object of header fields.
 *
 * Examples:
 *
 *    res.set('Foo', ['bar', 'baz']);
 *    res.set('Accept', 'application/json');
 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
 *
 * @param {String|Object} field
 * @param {String} value
 * @return {Res}
 */

res.set =
res.header =
res.setHeader = function(field, value) {
  if (arguments.length === 1) {
    return _.reduce(field, function(res, value, header) {
      return res.set(header, value);
    }, this);
  } else {
    return Res(this.statusCode, update(this.headers, field, value), this.body);
  }
};

/**
 * Get value for header `field`.
 *
 * @param {String} field
 * @return {String}
 */

res.get =
res.getHeader = function(field) {
  return this.headers[field];
};

/**
 * Set the body of the response.
 *
 * @see Res
 * @param {String|Buffer|Object} body
 * @return {Res}
 */

res.send = function(body) {
  return Res(this.statusCode, this.headers, body);
};

/**
 * Set the body to JSON string of `object` and set _Content-Type_ header
 * appropriately.
 *
 * @param {Object} object
 * @return {Res}
 */

res.json = function(object) {
  data = JSON.stringify(object);

  if (!this.get('Content-Type')) {
    return this.set('Content-Type', 'application/json').send(data);
  } else {
    return this.send(data);
  }
};

/**
 * Set the JSON body to `object` with JSONP callback support.
 *
 * @param {Object} object
 * @param {[String]} callback
 * @return {Res}
 */

res.jsonp = function(object, callback) {
  if (callback == null) {
    return this.json(object);
  } else {
    var body = JSON.stringify(object);

    body = body
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');

    body = '/**/ typeof ' + callback +' === \'function\' && ' +
      callback + '(' + body + ');';

    return this.send(body);
  }
};

/**
 * Set body given HTTP status code.
 *
 * Sets the response status to `statusCode` and the body of the
 * response to the standard description from node's http.STATUS_CODES
 * or the statusCode number if no description.
 *
 * @param {Number} code
 * @return {Res}
 */

res.sendStatus = function(code) {
  var body = code + ' ' + http.STATUS_CODES[code] || '' + code;

  return this.status(code).type('txt').send(body);
};

/**
 * Set _Content-Type_ response header with `type` through `mime.lookup()`
 * when it does not contain '/', or set the Content-Type to `type` otherwise.
 *
 * Examples:
 *
 *     res.type('.html');
 *     res.type('html');
 *     res.type('json');
 *     res.type('application/json');
 *     res.type('png');
 *
 * @param {String} type
 * @return {Res}
 */

res.contentType =
res.type = function(type) {
  return this.set('Content-Type', ~type.indexOf('/')
    ? type
    : mime.lookup(type));
};

/**
 * Write all existing properties to `res` object.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */

res.resolve = function(req, res, next) {
  var status = this.statusCode;
  var headers = this.headers;
  var body = this.body;

  if (status != null) {
    res.statusCode = status;
  }

  _.each(headers, function(value, field) {
    res.setHeader(field, value);
  });

  if (body != null) {
    var type = res.getHeader('Content-Type');

    if (!type) {
      switch (typeof body) {
        case 'string':
          type = mime.lookup('html');
          break;

        case 'object':
          if (Buffer.isBuffer(body)) {
            res.setHeader('Content-Type', mime.lookup('bin'));
          }
      }
    }

    var encoding;

    // write strings in utf-8
    if (typeof body === 'string') {
      encoding = 'utf8';

      if (typeof type === 'string') {
        var parsed = typer.parse(type);
        parsed.parameters.charset = 'utf-8';

        res.setHeader('Content-Type', typer.format(parsed));
      }
    }

    // populate Content-Length
    if (!Buffer.isBuffer(body)) {
      body = new Buffer(body, encoding);
      encoding = undefined;
    }

    res.setHeader('Content-Length', body.length);

    // freshness
    if (req.fresh) {
      res.statusCode = 304;
    }

    // strip irrelevant headers
    if (res.statusCode === 204 || res.statusCode === 304) {
      res.removeHeader('Content-Type');
      res.removeHeader('Content-Length');
      res.removeHeader('Transfer-Encoding');
    }

    // skip body for HEAD
    if (req.method === 'HEAD') {
      res.end();
    }

    res.end(body, encoding);
  } else {
    next();
  }
};

function update(obj, key, value) {
  var res = {};
  res[key] = value;

  return _.assign(res, obj);
}
