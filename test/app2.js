/*!
 * safe-redirect - test/app.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var connect = require('connect');
var redirect = require('../');

var app = connect();
app.use(connect.query());

app.use('/r', redirect({
  field: 'url',
  matchDomain: [ 'fengmk2.com', 'stdarg.com' ], // also support `RegExp`: /fengmk2\.com$/
  absolutePaths: true
}));

app.use('/redirect', redirect({
  field: 'url',
  matchDomain: [ /^test\.fengmk2\.com$/, /^test\.stdarg\.com$/ ]
}));

if (process.env.NODE_ENV !== 'test') {
  app.listen(1986);
}

module.exports = app;
