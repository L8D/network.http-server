net.http-server [![Build Status](http://img.shields.io/travis/folktale/net.http-server.svg?style=flat)](https://travis-ci.org/folktale/net.http-server) [![NPM Version](http://img.shields.io/npm/v/net.http-server.svg?style=flat)](https://npmjs.org/package/net.http-server) [![License](http://img.shields.io/npm/l/net.http-server.svg?style=flat)](https://github.com/folktale/net.http-server/blob/master/LICENSE) [![devDependencies](http://img.shields.io/david/dev/folktale/net.http-server.svg?style=flat)](https://npmjs.org/package/net.http-server)
===================

A library for creating functionally pure HTTP request handlers.

Example
-------

```javascript
var Future = require('data.future');
var create = require('net.http-server');

var handler = create(function(req, res) {
  return Future.of(res.status(200).type('txt').send('Hello World!'));
});

http.createServer(handler).listen(9000);
```

Installing
----------

It's an npm module.

```bash
$ npm install net.http-server
```

Documentation
-------------

TODO

License
-------

Copyright &copy; 2014 Tenor Biel

Released under the MIT license.
