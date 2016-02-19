/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var assert = require('chai').assert;
var CurrencyPair = require('../../lib/model/currencypair');
var OpenExchangeRatesProvider = require('../../lib/provider/openexchangerates');
var UnsupportedCurrencyPairException = require('../../lib/error/UnsupportedCurrencyPairException');
var appId = 'ddab3960f11248e7bd1807d821911195';

describe('open exchange rates provider', function () {
  it('it_throws_an_exception_when_appId_not provided', function () {
    assert.throw(function () {
      new OpenExchangeRatesProvider();
    }, Error, 'Missing appId from open exchange rates')
  });

  it('it_throws_an_exception_when_rate_not_supported_sync', function () {
    var provider = new OpenExchangeRatesProvider({appId: appId});
    var currencyPair = new CurrencyPair('USD/XXL');

    assert.throw(function () {
        provider.fetchRateSync(currencyPair);
      }, UnsupportedCurrencyPairException,
      'The currency pair "USD/XXL" is not supported or "Open Exchange Rates" changed the response format')
  });

  it('it_fetches_a_rate_sync', function () {
    var provider = new OpenExchangeRatesProvider({appId: appId});
    var rate = provider.fetchRateSync(new CurrencyPair('USD/AED'));
    assert.isDefined(rate.getValue());
    assert.isDefined(rate.getDate());
  });

  it('it_throws_an_exception_when_rate_not_supported', function (done) {
    var provider = new OpenExchangeRatesProvider({appId: appId});
    var currencyPair = new CurrencyPair('USD/XXL');

    provider.fetchRate(currencyPair, function (err, rate) {
      assert.throw(function () {
          throw err;
        }, UnsupportedCurrencyPairException,
        'The currency pair "USD/XXL" is not supported or "Open Exchange Rates" changed the response format');
      done();
    });
  });

  it('it_fetches_a_rate', function (done) {
    var provider = new OpenExchangeRatesProvider({appId: appId});
    provider.fetchRate(new CurrencyPair('USD/AED'), function (err, rate) {
      assert.isDefined(rate.getValue());
      assert.isDefined(rate.getDate());
      done();
    });
  });
});
