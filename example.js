'use strict';

var createHandler = require('./');
var Future = require('data.future');
var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');

function read(path) {
  return new Future(function(reject, resolve) {
    fs.readFile(path, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

var handler = createHandler(function(req, res) {
  var rpath = url.parse(req.url, true).pathname;

  var filepath = path.resolve(__dirname + rpath);

  if (filepath[filepath.length - 1] === '/') {
    filepath += 'index.html';
  }

  return read(filepath).fold(function(err) {
    return res.sendStatus(404);
  }, function(data) {
    return res.type(path.extname(filepath)).send(data);
  });
});

http.createServer(handler).listen(9000, function() {
  console.log('Listening');
});
