/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var util = require('util');
var AbstractProvider = require('./abstract');
var sprintf = require("sprintf-js").sprintf;
var _ = require('lodash');
var Rate = require('../model/rate');
var UnsupportedCurrencyPairException = require('../error/UnsupportedCurrencyPairException');

const URL = 'http://apilayer.net/api/convert?access_key=%s&from=%s&to=%s&amount=1&format=1';
const Provider = 'Currency Layer';

/**
 * Currency Layer provider.
 * * @param options
 * @param {string} options.accessKey The application access key
 * @params {number} options.timeout Specify the timeout for request.
 * (optional) default: 3000ms
 */
var CurrencyLayerProvider = module.exports = function (options) {
    CurrencyLayerProvider.super_.call(this);

    if (_.isUndefined(options) || _.isUndefined(options.accessKey)) {
        throw new Error('Missing access key from Currency Layer');
    }

    this.accessKey = options.accessKey;

    // set the request options
    var requestOptions = {};
    requestOptions.timeout = options.timeout ? options.timeout : 3000;
    this.setRequestOptions(requestOptions);

    this.parseContent = function (content) {
        try {
            return JSON.parse(content);
        }
        catch (err) {
            throw new Error('Failed to parse data from provider due to format change');
        }
    }
};

/**
 * Inherit from abstract provider
 */
util.inherits(CurrencyLayerProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
CurrencyLayerProvider.prototype.fetchRate = function (currencyPair, callback) {
    var self = this;

    var url = sprintf(URL, self.accessKey, currencyPair.getBaseCurrency() + currencyPair.getQuoteCurrency());

    self.fetchContent(url, function (err, content) {
        if (err) {
            return callback(err, null);
        }

        try {
            // Parse the content fetch from currency layer
            var data = self.parseContent(content);

            if (!data.success && data.error) {
                return callback(new Error(data.error.info), null);
            }

            if (_.isUndefined(data) || _.isUndefined(data.result)) {
                return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
            }

            var date = data.info && data.info.timestamp ? new Date(data.info.timestamp * 1000) : new Date();
            return callback(null, new Rate(data.result.toString(), date, Provider));
        }
        catch (err) {
            return callback(err, null);
        }
    });
};

/**
 * Fetch rate synchronously
 * @param currencyPair
 */
CurrencyLayerProvider.prototype.fetchRateSync = function (currencyPair) {
    var self = this;

    var url = sprintf(URL, self.accessKey, currencyPair.getBaseCurrency() + currencyPair.getQuoteCurrency());
    var content = this.fetchContentSync(url);

    // Parse the content fetch from currency layer
    var data = self.parseContent(content);

    if (!data.success && data.error) {
        throw new Error(data.error.info);
    }

    if (_.isUndefined(data) || _.isUndefined(data.result)) {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    var date = data.info && data.info.timestamp ? new Date(data.info.timestamp * 1000) : new Date();
    return new Rate(data.result.toString(), date, Provider);
};
