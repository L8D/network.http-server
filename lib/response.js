'use strict';

var _ = require('lodash');

module.exports = Res;

/** @class */
function Res(status, headers, body) {
  if (!(this instanceof Res)) {
    return new Res(status, headers, body);
  }

  this.status = status;
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
    return Res(this.status, update(this.headers, field, value), this.body);
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
  return Res(this.status, this.headers, body);
};

/**
 * Set the body to JSON string of `object` and set `Content-Type` header
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

function update(obj, key, value) {
  var res = {};
  res[key] = value;

  return _.assign(res, obj);
}
