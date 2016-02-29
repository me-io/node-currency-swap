/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var assert = require('chai').assert;
var CurrencyPair = require('../../lib/model/currencypair');
var CurrencyLayerProvider = require('../../lib/provider/currencylayer');
var UnsupportedCurrencyPairException = require('../../lib/error/UnsupportedCurrencyPairException');
var accessKey = 'e6c9fc1745c4f0d5c1d2776e8b59e5f3';

describe('currency layer provider', function () {
    before(function (done) {
        var provider = new CurrencyLayerProvider({accessKey: accessKey});
        provider.fetchRate(new CurrencyPair('USD/EUR'), function (err, rate) {
            if(err){
                return done(err);
            }

            done();

        });
    });

    it('it_throws_an_exception_when_access_key_not provided', function () {
        assert.throw(function () {
            new CurrencyLayerProvider();
        }, Error, 'Missing access key from Currency Layer')
    });

    it('it_throws_an_exception_when_rate_not_supported_sync', function () {
        var provider = new CurrencyLayerProvider({accessKey: accessKey});
        var currencyPair = new CurrencyPair('USD/XXL');

        assert.throw(function () {
                provider.fetchRateSync(currencyPair);
            }, Error)
    });

    it('it_fetches_a_rate_sync', function () {
        var provider = new CurrencyLayerProvider({accessKey: accessKey});
        var rate = provider.fetchRateSync(new CurrencyPair('USD/EUR'));
        assert.isDefined(rate.getValue());
        assert.isDefined(rate.getDate());
    });

    it('it_throws_an_exception_when_rate_not_supported', function (done) {
        var provider = new CurrencyLayerProvider({accessKey: accessKey});
        var currencyPair = new CurrencyPair('USD/XXL');

        provider.fetchRate(currencyPair, function (err, rate) {
            assert.throw(function () {
                    throw err;
                }, Error);
            done();
        });
    });

    it('it_fetches_a_rate', function (done) {
        var provider = new CurrencyLayerProvider({accessKey: accessKey});
        provider.fetchRate(new CurrencyPair('USD/EUR'), function (err, rate) {
            assert.isDefined(rate.getValue());
            assert.isDefined(rate.getDate());
            done();
        });
    });
});
