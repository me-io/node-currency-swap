/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var util = require('util');
var AbstractProvider = require('./abstract');
var sprintf = require("sprintf-js").sprintf;
var _ = require('lodash');
var Rate = require('../model/rate');
var UnsupportedCurrencyPairException = require('../error/UnsupportedCurrencyPairException');

const URL = 'https://query.yahooapis.com/v1/public/yql?q=%s&env=store://datatables.org/alltableswithkeys&format=json';
const Provider = 'Yahoo Finance';

/**
 * Yahoo Finance provider.
 *
 */
var YahooFinanceProvider = module.exports = function () {
    YahooFinanceProvider.super_.call(this);

    this.parseContent = function (content) {
        try {
            var jsonContent = JSON.parse(content);
            return {
                created: jsonContent.query.created,
                rate: jsonContent.query.results.rate
            };
        }
        catch (err) {
            throw new Error('Failed to parse data from provider due to format change');
        }
    }
};

/**
 * Inherit from abstract provider
 */
util.inherits(YahooFinanceProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
YahooFinanceProvider.prototype.fetchRate = function (currencyPair, callback) {
    var self = this;
    var queryPairs = sprintf('"%s%s"', currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
    var query = sprintf('select * from yahoo.finance.xchange where pair in (%s)', queryPairs);
    var url = sprintf(URL, query);

    self.fetchContent(url, function (err, content) {
        if (err) {
            return callback(err, null);
        }

        try {
            // Parse the content fetch from yahoo finance
            var data = self.parseContent(content);

            // return error if rate and date is not available
            if (data === null || _.isUndefined(data) || _.isUndefined(data.rate) || _.isUndefined(data.rate.Rate) || data.rate.Rate === 'N/A') {
                return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
            }

            var date = data.created ? new Date(data.created) : new Date();
            return callback(null, new Rate(_.toNumber(data.rate.Rate), date, Provider));
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
YahooFinanceProvider.prototype.fetchRateSync = function (currencyPair) {
    var self = this;

    var queryPairs = sprintf('"%s%s"', currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
    var query = sprintf('select * from yahoo.finance.xchange where pair in (%s)', queryPairs);
    var url = sprintf(URL, query);
    var content = this.fetchContentSync(url);

    // Parse the content fetch from yahoo finance
    var data = self.parseContent(content);

    // throw exception if rate and date is not available
    if (data === null || _.isUndefined(data) || _.isUndefined(data.rate) || _.isUndefined(data.rate.Rate) || data.rate.Rate === 'N/A') {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    var date = data.created ? new Date(data.created) : new Date();
    return new Rate(_.toNumber(data.rate.Rate), date, Provider);
};