/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var assert = require('chai').assert;
var CurrencyPair = require('../../lib/model/currencypair');
var NationalBankOfRomaniaProvider = require('../../lib/provider/nationalbankofromania');
var UnsupportedCurrencyPairException = require('../../lib/error/UnsupportedCurrencyPairException');

describe('national bank of romania provider', function () {
  it('it_throws_an_exception_when_base_rate_is_not_RON_sync', function () {
    var provider = new NationalBankOfRomaniaProvider();
    var currencyPair = new CurrencyPair('USD/AED');

    assert.throw(function () {
        provider.fetchRateSync(currencyPair);
      }, UnsupportedCurrencyPairException,
      'The currency pair "USD/AED" is not supported or "National Bank of Romania" changed the response format')
  });

  it('it_throws_an_exception_when_rate_not_supported_sync', function () {
    var provider = new NationalBankOfRomaniaProvider();
    var currencyPair = new CurrencyPair('RON/PKR');

    assert.throw(function () {
        provider.fetchRateSync(currencyPair);
      }, UnsupportedCurrencyPairException,
      'The currency pair "RON/PKR" is not supported or "National Bank of Romania" changed the response format')
  });

  it('it_fetches_a_rate_sync', function () {
    var provider = new NationalBankOfRomaniaProvider();
    var rate = provider.fetchRateSync(new CurrencyPair('RON/USD'));
    assert.isDefined(rate.getValue());
    assert.isDefined(rate.getDate());
  });

  it('it_throws_an_exception_when_base_rate_is_not_RON', function (done) {
    var provider = new NationalBankOfRomaniaProvider();
    var currencyPair = new CurrencyPair('USD/AED');

    provider.fetchRate(currencyPair, function (err, rate) {
      assert.throw(function () {
          throw err;
        }, UnsupportedCurrencyPairException,
        'The currency pair "USD/AED" is not supported or "National Bank of Romania" changed the response format');
      done();
    });
  });

  it('it_throws_an_exception_when_rate_not_supported', function (done) {
    var provider = new NationalBankOfRomaniaProvider();
    var currencyPair = new CurrencyPair('RON/PKR');

    provider.fetchRate(currencyPair, function (err, rate) {
      assert.throw(function () {
          throw err;
        }, UnsupportedCurrencyPairException,
        'The currency pair "RON/PKR" is not supported or "National Bank of Romania" changed the response format');
      done();
    });
  });

  it('it_fetches_a_rate', function (done) {
    var provider = new NationalBankOfRomaniaProvider();
    provider.fetchRate(new CurrencyPair('RON/USD'), function (err, rate) {
      assert.isDefined(rate.getValue());
      assert.isDefined(rate.getDate());
      done();
    });
  });
});
