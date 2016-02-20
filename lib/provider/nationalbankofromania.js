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
var Big = require('big.js');
var Rate = require('../model/rate');
var UnsupportedCurrencyPairException = require('../error/UnsupportedCurrencyPairException');

const URL = 'http://www.bnr.ro/nbrfxrates.xml';
const Provider = 'National Bank of Romania';

/**
 * National Bank of Romania provider.
 * @param options
 * @params {number} options.timeout Specify the timeout for request.
 * (optional) default: 3000ms
 */
var NationalBankOfRomaniaProvider = module.exports = function (options) {
  NationalBankOfRomaniaProvider.super_.call(this);

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
util.inherits(NationalBankOfRomaniaProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
NationalBankOfRomaniaProvider.prototype.fetchRate = function (currencyPair, callback) {
  var self = this;

  if (currencyPair.getBaseCurrency() !== 'RON') {
    return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
  }

  self.fetchContent(URL, function (err, content) {
    if (err) {
      return callback(err, null);
    }

    // Parse the content fetch from national bank of romania
    var xmlObj = self.parseContent(content);
    var rootCube = xmlObj.childNamed("Body");
    var cube = rootCube.childNamed("Cube");

    // return error if date is not available
    if (cube === null || _.isUndefined(cube) || _.isUndefined(cube.attr)) {
      return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
    }

    // search for quote currency rate
    var rateElement = cube.childWithAttribute('currency', currencyPair.getQuoteCurrency());

    // return error if rate is not available
    if (rateElement === null || _.isUndefined(rateElement) || _.isUndefined(rateElement.attr) || _.isUndefined(
        rateElement.val)) {
      return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
    }

    var val = Big(rateElement.val);
    var rate = rateElement.attr.multiplier ? val.div(Big(rateElement.attr.multiplier)) : val;
    var date = cube.attr.date ? new Date(cube.attr.date) : new Date();

    return callback(null, new Rate(rate.toString(), date, Provider));
  });
};

/**
 * Fetch rate synchronously
 * @param currencyPair
 */
NationalBankOfRomaniaProvider.prototype.fetchRateSync = function (currencyPair) {
  var self = this;

  if (currencyPair.getBaseCurrency() !== 'RON') {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }
  var content = this.fetchContentSync(URL);

  // Parse the content fetch from national bank of romania
  var xmlObj = self.parseContent(content);
  var rootCube = xmlObj.childNamed("Body");
  var cube = rootCube.childNamed("Cube");

  // throw exception if date is not available
  if (cube === null || _.isUndefined(cube) || _.isUndefined(cube.attr)) {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  // search for quote currency rate
  var rateElement = cube.childWithAttribute('currency', currencyPair.getQuoteCurrency());

  // throw exception if rate is not available
  if (rateElement === null || _.isUndefined(rateElement) || _.isUndefined(rateElement.attr) || _.isUndefined(
      rateElement.val)) {
    throw new UnsupportedCurrencyPairException(currencyPair, Provider);
  }

  var val = Big(rateElement.val);
  var rate = rateElement.attr.multiplier ? val.div(Big(rateElement.attr.multiplier)) : val;

  var date = cube.attr.date ? new Date(cube.attr.date) : new Date();
  return new Rate(rate.toString(), date, Provider);
};
