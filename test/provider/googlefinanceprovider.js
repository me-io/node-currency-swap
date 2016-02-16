/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var assert = require('chai').assert;
var CurrencyPair = require('../../lib/model/currencypair');
var GoogleFinanceProvider = require('../../lib/provider/googlefinanceprovider');

describe('google finance provider', function () {
    it('it_throws_an_exception_when_rate_not_supported_sync', function () {
        var provider = new GoogleFinanceProvider();
        var currencyPair = new CurrencyPair('USD/XXL');

        assert.throw(function () {
            provider.fetchRateSync(currencyPair);
        }, Error, 'The currency is not supported or Google changed the response format')
    });

    it('it_fetches_a_rate_sync', function () {
        var provider = new GoogleFinanceProvider();
        var rate = provider.fetchRateSync(new CurrencyPair('USD/AED'));
        assert.isDefined(rate.getValue());
        assert.isDefined(rate.getDate());
    });

    it('it_throws_an_exception_when_rate_not_supported', function (done) {
        var provider = new GoogleFinanceProvider();
        var currencyPair = new CurrencyPair('USD/XXL');

        provider.fetchRate(currencyPair, function (err, rate) {
            assert.throw(function () {
                throw err;
            }, Error, 'The currency is not supported or Google changed the response format');
            done();
        });
    });

    it('it_fetches_a_rate', function (done) {
        var provider = new GoogleFinanceProvider();
        provider.fetchRate(new CurrencyPair('USD/AED'), function(err, rate){
            assert.isDefined(rate.getValue());
            assert.isDefined(rate.getDate());
            done();
        });
    });
});