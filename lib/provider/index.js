/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

/**
 * Setup all providers as lazy-loaded getters.
 */
Object.defineProperties(
    exports,
    ['GoogleFinance', 'EuropeanCentralBank', 'NationalBankOfRomania']
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