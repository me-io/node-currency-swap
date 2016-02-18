/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

/**
 *
 * Represents a rate.
 */
var Rate = module.exports = function (value, date, provider) {
  this.value = value;
  this.date = date ? date : new Date();
  this.provider = provider;
};

/**
 * Gets the rate value.
 * @returns string
 */
Rate.prototype.getValue = function () {
  return this.value;
};

/**
 * Gets the date at which this rate was calculated.
 * @returns datetime
 */
Rate.prototype.getDate = function () {
  return this.date;
};

/**
 * Gets the provider name.
 * @returns string
 */
Rate.prototype.getProvider = function () {
  return this.provider;
};
