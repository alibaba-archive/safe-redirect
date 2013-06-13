/*!
 * safe-redirect - lib/safe-redirect.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var urlparse = require('url').parse;

function redirect(options) {
  var field = options.field || 'url';
  var matchDomain = options.matchDomain;
  if (typeof matchDomain === 'string') {
    matchDomain = new RegExp(matchDomain.replace(/\./g, '\\.') + '$');
  }
  if (!(matchDomain instanceof RegExp)) {
    throw new Error('options.matchDomain should be string or RegExp');
  }

  return function redirectMiddleware(req, res, next) {
    var query = req.query || {};
    var url = query[field];
    
    if (Array.isArray(url)) {
      url = url[0];
    }

    if (!url) {
      return next();
    }

    var info = urlparse(url);
    if (!info.hostname || !matchDomain.test(info.hostname)) {
      return next();
    }

    res.statusCode = 302;
    res.setHeader('Location', url);
    return res.end();
  };
}


module.exports = redirect;
