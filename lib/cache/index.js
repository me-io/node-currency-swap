/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
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
