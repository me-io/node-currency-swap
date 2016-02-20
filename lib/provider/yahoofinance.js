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
var _ = require('lodash');
var Rate = require('../model/rate');
var UnsupportedCurrencyPairException = require('../error/UnsupportedCurrencyPairException');

const URL = 'https://query.yahooapis.com/v1/public/yql?q=%s&env=store://datatables.org/alltableswithkeys&format=json';
const Provider = 'Yahoo Finance';

/**
 * Yahoo Finance provider.
 * @param options
 * @params {number} options.timeout Specify the timeout for request.
 * (optional) default: 3000ms
 */
var YahooFinanceProvider = module.exports = function (options) {
  YahooFinanceProvider.super_.call(this);

  // set the request options
  var requestOptions = {};
  requestOptions.timeout = options && options.timeout ? options.timeout : 3000;
  this.setRequestOptions(requestOptions);

  this.parseContent = function (content) {
    try {
      var jsonContent = JSON.parse(content);
      return {
        created: jsonContent.query.created,
        rate: jsonContent.query.results.rate
      };
    }
    catch (err) {
      throw new Error('Failed to parse data from provider due to format change');
    }
  }
};

/**
 * Inherit from abstract provider
 */
util.inherits(YahooFinanceProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
YahooFinanceProvider.prototype.fetchRate = function (currencyPair, callback) {
  var self = this;
  var queryPairs = sprintf('"%s%s"', currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
  var query = sprintf('select * from yahoo.finance.xchange where pair in (%s)', queryPairs);
  var url = sprintf(URL, query);

  self.fetchContent(url, function (err, content) {
    if (err) {
      return callback(err, null);
    }

    try {
      // Parse the content fetch from yahoo finance
      var data = self.parseContent(content);

      // return error if rate and date is not available
      if (data === null || _.isUndefined(data) || _.isUndefined(data.rate) || _.isUndefined(
          data.rate.Rate) || data.rate.Rate === 'N/A') {
        return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
      }

      var date = data.created ? new Date(data.created) : new Date();
      return callback(null, new Rate(data.rate.Rate, date, Provider));
    }
    catch (err) {
      return callback(err, null);
    }
  });
};

/**
 * Fetch rate synchronously
 * @param currencyPair
 */
YahooFinanceProvider.prototype.fetchRateSync = function (currencyPair) {
  var self = this;

  var queryPairs = sprintf('"%s%s"', currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
  var query = sprintf('select * from yahoo.finance.xchange where pair in (%s)', queryPairs);
  var url = sprintf(URL, query);
  var content = this.fetchContentSync(url);

  // Parse the content fetch from yahoo finance
  var data = self.parseContent(content);

  // throw exception if rate and date is not available
  if (data === null || _.isUndefined(data) || _.isUndefined(data.rate) || _.isUndefined(
      data.rate.Rate) || data.rate.Rate === 'N/A') {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  var date = data.created ? new Date(data.created) : new Date();
  return new Rate(data.rate.Rate, date, Provider);
};
