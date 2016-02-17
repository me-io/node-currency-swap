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

const URL = 'http://www.bnr.ro/nbrfxrates.xml';
const Provider = 'National Bank of Romania';

/**
 * National Bank of Romania provider.
 *
 */
var NationalBankOfRomaniaProvider = module.exports = function () {
    NationalBankOfRomaniaProvider.super_.call(this);

    this.parseContent = function (content) {
        return new xmldoc.XmlDocument(content);
    }
};

/**
 * Inherit from abstract provider
 */
util.inherits(NationalBankOfRomaniaProvider, AbstractProvider);

/**
 * Fetch rate
 * @param currencyPair
 * @param callback
 */
NationalBankOfRomaniaProvider.prototype.fetchRate = function (currencyPair, callback) {
    var self = this;

    if (currencyPair.getBaseCurrency() !== 'RON') {
        return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
    }

    self.fetchContent(URL, function (err, content) {
        if (err) {
            return callback(err, null);
        }

        // Parse the content fetch from national bank of romania
        var xmlObj = self.parseContent(content);
        var rootCube = xmlObj.childNamed("Body");
        var cube = rootCube.childNamed("Cube");

        // return error if date is not available
        if (cube === null || _.isUndefined(cube) || _.isUndefined(cube.attr) || _.isUndefined(cube.attr.date)) {
            return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
        }

        // search for quote currency rate
        var rateElement = cube.childWithAttribute('currency', currencyPair.getQuoteCurrency());

        // return error if rate is not available
        if (rateElement === null || _.isUndefined(rateElement) || _.isUndefined(rateElement.attr) || _.isUndefined(rateElement.val)) {
            return callback(new UnsupportedCurrencyPairException(currencyPair, Provider), null);
        }

        var rate = rateElement.attr.multiplier ? _.toNumber(rateElement.val) / _.toNumber(rateElement.attr.multiplier) : _.toNumber(rateElement.val);

        return callback(null, new Rate(rate, new Date(cube.attr.date), Provider));
    });
};

/**
 * Fetch rate synchronously
 * @param currencyPair
 */
NationalBankOfRomaniaProvider.prototype.fetchRateSync = function (currencyPair) {
    var self = this;

    if (currencyPair.getBaseCurrency() !== 'RON') {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }
    var content = this.fetchContentSync(URL);

    // Parse the content fetch from national bank of romania
    var xmlObj = self.parseContent(content);
    var rootCube = xmlObj.childNamed("Body");
    var cube = rootCube.childNamed("Cube");

    // throw exception if date is not available
    if (cube === null || _.isUndefined(cube) || _.isUndefined(cube.attr) || _.isUndefined(cube.attr.date)) {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    // search for quote currency rate
    var rateElement = cube.childWithAttribute('currency', currencyPair.getQuoteCurrency());

    // throw exception if rate is not available
    if (rateElement === null || _.isUndefined(rateElement) || _.isUndefined(rateElement.attr) || _.isUndefined(rateElement.val)) {
        throw new UnsupportedCurrencyPairException(currencyPair, Provider);
    }

    var rate = rateElement.attr.multiplier ? _.toNumber(rateElement.val) / _.toNumber(rateElement.attr.multiplier) : _.toNumber(rateElement.val);

    return new Rate(rate, new Date(cube.attr.date), Provider);
};