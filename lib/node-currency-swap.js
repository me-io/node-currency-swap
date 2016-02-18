/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var utils = require('./utils/common');
var CurrencyPair = require('./model/currencypair');
var memCahce = require('./cache');
var _ = require('lodash');

var providersToUtilize = [];

/**
 *
 * Public properties and methods for swap module
 */
module.exports = {
  /**
   * Expose providers defined by swap
   */
  providers: require('./provider'),

  /**
   * Expose currency codes
   */
  currencyCodes: require('./utils/currencycodes'),

  /**
   * Add provider to be used by quote
   * @param provider
   * @returns {Number}
   */
  addProvider: function (provider) {
    if (!utils.verifyProviderAvailable(provider)) {
      throw new Error('Provider should be one of the available provider.');
    }

    if (utils.verifyProviderAlreadyAdded(provider, providersToUtilize)) {
      throw new Error('Provider already added in the list');
    }

    providersToUtilize.push(provider);
    return providersToUtilize.length;
  },

  /**
   * synchronous implementation
   * @param {Object} options
   * @params {string|Object} options.currency currency info to get exchange rate.
   * @params {boolean} options.fetchMultipleRate Specify either return single rate or multiple rate.
   * (optional) default: false
   * @params {boolean} options.cache to utilize cache or not
   * (optional)
   * @params {number} options.ttl time in milliseconds to keep object in cache
   * (optional)
   * @returns {*}
   */
  quoteSync: function (options) {
    // options should be an object
    if (!_.isPlainObject(options)) {
      throw new Error('Options should be an object');
    }

    // options should contain currency either as string or object
    if (_.isUndefined(options.currency)) {
      throw new Error('Currency is required. Either pass it as string or object');
    }

    // At least one provider should be added before calling this method
    if (providersToUtilize.length == 0) {
      throw new Error('Add at least one provider to get the exchange rates');
    }

    // create a currency pair based on the provided currency string or object
    var currencyPair = new CurrencyPair(options.currency);

    var rate = null;
    // cache == true and rate is available in cache return rate.
    if (options.cache && null !== (rate = memCahce.getExchangeRate(currencyPair.toString()))) {
      return rate
    }

    var fetchMultipleRate = options.fetchMultipleRate ? options.fetchMultipleRate : false;

    // fetch exchange rate
    rate = utils.getExchangeRateSync(providersToUtilize, currencyPair, fetchMultipleRate);

    // set the rates in cache if cahce == true
    if (options.cache) {
      memCahce.setExchangeRate(currencyPair.toString(), rate, options.ttl ? options.ttl : 360000);
    }

    return rate;
  },

  /**
   * asynchronous implementation
   * @param {Object} options
   * @params {string|Object} options.currency currency info to get exchange rate.
   * @params {boolean} options.fetchMultipleRate Specify either return single rate or multiple rate.
   * (optional) default: false
   * @params {boolean} options.cache to utilize cache or not
   * (optional)
   * @params {number} options.ttl time in milliseconds to keep object in cache
   * (optional)
   * @param callback
   * @returns {*}
   */
  quote: function (options, callback) {
    // options should be an object
    if (!_.isPlainObject(options)) {
      return callback(new Error('Options should be an object'), null);
    }

    // options should contain currency either as string or object
    if (_.isUndefined(options.currency)) {
      return callback(new Error('Currency is required. Either pass it as string or object'), null);
    }

    // At least one provider should be added before calling this method
    if (providersToUtilize.length == 0) {
      return callback(new Error('Add at least one provider to get the exchange rates'), null);
    }

    var fetchMultipleRate = options.fetchMultipleRate ? options.fetchMultipleRate : false;

    try {
      // create a currency pair based on the provided currency string or object
      var currencyPair = new CurrencyPair(options.currency);

      var rate = null;
      // cache == true and rate is available in cache return rate.
      if (options.cache && null !== (rate = memCahce.getExchangeRate(currencyPair.toString()))) {
        return callback(null, rate);
      }

      // fetch exchange rate
      utils.getExchangeRate(providersToUtilize, currencyPair, fetchMultipleRate, function (err, rate) {
        if (err) {
          return callback(err, null);
        }

        // set the rates in cache if cahce == true
        if (options.cache) {
          memCahce.setExchangeRate(currencyPair.toString(), rate, options.ttl ? options.ttl : 360000);
        }

        return callback(null, rate);
      });
    }
    catch (err) {
      callback(err, null);
    }

  }
};
