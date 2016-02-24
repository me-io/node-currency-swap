/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var assert = require('chai').assert;
var CurrencyPair = require('../../lib/model/currencypair');
var XigniteProvider = require('../../lib/provider/xignite');
var UnsupportedCurrencyPairException = require('../../lib/error/UnsupportedCurrencyPairException');
var token = '72EB032658E24682A3C8D3BF37EA2A46';

describe('xignite provider', function () {
  before(function (done) {
    var provider = new XigniteProvider({token: token});
    provider.fetchRate(new CurrencyPair('USD/EUR'), function (err, rate) {
      if(err){
        return done(err);
      }

      done();

    });
  });

  it('it_throws_an_exception_when_appId_not provided', function () {
    assert.throw(function () {
      new XigniteProvider();
    }, Error, 'Missing token from Xignite')
  });

  it('it_throws_an_exception_when_rate_not_supported_sync', function () {
    var provider = new XigniteProvider({token: token});
    var currencyPair = new CurrencyPair('USD/XXL');

    assert.throw(function () {
        provider.fetchRateSync(currencyPair);
      }, UnsupportedCurrencyPairException,
      'The currency pair "USD/XXL" is not supported or "Xignite" changed the response format')
  });

  it('it_fetches_a_rate_sync', function () {
    var provider = new XigniteProvider({token: token});
    var rate = provider.fetchRateSync(new CurrencyPair('USD/AED'));
    assert.isDefined(rate.getValue());
    assert.isDefined(rate.getDate());
  });

  it('it_throws_an_exception_when_rate_not_supported', function (done) {
    var provider = new XigniteProvider({token: token});
    var currencyPair = new CurrencyPair('USD/XXL');

    provider.fetchRate(currencyPair, function (err, rate) {
      assert.throw(function () {
          throw err;
        }, UnsupportedCurrencyPairException,
        'The currency pair "USD/XXL" is not supported or "Xignite" changed the response format');
      done();
    });
  });

  it('it_fetches_a_rate', function (done) {
    var provider = new XigniteProvider({token: token});
    provider.fetchRate(new CurrencyPair('USD/AED'), function (err, rate) {
      assert.isDefined(rate.getValue());
      assert.isDefined(rate.getDate());
      done();
    });
  });
});
