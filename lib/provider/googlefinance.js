/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var util = require('util');
var AbstractProvider = require('./abstract');
var sprintf = require("sprintf-js").sprintf;
var cheerio = require('cheerio');
var _ = require('lodash');
var Rate = require('../model/rate');
var UnsupportedCurrencyPairException = require('../error/UnsupportedCurrencyPairException');

const URL = 'http://www.google.com/finance/converter?a=1&from=%s&to=%s';
const Provider = 'Google Finance';

/**
 * Google Finance provider.
 * @param options
 * @params {number} options.timeout Specify the timeout for request.
 * (optional) default: 3000ms
 */
var GoogleFinanceProvider = module.exports = function (options) {
  GoogleFinanceProvider.super_.call(this);

  // set the request options
  var requestOptions = {};
  requestOptions.timeout = options && options.timeout ? options.timeout : 3000;
  this.setRequestOptions(requestOptions);

  this.parseContent = function (content) {
    $ = cheerio.load(content);
    return $('span[class=bld]').html();
  }
};

/**
 * Inherit from abstract provider
 */
util.inherits(GoogleFinanceProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
GoogleFinanceProvider.prototype.fetchRate = function (currencyPair, callback) {
  var self = this;
  var url = sprintf(URL, currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
  self.fetchContent(url, function (err, content) {
    if (err) {
      return callback(err, null);
    }

    // Parse the content fetch from google finance
    var bid = self.parseContent(content);

    if (_.isNull(bid) || _.isUndefined(bid) || bid.length === 0) {
      return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
    }

    // split the fetched rate to remove currency symbol and verify if its number
    var parts = _.split(bid, ' ');
    if (parts.length == 0 || !_.toNumber(parts[0])) {
      return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
    }

    return callback(null, new Rate(parts[0], new Date(), Provider));
  });
};

/**
 * Fetch rate synchronously
 * @param currencyPair
 */
GoogleFinanceProvider.prototype.fetchRateSync = function (currencyPair) {
  var self = this;

  var url = sprintf(URL, currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
  var content = this.fetchContentSync(url);

  // Parse the content fetch from google finance
  var bid = self.parseContent(content);

  if (_.isNull(bid) || _.isUndefined(bid) || bid.length === 0) {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  // split the fetched rate to remove currency symbol and verify if its number
  var parts = _.split(bid, ' ');
  if (parts.length == 0 || !_.toNumber(parts[0])) {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  return new Rate(parts[0], new Date(), Provider);
};
