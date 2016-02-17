/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var sprintf = require("sprintf-js").sprintf;

/**
 *
 * @param message
 */
var UnsupportedCurrencyPairException = module.exports = function (currencyPair, providerName) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = sprintf('The currency pair "%s" is not supported or "%s" changed the response format', currencyPair, providerName);
};

require('util').inherits(UnsupportedCurrencyPairException, Error);