/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var cache = require('memory-cache');

module.exports = {
    /**
     * set exchange rate in memory
     * @param key
     * @param data
     * @param ttl
     */
    setExchangeRate: function (key, data, ttl) {
        cache.put(key, data, ttl);
    },

    /**
     * get exchange rate from memory
     * @param key
     */
    getExchangeRate: function (key) {
        return cache.get(key);
    }
};