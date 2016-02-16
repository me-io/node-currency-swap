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

    it('it_throws_an_exception_when_provider_array_is_empty', function () {
        assert.throw(function () {
            swap.quoteSync('USD/AED')
        }, Error, 'Add at least one provider to get the exchange rates')
    });

    it('it_add_provider', function () {
        var length = swap.addProvider(new swap.providers.GoogleFinance());
        assert.isAbove(length, 0);
    });

    it('it_fetch_rate', function () {
        var rate = swap.quoteSync('USD/AED');
        assert.isDefined(rate.getValue());
        assert.isDefined(rate.getDate());
    });

    it('it_fetch_rate_and_cache', function () {
        var rate = swap.quoteSync('USD/AED', true);
        assert.isDefined(rate.getValue());
        assert.isDefined(rate.getDate());
    });

    it('it_fetch_rate_from_cache', function () {
        var rate = swap.quoteSync('USD/AED', true);
        assert.isDefined(rate.getValue());
        assert.isDefined(rate.getDate());
    });
});