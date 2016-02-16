/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
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
     * Include providers defined by swap
     */
    providers: require('./provider'),

    /**
     * Add provider to be used by quote
     * @param provider
     * @returns {Number}
     */
    addProvider: function (provider) {
        if (!utils.verifyProvider(provider)) {
            throw new Error('Provider should be one of the available provider.');
        }

        providersToUtilize.push(provider);
        return providersToUtilize.length;
    },

    /**
     *
     * @param currency
     * @param cache
     * @param ttl
     * @returns {*}
     */
    quoteSync: function (currency, cache, ttl) {
        if (providersToUtilize.length == 0) {
            throw new Error('Add at least one provider to get the exchange rates');
        }

        // create a currency pair based on the provided currency string or object
        var currencyPair = new CurrencyPair(currency);

        var rate = null;
        // cache == true and rate is available in cache return rate.
        if (cache && null !== (rate = memCahce.getExchangeRate(currencyPair.toString()))) {
            return rate
        }

        // fetch exchange rate
        rate = utils.getExchangeRateSync(providersToUtilize, currencyPair);

        // set the rates in cache if cahce == true
        if (cache) {
            memCahce.setExchangeRate(currencyPair.toString(), rate, ttl ? ttl : 360000);
        }

        return rate;
    }
};