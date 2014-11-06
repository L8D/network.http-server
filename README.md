network.http-server [![Build Status](http://img.shields.io/travis/folktale/network.http-server.svg?style=flat)](https://travis-ci.org/folktale/network.http-server) [![NPM Version](http://img.shields.io/npm/v/network.http-server.svg?style=flat)](https://npmjs.org/package/network.http-server) [![License](http://img.shields.io/npm/l/network.http-server.svg?style=flat)](https://github.com/folktale/network.http-server/blob/master/LICENSE) [![devDependencies](http://img.shields.io/david/dev/folktale/network.http-server.svg?style=flat)](https://npmjs.org/package/network.http-server)
===================

A library for creating functionally pure HTTP request handlers.

Example
-------

```javascript
var Future = require('data.future');
var createHandler = require('network.http-server');

var handler = makeHandler(function(req, res) {
  return Future.of(res.status(200).type('txt').send('Hello World!'));
});

http.createServer(handler).listen(9000);
```

Installing
----------

It's an npm module.

```bash
$ npm install network.http-server
```

Documentation
-------------

TODO

License
-------

Copyright &copy; 2014 Tenor Biel

Released under the MIT license.
