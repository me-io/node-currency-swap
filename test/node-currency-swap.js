/*
 * This file is part of node-currency-swap.
 *
 * (C) 2016 tajawal
 * Apache Software License v2.0
 *
 */

var assert = require('chai').assert;
var swap = require('../lib/node-currency-swap');

describe('node-currency-swap', function () {
  it('it_throws_an_exception_when_adding_wrong_provider', function () {
    assert.throw(function () {
      swap.addProvider('fdfsfs')
    }, Error, 'Provider should be one of the available provider.')
  });

  it('it_throws_an_exception_when_options_is_not_an_object_sync', function () {
    assert.throw(function () {
      swap.quoteSync('fds');
    }, Error, 'Options should be an object')
  });

  it('it_throws_an_exception_when_options_does_not_contains_currency_sync', function () {
    assert.throw(function () {
      swap.quoteSync({cache: true});
    }, Error, 'Currency is required. Either pass it as string or object')
  });

  it('it_throws_an_exception_when_provider_array_is_empty_sync', function () {
    assert.throw(function () {
      swap.quoteSync({currency: 'USD/AED'})
    }, Error, 'Add at least one provider to get the exchange rates')
  });

  it('it_add_provider_and_request_timeout', function () {
    var provider = new swap.providers.GoogleFinance();
    // request timeout provider
    provider.setRequestOptions({timeout: 10000});
    var length = swap.addProvider(provider);
    assert.isAbove(length, 0);
  });

  it('it_throws_an_exception_when_same_provider_added', function () {
    assert.throw(function () {
      swap.addProvider(new swap.providers.GoogleFinance());
    }, Error, 'Provider already added in the list');
  });

  it('it_fetch_rate_sync', function () {
    var rate = swap.quoteSync({currency: 'USD/AED'});
    assert.isAbove(rate.length, 0);
  });

  it('it_fetch_rate_multiple_providers_sync', function () {
    swap.addProvider(new swap.providers.EuropeanCentralBank());
    var rate = swap.quoteSync({currency: 'EUR/USD', fetchMultipleRate: true});
    assert.isAbove(rate.length, 1);
  });

  it('it_fetch_rate_and_cache_sync', function () {
    var rate = swap.quoteSync({currency: 'USD/AED', cache: true});
    assert.isAbove(rate.length, 0);
  });

  it('it_fetch_rate_from_cache_sync', function () {
    var rate = swap.quoteSync({currency: 'USD/AED', cache: true});
    assert.isAbove(rate.length, 0);
  });

  it('it_throws_an_exception_when_options_is_not_an_object', function (done) {
    swap.quote('test', function (err, rate) {
      assert.throw(function () {
        throw err;
      }, Error, 'Options should be an object');
      done();
    });
  });

  it('it_throws_an_exception_when_options_does_not_contains_currency', function (done) {
    swap.quote({cache: true}, function (err, rate) {
      assert.throw(function () {
        throw err;
      }, Error, 'Currency is required. Either pass it as string or object');
      done();
    });
  });

  it('it_fetch_rate', function (done) {
    swap.quote({currency: 'USD/SAR'}, function (err, rate) {
      assert.isAbove(rate.length, 0);
      done();
    });
  });

  it('it_fetch_rate_multiple_providers', function (done) {
    swap.quote({currency: 'EUR/USD', fetchMultipleRate: true}, function (err, rate) {
      assert.isAbove(rate.length, 1);
      done();
    });
  });

  it('it_fetch_rate_and_cache', function (done) {
    swap.quote({currency: 'USD/SAR', cache: true}, function (err, rate) {
      assert.isAbove(rate.length, 0);
      done();
    });
  });

  it('it_fetch_rate_from_cache', function (done) {
    swap.quote({currency: 'USD/SAR', cache: true}, function (err, rate) {
      assert.isAbove(rate.length, 0);
      done();
    });
  });
});
