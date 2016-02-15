/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var _ = require('lodash');

/**
 *
 * Represents a currency pair.
 */
var CurrencyPair = module.exports = function (currencyPair) {
    if (_.isString(currencyPair)) {
        var parts = _.split(currencyPair, '/');

        if (_.isEmpty(parts[0]) || parts[0].length !== 3 || _.isEmpty(parts[1]) || parts[1].length !== 3) {
            throw new Error("");
        }

        this.baseCurrency = parts[0];
        this.quoteCurrency = parts[1];

    }
    else if (_.isPlainObject(currencyPair)) {
        if (!currencyPair.baseCurrency || !currencyPair.quoteCurrency) {
            throw new Error("");
        }

        this.baseCurrency = currencyPair.baseCurrency;
        this.quoteCurrency = currencyPair.quoteCurrency;
    }
};

/**
 * Gets the base currency.
 * @returns string
 */
CurrencyPair.prototype.getBaseCurrency = function () {
    return this.baseCurrency;
};

/**
 * Gets the quote currency.
 * @returns string
 */
CurrencyPair.prototype.getQuoteCurrency = function () {
    return this.quoteCurrency;
};

/**
 * Returns a string representation of the pair.
 * @returns string
 */
CurrencyPair.prototype.toString = function () {
    return this.baseCurrency + '/' + this.quoteCurrency;
};