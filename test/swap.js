/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var assert = require('chai').assert;
var swap = require('../lib/swap');

describe('swap', function () {
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

    it('it_add_provider', function () {
        var length = swap.addProvider(new swap.providers.GoogleFinance());
        assert.isAbove(length, 0);
    });

    it('it_fetch_rate_sync', function () {
        var rate = swap.quoteSync({currency: 'USD/AED'});
        assert.isDefined(rate.getValue());
        assert.isDefined(rate.getDate());
    });

    it('it_fetch_rate_and_cache_sync', function () {
        var rate = swap.quoteSync({currency: 'USD/AED', cache:true});
        assert.isDefined(rate.getValue());
        assert.isDefined(rate.getDate());
    });

    it('it_fetch_rate_from_cache_sync', function () {
        var rate = swap.quoteSync({currency: 'USD/AED', cache:true});
        assert.isDefined(rate.getValue());
        assert.isDefined(rate.getDate());
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
            assert.isDefined(rate.getValue());
            assert.isDefined(rate.getDate());
            done();
        });
    });

    it('it_fetch_rate_and_cache', function (done) {
        swap.quote({currency: 'USD/SAR', cache: true}, function (err, rate) {
            assert.isDefined(rate.getValue());
            assert.isDefined(rate.getDate());
            done();
        });
    });

    it('it_fetch_rate_from_cache', function (done) {
        swap.quote({currency: 'USD/SAR', cache: true}, function (err, rate) {
            assert.isDefined(rate.getValue());
            assert.isDefined(rate.getDate());
            done();
        });
    });
});