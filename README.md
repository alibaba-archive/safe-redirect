safe-redirect [![Build Status](https://secure.travis-ci.org/node-modules/safe-redirect.png)](http://travis-ci.org/node-modules/safe-redirect) [![Coverage Status](https://coveralls.io/repos/fengmk2/safe-redirect/badge.png)](https://coveralls.io/r/fengmk2/safe-redirect)
=======

![logo](https://raw.github.com/fengmk2/safe-redirect/master/logo.png)

Safe redirect middleware for connect 2. (Connect 3 is coming.)

## Install

```bash
$ npm install safe-redirect
```

## Required

* [connect](http://www.senchalabs.org/connect/)
* [connect/query](http://www.senchalabs.org/connect/query.html)

## Usage

```js
var connect = require('connect');
var redirect = require('safe-redirect');

var app = connect();
app.use(connect.query());

// allow redirects to fengmk2.com only
app.use('/r', redirect({
  field: 'url',
  matchDomain: 'fengmk2.com', // also support `RegExp`: /fengmk2\.com$/
}));

// allow redirects to test.fengmk2.com only
app.use('/redirect', redirect({
  field: 'url',
  matchDomain: /^test\.fengmk2\.com$/,
}));

// allow redirects to stdarg.com and fengmk2.com
app.use('/r', redirect({
  field: 'url',
  matchDomain: [ 'fengmk2.com', 'stdarg.com' ] // also support `RegExp`: /fengmk2\.com$/
}));

// allow redirects to test.fengmk2.com and test.stdarg.com
app.use('/redirect', redirect({
  field: 'url',
  matchDomain: [ /^test\.fengmk2\.com$/, /^test\.stdarg\.com$/ ]
}));

// allow redirects to fengmk2.com only and only allow absoute URI paths,
// e.g. /some/path is okay, but some/path and /some/../path are not allowed
app.use('/r', redirect({
  field: 'url',
  absolutePaths: true,
  matchDomain: 'fengmk2.com', // also support `RegExp`: /fengmk2\.com$/
}));

app.listen(1984);
```

```bash
$ curl -I localhost:1984/r?url=http://foo.fengmk2.com/bar

$ curl -I localhost:1984/r?url=http://foo.fengmk2mock.com/bar

$ curl -I localhost:1984/redirect?url=http://foo.fengmk2.com/bar

$ curl -I localhost:1984/redirect?url=http://test.fengmk2.com/bar
```

## License 

(The MIT License)

Copyright (c) 2013 fengmk2 &lt;fengmk2@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
