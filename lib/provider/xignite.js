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

const URL = 'https://globalcurrencies.xignite.com/xGlobalCurrencies.json/GetRealTimeRates?Symbols=%s&_fields=Outcome,Message,Symbol,Date,Time,Bid&_Token=%s';
const Provider = 'Xignite';

/**
 * Open Exchange Rates provider.
 * @param token The application token
 * (optional) default false
 */
var XigniteProvider = module.exports = function (token) {
    XigniteProvider.super_.call(this);

    this.token = token;

    if (_.isUndefined(this.token)) {
        throw new Error('Missing token from Xignite');
    }

    this.parseContent = function (content) {
        try {
            return JSON.parse(content)[0];
        }
        catch (err) {
            throw new Error('Failed to parse data from provider due to format change');
        }
    }
};

/**
 * Inherit from abstract provider
 */
util.inherits(XigniteProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
XigniteProvider.prototype.fetchRate = function (currencyPair, callback) {
    var self = this;

    var url = sprintf(URL, currencyPair.getBaseCurrency() + currencyPair.getQuoteCurrency(), self.token);

    self.fetchContent(url, function (err, content) {
        if (err) {
            return callback(err, null);
        }

        try {
            // Parse the content fetch from open exchange rate
            var data = self.parseContent(content);

            if ('Success' !== data['Outcome']) {
                callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
            }

            if (_.isUndefined(data.Bid)) {
                callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
            }

            var date = data.Date ? new Date(data.Date) : new Date();
            callback(null, new Rate(_.toNumber(data.Bid), date, Provider));
        }
        catch (err) {
            callback(err, null);
        }
    });
};

/**
 * Fetch rate synchronously
 * @param currencyPair
 */
XigniteProvider.prototype.fetchRateSync = function (currencyPair) {
    var self = this;

    var url = sprintf(URL, currencyPair.getBaseCurrency() + currencyPair.getQuoteCurrency(), self.token);
    var content = this.fetchContentSync(url);

    // Parse the content fetch from open exchange rate
    var data = self.parseContent(content);

    if ('Success' !== data['Outcome']) {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    if (_.isUndefined(data.Bid)) {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    var date = data.Date ? new Date(data.Date) : new Date();
    return new Rate(_.toNumber(data.Bid), date, Provider);
};