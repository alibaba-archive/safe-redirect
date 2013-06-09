/*!
 * safe-redirect - test/safe-redirect.test.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var redirect = require('../');
var should = require('should');
var app = require('./app');
var request = require('supertest');

describe('safe-redirect.test.js', function () {

  it('should throw error when matchDomain type error', function () {
    (function () {
      redirect();
    }).should.throw("Cannot read property 'field' of undefined");
    (function () {
      redirect({matchDomain: 123});
    }).should.throw("options.matchDomain should be string or RegExp");
  });
  
  it('should /r?url=http://foo.fengmk2.com/bar 302 to http://foo.fengmk2.com/bar', function (done) {
    request(app)
    .get('/r?url=http://foo.fengmk2.com/bar')
    .expect(302)
    .expect('Location', 'http://foo.fengmk2.com/bar', done);
  });

  it('should /r?url=encodeURIComponent("http://foo.fengmk2.com/bar") 302 to http://foo.fengmk2.com/bar', function (done) {
    request(app)
    .get('/r?url=' + encodeURIComponent("http://foo.fengmk2.com/bar"))
    .expect(302)
    .expect('Location', 'http://foo.fengmk2.com/bar', done);
  });

  it('should /redirect?url=http://test.fengmk2.com/bar 302 to http://test.fengmk2.com/bar', function (done) {
    request(app)
    .get('/redirect?url=http://test.fengmk2.com/bar')
    .expect(302)
    .expect('Location', 'http://test.fengmk2.com/bar', done);
  });

  it('should /r?url= 404', function (done) {
    request(app)
    .get('/r?url=')
    .expect(404, done);
  });

  it('should /redirect?url= 404', function (done) {
    request(app)
    .get('/redirect?url=')
    .expect(404, done);
  });

  it('should /redirect 404', function (done) {
    request(app)
    .get('/redirect')
    .expect(404, done);
  });

  it('should /r?url=localhost:1984/r?url=http://foo.fengmk2mock.com/bar 404', function (done) {
    request(app)
    .get('/r?url=http://foo.fengmk2mock.com/bar')
    .expect(404, done)
  });

  it('should /r?url=localhost:1984/r?url=http://foo.fengmk2.com.cn/bar 404', function (done) {
    request(app)
    .get('/r?url=http://foo.fengmk2mock.com.cn/bar')
    .expect(404, done)
  });

  it('should /r?url=localhost:1984/r?url=encodeURIComponent("http://foo.fengmk2mock.com/bar") 404', function (done) {
    request(app)
    .get('/r?url=' + encodeURIComponent("http://foo.fengmk2mock.com/bar"))
    .expect(404, done)
  });

  it('should /redirect?url=http://test.fengmk2.com.cn/bar 404', function (done) {
    request(app)
    .get('/redirect?url=http://test.fengmk2.com.cn/bar')
    .expect(404, done)
  });

  it('should /redirect?url=http://foo.fengmk2.com/bar 404', function (done) {
    request(app)
    .get('/redirect?url=http://foo.fengmk2.com/bar')
    .expect(404, done)
  });

});
