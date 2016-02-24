/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

/**
 * Setup all providers as lazy-loaded getters.
 */
Object.defineProperties(
  exports,
    [
        'GoogleFinance',
        'EuropeanCentralBank',
        'NationalBankOfRomania',
        'YahooFinance',
        'OpenExchangeRates',
        'Xignite',
        'CurrencyLayer'
    ]
    .reduce(function (acc, name) {
      acc[name] = {
        configurable: true,
        enumerable: true,
        get: function () {
          var fullpath = './' + name.toLowerCase();
          return require(fullpath);
        }
      };
      return acc;
    }, {})
);
