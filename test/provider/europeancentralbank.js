/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var assert = require('chai').assert;
var CurrencyPair = require('../../lib/model/currencypair');
var EuropeanCentralBankProvider = require('../../lib/provider/europeancentralbank');

describe('european cental bank provider', function () {
    it('it_throws_an_exception_when_base_rate_is_not_EUR_sync', function () {
        var provider = new EuropeanCentralBankProvider();
        var currencyPair = new CurrencyPair('USD/AED');

        assert.throw(function () {
            provider.fetchRateSync(currencyPair);
        }, Error, 'The currency pair "USD/AED" is not supported by European Central Bank')
    });

    it('it_throws_an_exception_when_rate_not_supported', function () {
        var provider = new EuropeanCentralBankProvider();
        var currencyPair = new CurrencyPair('EUR/AED');

        assert.throw(function () {
            provider.fetchRateSync(currencyPair);
        }, Error, 'The currency pair "EUR/AED" is not supported by European Central Bank')
    });

    it('it_fetches_a_rate_sync', function () {
        var provider = new EuropeanCentralBankProvider();
        var rate = provider.fetchRateSync(new CurrencyPair('EUR/USD'));
        assert.isDefined(rate.getValue());
        assert.isDefined(rate.getDate());
    });

    it('it_throws_an_exception_when_base_rate_is_not_EUR', function (done) {
        var provider = new EuropeanCentralBankProvider();
        var currencyPair = new CurrencyPair('USD/AED');

        provider.fetchRate(currencyPair, function (err, rate) {
            assert.throw(function () {
                throw err;
            }, Error, 'The currency pair "USD/AED" is not supported by European Central Bank');
            done();
        });
    });

    it('it_throws_an_exception_when_rate_not_supported', function (done) {
        var provider = new EuropeanCentralBankProvider();
        var currencyPair = new CurrencyPair('EUR/AED');

        provider.fetchRate(currencyPair, function (err, rate) {
            assert.throw(function () {
                throw err;
            }, Error, 'The currency pair "EUR/AED" is not supported by European Central Bank');
            done();
        });
    });

    it('it_fetches_a_rate', function (done) {
        var provider = new EuropeanCentralBankProvider();
        provider.fetchRate(new CurrencyPair('EUR/USD'), function (err, rate) {
            assert.isDefined(rate.getValue());
            assert.isDefined(rate.getDate());
            done();
        });
    });
});