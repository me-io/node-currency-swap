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
     * fetch exchange rates from providers
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

        if (exceptions.length !== 0) {
            throw new Error(exceptions.join(','));
        }

        return rate;
    }
};