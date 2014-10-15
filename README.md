network.http-server
===================

A library for creating functionally pure HTTP request handlers.

Example
-------

```javascript
var Future = require('data.future');
var makeHandler = require('network.http-server');
var http = require('http');
var Map = require('immutable').Map;

var handler = makeHandler(function(req, res) {
  return Future.of(res.merge({
    status: 200,
    headers: Map({'content-type': 'text/plain'}),
    body: 'Hello World!'
  }));
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
