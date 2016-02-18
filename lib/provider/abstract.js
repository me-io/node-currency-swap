/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var syncRequest = require('sync-request');
var request = require('then-request');
var _ = require('lodash');

// set the request options
var defaultRequestOptions = {
  timeout: 3000
};

/**
 *
 * Base class for providers.
 */
var AbstractProvider = module.exports = function () {
  this.requestOptions = defaultRequestOptions;
};

/**
 * set request options and merge with default
 * @param requestOptions
 */
AbstractProvider.prototype.setRequestOptions = function (requestOptions) {
  var objectRequestOptions = _.clone(this.requestOptions);
  this.requestOptions = _.merge(objectRequestOptions, requestOptions);
};

/**
 * Fetches the content of the given url.
 * @param url
 * @param callback
 * @returns string
 */
AbstractProvider.prototype.fetchContent = function (url, callback) {
  request('GET', url, this.requestOptions, function (err, res) {
    if (err) {
      return callback(new Error('Request to provider failed due to connection issue or server does not responded'),
        null);
    }

    if (res.statusCode != 200) {
      return callback(
        new Error('Server responded with status code ' + res.statusCode + ':\n' + res.body.toString('utf8')), null);
    }

    return callback(null, res.body.toString('utf8'));
  });
};

/**
 * Fetches the content of the given url synchronously.
 * @param url
 * @returns string
 */
AbstractProvider.prototype.fetchContentSync = function (url) {
  try {
    var res = syncRequest('GET', url, this.requestOptions);
  }
  catch (err) {
    throw new Error('Request to provider failed due to connection issue or server does not responded');
  }

  if (res.statusCode != 200) {
    throw new Error('Server responded with status code ' + res.statusCode + ':\n' + res.body.toString('utf8'));
  }

  return res.body.toString('utf8');
};


