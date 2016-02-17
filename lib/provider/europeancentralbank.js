/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var util = require('util');
var xmldoc = require("xmldoc");
var AbstractProvider = require('./abstract');
var _ = require('lodash');
var Rate = require('../model/rate');
var UnsupportedCurrencyPairException = require('../error/UnsupportedCurrencyPairException');

const URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
const Provider = 'European Central Bank';

/**
 * European Central Bank provider.
 *
 */
var EuropeanCentralBankProvider = module.exports = function () {
    EuropeanCentralBankProvider.super_.call(this);

    this.parseContent = function (content) {
        return new xmldoc.XmlDocument(content);
    }
};

/**
 * Inherit from abstract provider
 */
util.inherits(EuropeanCentralBankProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
EuropeanCentralBankProvider.prototype.fetchRate = function (currencyPair, callback) {
    var self = this;

    if (currencyPair.getBaseCurrency() !== 'EUR') {
        return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
    }

    self.fetchContent(URL, function (err, content) {
        if (err) {
            return callback(err, null);
        }

        // Parse the content fetch from european central bank
        var xmlObj = self.parseContent(content);
        var rootCube = xmlObj.childNamed("Cube");
        var cube = rootCube.childNamed("Cube");

        if (cube === null || _.isUndefined(cube) || _.isUndefined(cube.attr)) {
            return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
        }

        // search for quote currency rate
        var rateElement = cube.childWithAttribute('currency', currencyPair.getQuoteCurrency());

        if (rateElement === null || _.isUndefined(rateElement) || _.isUndefined(rateElement.attr)) {
            return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
        }

        return callback(null, new Rate(_.toNumber(rateElement.attr.rate), new Date(cube.attr.time), Provider));
    });
};

/**
 * Fetch rate synchronously
 * @param currencyPair
 */
EuropeanCentralBankProvider.prototype.fetchRateSync = function (currencyPair) {
    var self = this;

    if (currencyPair.getBaseCurrency() !== 'EUR') {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }
    var content = this.fetchContentSync(URL);

    // Parse the content fetch from european central bank
    var xmlObj = self.parseContent(content);
    var rootCube = xmlObj.childNamed("Cube");
    var cube = rootCube.childNamed("Cube");

    if (cube === null || _.isUndefined(cube) || _.isUndefined(cube.attr)) {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    // search for quote currency rate
    var rateElement = cube.childWithAttribute('currency', currencyPair.getQuoteCurrency());

    if (rateElement === null || _.isUndefined(rateElement) || _.isUndefined(rateElement.attr)) {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    return new Rate(_.toNumber(rateElement.attr.rate), new Date(cube.attr.time), Provider);
};