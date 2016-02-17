/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

/**
 *
 * Common utility functions
 */

var GoogleFinanceProvider = require('../provider/googlefinance');
var async = require('async');

module.exports = {
    /**
     * verify if provider is in available provider list
     * @param provider
     * @returns {boolean}
     */
    verifyProvider: function (provider) {
        var isAvailableProvider = false;

        if (provider instanceof GoogleFinanceProvider) {
            isAvailableProvider = true;
        }

        return isAvailableProvider;
    },

    /**
     * fetch exchange rates from providers synchronously
     * breaks on successful fetch
     * @param providers
     * @param currencyPair
     * @returns {*}
     */
    getExchangeRateSync: function (providers, currencyPair) {
        var exceptions = [];
        var rate = null;

        providers.some(function (provider) {
            try {
                rate = provider.fetchRateSync(currencyPair);
                return rate !== null;
            }
            catch (e) {
                exceptions.push(e)
            }
        });

        if (rate == null) {
            throw new Error(exceptions.join(','));
        }

        return rate;
    },

    /**
     * fetch exchange rates from providers asynchronously
     * breaks on successful fetch
     * @param providers
     * @param currencyPair
     * @param callback
     * @returns {*}
     */
    getExchangeRate: function (providers, currencyPair, callback) {
        var exceptions = [];
        var rate = null;

        async.each(providers, function (provider, cb) {
            provider.fetchRate(currencyPair, function (err, exchangeRate) {
                if (err) {
                    exceptions.push(err);
                    cb();
                }
                else {
                    rate = exchangeRate;
                    cb(new Error('Exchange rate found.'));
                }
            })

        }, function (err, result) {
            if (rate == null) {
                callback(new Error(exceptions.join(',')), null);
            }

            callback(null, rate);
        });
    }
};