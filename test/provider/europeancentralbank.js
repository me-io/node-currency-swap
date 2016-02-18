/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var assert = require('chai').assert;
var CurrencyPair = require('../../lib/model/currencypair');
var EuropeanCentralBankProvider = require('../../lib/provider/europeancentralbank');
var UnsupportedCurrencyPairException = require('../../lib/error/UnsupportedCurrencyPairException');

describe('european cental bank provider', function () {
  it('it_throws_an_exception_when_base_rate_is_not_EUR_sync', function () {
    var provider = new EuropeanCentralBankProvider();
    var currencyPair = new CurrencyPair('USD/AED');

    assert.throw(function () {
        provider.fetchRateSync(currencyPair);
      }, UnsupportedCurrencyPairException,
      'The currency pair "USD/AED" is not supported or "European Central Bank" changed the response format')
  });

  it('it_throws_an_exception_when_rate_not_supported_sync', function () {
    var provider = new EuropeanCentralBankProvider();
    var currencyPair = new CurrencyPair('EUR/AED');

    assert.throw(function () {
        provider.fetchRateSync(currencyPair);
      }, UnsupportedCurrencyPairException,
      'The currency pair "EUR/AED" is not supported or "European Central Bank" changed the response format')
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
        }, UnsupportedCurrencyPairException,
        'The currency pair "USD/AED" is not supported or "European Central Bank" changed the response format');
      done();
    });
  });

  it('it_throws_an_exception_when_rate_not_supported', function (done) {
    var provider = new EuropeanCentralBankProvider();
    var currencyPair = new CurrencyPair('EUR/AED');

    provider.fetchRate(currencyPair, function (err, rate) {
      assert.throw(function () {
          throw err;
        }, UnsupportedCurrencyPairException,
        'The currency pair "EUR/AED" is not supported or "European Central Bank" changed the response format');
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
