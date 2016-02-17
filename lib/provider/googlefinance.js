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
var cheerio = require('cheerio');
var _ = require('lodash');
var Rate = require('../model/rate');
var UnsupportedCurrencyPairException = require('../error/UnsupportedCurrencyPairException');

const URL = 'http://www.google.com/finance/converter?a=1&from=%s&to=%s';
const Provider = 'Google Finance';

/**
 * Google Finance provider.
 *
 */
var GoogleFinanceProvider = module.exports = function () {
    GoogleFinanceProvider.super_.call(this);

    this.parseContent = function (content) {
        $ = cheerio.load(content);
        return $('span[class=bld]').html();
    }
};

/**
 * Inherit from abstract provider
 */
util.inherits(GoogleFinanceProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
GoogleFinanceProvider.prototype.fetchRate = function (currencyPair, callback) {
    var self = this;
    var url = sprintf(URL, currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
    self.fetchContent(url, function (err, content) {
        if (err) {
            return callback(err, null);
        }

        // Parse the content fetch from google finance
        var bid = self.parseContent(content);

        if (_.isNull(bid) || _.isUndefined(bid) || bid.length === 0) {
            return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
        }

        // split the fetched rate to remove currency symbol and verify if its number
        var parts = _.split(bid, ' ');
        if (parts.length == 0 || !_.toNumber(parts[0])) {
            return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
        }

        return callback(null, new Rate(_.toNumber(parts[0]), new Date(), Provider));
    });
};

/**
 * Fetch rate synchronously
 * @param currencyPair
 */
GoogleFinanceProvider.prototype.fetchRateSync = function (currencyPair) {
    var self = this;

    var url = sprintf(URL, currencyPair.getBaseCurrency(), currencyPair.getQuoteCurrency());
    var content = this.fetchContentSync(url);

    // Parse the content fetch from google finance
    var bid = self.parseContent(content);

    if (_.isNull(bid) || _.isUndefined(bid) || bid.length === 0) {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    // split the fetched rate to remove currency symbol and verify if its number
    var parts = _.split(bid, ' ');
    if (parts.length == 0 || !_.toNumber(parts[0])) {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    return new Rate(_.toNumber(parts[0]), new Date(), Provider);
};