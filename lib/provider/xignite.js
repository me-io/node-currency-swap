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

const URL = 'https://globalcurrencies.xignite.com/xGlobalCurrencies.json/GetRealTimeRates?Symbols=%s&_fields=Outcome,Message,Symbol,Date,Time,Bid&_Token=%s';
const Provider = 'Xignite';

/**
 * Xignite provider.
 * * @param options
 * @param {string} options.token The application token
 * @params {number} options.timeout Specify the timeout for request.
 * (optional) default: 3000ms
 */
var XigniteProvider = module.exports = function (options) {
  XigniteProvider.super_.call(this);

  if (_.isUndefined(options) || _.isUndefined(options.token)) {
    throw new Error('Missing token from Xignite');
  }

  this.token = options.token;

  // set the request options
  var requestOptions = {};
  requestOptions.timeout = options.timeout ? options.timeout : 3000;
  this.setRequestOptions(requestOptions);

  this.parseContent = function (content) {
    try {
      return JSON.parse(content)[0];
    }
    catch (err) {
      throw new Error('Failed to parse data from provider due to format change');
    }
  }
};

/**
 * Inherit from abstract provider
 */
util.inherits(XigniteProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
XigniteProvider.prototype.fetchRate = function (currencyPair, callback) {
  var self = this;

  var url = sprintf(URL, currencyPair.getBaseCurrency() + currencyPair.getQuoteCurrency(), self.token);

  self.fetchContent(url, function (err, content) {
    if (err) {
      return callback(err, null);
    }

    try {
      // Parse the content fetch from open exchange rate
      var data = self.parseContent(content);

      if ('Success' !== data['Outcome']) {
        return callback(new Error(data['Message']), null);
      }

      if (_.isUndefined(data.Bid)) {
        return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
      }

      var date = data.Date ? new Date(data.Date) : new Date();
      return callback(null, new Rate(data.Bid, date, Provider));
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
XigniteProvider.prototype.fetchRateSync = function (currencyPair) {
  var self = this;

  var url = sprintf(URL, currencyPair.getBaseCurrency() + currencyPair.getQuoteCurrency(), self.token);
  var content = this.fetchContentSync(url);

  // Parse the content fetch from open exchange rate
  var data = self.parseContent(content);

  if ('Success' !== data['Outcome']) {
    throw new Error(data['Message']);
  }

  if (_.isUndefined(data.Bid)) {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  var date = data.Date ? new Date(data.Date) : new Date();
  return new Rate(data.Bid, date, Provider);
};
