/*!
 * safe-redirect - lib/safe-redirect.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * Copyright(c) 2014 Edmond Meinfelder edmond@stdarg.com
 * MIT Licensed
 */
'use strict';

/**
 * Module dependencies.
 */
var urlparse = require('url').parse;
var _ = require('lodash');
//var debug = require('debug')('safe-redirect');
var inspect = require('util').inspect;
var path = require('path');

/**
 * Convert string to simple regexs and if the argument is neither a string nor
 * a regex object, throw an error.
 */
function checkAndConvert(domain) {
  if (typeof domain === 'string') {
    domain = new RegExp(domain.replace(/\./g, '\\.') + '$');
  } else if (!(domain instanceof RegExp)) {
    throw new Error('matchDomain should be string or RegExp (or an array of)');
  }
  return domain;
}

/**
 * Test the matchDomain to see if it matches the hostname. Handles the the case
 * where matchDomain is an array or a single regex.
 */
function hostNameMatches(matchDomain, hostname) {
  var matched = false;

  if (typeof hostname !== 'string' || hostname.length < 1)
    return matched;

  // case where matchDomain is an array
  if (Object.prototype.toString.call(matchDomain) === '[object Array]') {
    var res = _.filter(matchDomain, function(domain) {
        if (domain.test(hostname))
          return domain;
    });
    if (Object.prototype.toString.call(res) === '[object Array]' && res.length)
      matched = true;
  } else {
    // case where matchDomain is a regular expression
    if (matchDomain.test(hostname))
      matched = true;
  }
  return matched;
}

/**
 * Provides Safe redirect middleware for connect. The redirect function
 * returns the redirect middleware function and uses the redirect closure
 * to pass the field & matchDomain.
 */
function redirect(options) {

  if (!options || '[object Object]' !== toString.call(options)) {
    throw new Error('redirect requires an options object');
  }

  var matchDomain = options.matchDomain;
  if (!matchDomain && (!(matchDomain instanceof RegExp) && 
     typeof matchDomain !== 'string') &&
     Object.prototype.toString.call(matchDomain) !== '[object Array]' ) {
    throw new Error('matchDomain should be string or RegExp (or an array of)');
  }

  var field = options.field || 'url';
  var absolutePaths = false;
  if (options.absolutePaths)
    absolutePaths = true;

  if (Object.prototype.toString.call(matchDomain) === '[object Array]') {
    matchDomain = _.map(matchDomain, checkAndConvert);
  } else {
    matchDomain = checkAndConvert(matchDomain);
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
    if (!hostNameMatches(matchDomain, info.hostname)) {
      return next();
    }

    if (absolutePaths && (typeof info.pathname !== 'string' ||
        info.pathname[0] !== '/' ||
        info.pathname !== path.resolve(info.pathname)))
    {
      return next();
    }

    res.statusCode = 302;
    res.setHeader('Location', url);
    return res.end();
  };
}

module.exports = redirect;
