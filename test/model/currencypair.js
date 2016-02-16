/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var assert = require('chai').assert;
var CurrencyPair = require('../../lib/model/currencypair');
var InvalidArgumentException = require('../../lib/error/InvalidArgumentException');

describe('currencypair', function () {
    it('it_throws_an_exception_when_creating_from_an_invalid_string', function () {
        assert.throw(function(){ new CurrencyPair('USD');}, InvalidArgumentException(), 'The currency pair must be in the form "USD/AED".')
    });

    it('it_throws_an_exception_when_creating_from_an_invalid_object', function () {
        assert.throw(function(){ new CurrencyPair({base: 'USD', quote: 'AED'});}, InvalidArgumentException(), 'The currency pair must be in the form {baseCurrency:"USD", quoteCurrency:"AED"}')
    });

    it('it_can_be_converted_to_a_string', function () {
        assert.equal('USD/AED', new CurrencyPair('USD/AED').toString())
    });
});