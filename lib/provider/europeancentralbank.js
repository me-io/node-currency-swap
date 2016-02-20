/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var util = require('util');
var xmldoc = require("xmldoc");
var AbstractProvider = require('./abstract');
var _ = require('lodash');
var Rate = require('../model/rate');
var UnsupportedCurrencyPairException = require('../error/UnsupportedCurrencyPairException');

const URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
const Provider = 'European Central Bank';

/**
 * European Central Bank provider.
 * @param options
 * @params {number} options.timeout Specify the timeout for request.
 * (optional) default: 3000ms
 */
var EuropeanCentralBankProvider = module.exports = function (options) {
  EuropeanCentralBankProvider.super_.call(this);

  // set the request options
  var requestOptions = {};
  requestOptions.timeout = options && options.timeout ? options.timeout : 3000;
  this.setRequestOptions(requestOptions);

  this.parseContent = function (content) {
    return new xmldoc.XmlDocument(content);
  }
};

/**
 * Inherit from abstract provider
 */
util.inherits(EuropeanCentralBankProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
EuropeanCentralBankProvider.prototype.fetchRate = function (currencyPair, callback) {
  var self = this;

  if (currencyPair.getBaseCurrency() !== 'EUR') {
    return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
  }

  self.fetchContent(URL, function (err, content) {
    if (err) {
      return callback(err, null);
    }

    // Parse the content fetch from european central bank
    var xmlObj = self.parseContent(content);
    var rootCube = xmlObj.childNamed("Cube");
    var cube = rootCube.childNamed("Cube");

    if (cube === null || _.isUndefined(cube) || _.isUndefined(cube.attr)) {
      return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
    }

    // search for quote currency rate
    var rateElement = cube.childWithAttribute('currency', currencyPair.getQuoteCurrency());

    // return error if rate is not available
    if (rateElement === null || _.isUndefined(rateElement) || _.isUndefined(rateElement.attr) || _.isUndefined(
        rateElement.attr.rate)) {
      return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
    }

    var date = cube.attr.time ? new Date(cube.attr.time) : new Date();
    return callback(null, new Rate(rateElement.attr.rate, date, Provider));
  });
};

/**
 * Fetch rate synchronously
 * @param currencyPair
 */
EuropeanCentralBankProvider.prototype.fetchRateSync = function (currencyPair) {
  var self = this;

  if (currencyPair.getBaseCurrency() !== 'EUR') {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }
  var content = this.fetchContentSync(URL);

  // Parse the content fetch from european central bank
  var xmlObj = self.parseContent(content);
  var rootCube = xmlObj.childNamed("Cube");
  var cube = rootCube.childNamed("Cube");

  // throw exception if date is not available
  if (cube === null || _.isUndefined(cube) || _.isUndefined(cube.attr)) {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  // search for quote currency rate
  var rateElement = cube.childWithAttribute('currency', currencyPair.getQuoteCurrency());

  // throw exception if rate is not available
  if (rateElement === null || _.isUndefined(rateElement) || _.isUndefined(rateElement.attr) || _.isUndefined(
      rateElement.attr.rate)) {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  var date = cube.attr.time ? new Date(cube.attr.time) : new Date();
  return new Rate(rateElement.attr.rate, date, Provider);
};
