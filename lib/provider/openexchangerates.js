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

const FREE_URL = 'https://openexchangerates.org/api/latest.json?app_id=%s';
const ENTERPRISE_URL = 'https://openexchangerates.org/api/latest.json?app_id=%s&base=%s&symbols=%s';
const Provider = 'Open Exchange Rates';

/**
 * Open Exchange Rates provider.
 * @param options
 * @param {string} options.appId The application id
 * @param {boolean} options.enterprise A flag to tell if it is in enterprise mode
 * (optional) default false
 * @params {number} options.timeout Specify the timeout for request.
 * (optional) default: 3000ms
 */
var OpenExchangeRatesProvider = module.exports = function (options) {
  OpenExchangeRatesProvider.super_.call(this);

  if (_.isUndefined(options) || _.isUndefined(options.appId)) {
    throw new Error('Missing appId from open exchange rates');
  }

  this.appId = options.appId;
  this.enterprise = options.enterprise ? options.enterprise : false;

  // set the request options
  var requestOptions = {};
  requestOptions.timeout = options.timeout ? options.timeout : 3000;
  this.setRequestOptions(requestOptions);

  this.parseContent = function (content) {
    try {
      return JSON.parse(content);
    }
    catch (err) {
      throw new Error('Failed to parse data from provider due to format change');
    }
  }
};

/**
 * Inherit from abstract provider
 */
util.inherits(OpenExchangeRatesProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
OpenExchangeRatesProvider.prototype.fetchRate = function (currencyPair, callback) {
  var self = this;

  if (!self.enterprise && currencyPair.getBaseCurrency() !== 'USD') {
    return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
  }

  var url = "";
  if (self.enterprise) {
    url = sprintf(ENTERPRISE_URL, self.appId, currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
  }
  else {
    url = sprintf(FREE_URL, self.appId);
  }

  self.fetchContent(url, function (err, content) {
    if (err) {
      return callback(err, null);
    }

    try {
      // Parse the content fetch from open exchange rate
      var data = self.parseContent(content);

      if (!_.isUndefined(data['error'])) {
        return callback(new Error(data['error']), null);
      }

      if (data.base !== currencyPair.getBaseCurrency() || _.isUndefined(data.rates[currencyPair.getQuoteCurrency()])) {
        return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
      }

      var date = data.timestamp ? new Date(data.timestamp * 1000) : new Date();
      return callback(null, new Rate(data.rates[currencyPair.getQuoteCurrency()].toString(), date, Provider));
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
OpenExchangeRatesProvider.prototype.fetchRateSync = function (currencyPair) {
  var self = this;

  if (!self.enterprise && currencyPair.getBaseCurrency() !== 'USD') {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  var url = "";
  if (self.enterprise) {
    url = sprintf(ENTERPRISE_URL, self.appId, currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
  }
  else {
    url = sprintf(FREE_URL, self.appId);
  }

  var content = this.fetchContentSync(url);

  // Parse the content fetch from open exchange rate
  var data = self.parseContent(content);

  if (!_.isUndefined(data['error'])) {
    throw new Error(data['error']);
  }

  if (data.base !== currencyPair.getBaseCurrency() || _.isUndefined(data.rates[currencyPair.getQuoteCurrency()])) {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  var date = data.timestamp ? new Date(data.timestamp * 1000) : new Date();
  return new Rate(data.rates[currencyPair.getQuoteCurrency()].toString(), date, Provider);
};
