var composer = require('./');
var Future = require('data.future');
var http = require('http');
var mime = require('mime');
var path = require('path');
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

var handler = composer(function(req, res) {
  var filepath = path.resolve(__dirname + req.get('path'));

  if (filepath[filepath.length - 1] === '/') {
    filepath += 'index.html';
  }

  return read(filepath).fold(function(err) {
    return res
      .set('status', 404)
      .updateIn(['headers', 'Content-Type'], function() {
        return mime.lookup('txt');
      })
      .set('body', '404 Not found');
  }, function(data) {
    return res.updateIn(['headers', 'Content-Type'], function() {
      return mime.lookup(path.extname(filepath));
    }).set('body', data);
  });
});

http.createServer(handler).listen(9000, function() {
  console.log('Listening');
});
