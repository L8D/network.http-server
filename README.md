network.http-server
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
