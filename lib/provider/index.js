/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var path = require('path');

/**
 * Setup all providers as lazy-loaded getters.
 */
Object.defineProperties(
    exports,
    ['Google']
        .reduce(function (acc, name) {
            acc[name] = {
                configurable: true,
                enumerable: true,
                get: function () {
                    var fullpath = path.join('./', name.toLowerCase());
                    return require(fullpath);
                }
            };

            return acc;
        }, {})
);