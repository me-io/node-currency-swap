# node-currency-swap
Currency Exchange Rates library for nodejs

## Motivation
node-currency-swap is designed to be a simple and universal exchange rate library with support for multiple providers. This library is heavily inspired from [PHP Swap](https://github.com/florianv/swap)

## Installation

```bashp
npm install node-currency-swap
```

## Usage

First, you need to add a provider to swap by using addProvider() method

```js
var swap = require('node-currency-swap');

// Add the google finance provider
swap.addProvider(new swap.providers.GoogleFinance());
```

You can also add multiple providers

```js
var swap = require('node-currency-swap');

// Add the google finance provider
swap.addProvider(new swap.providers.GoogleFinance());

// Add the yahoo finance provider with request timeout option in ms
swap.addProvider(new swap.providers.YahooFinance({timeout: 2000}));

```

### swap.providers

To get the list of all providers

```js
// Returns the list of providers
swap.providers;
```

### quote(options, callback)

To retrieve the latest exchange rate for a currency pair asynchronously.

__Arguments__

* `options` - An object to specify options for quote. For complete list refer [Options Section](#options).
* `callback(err, rate)` - A callback which returns error on any failure or rate array on success.

### quoteSync(options)

To retrieve the latest exchange rate for a currency pair synchronously.

__Arguments__

* `options` - An object to specify options for quote. For complete list refer [Options Section](#options).

### Examples

```js
// if there is single provider in the list it fetch the rate from that provider but if there are multiple provider in the list it fetch the rate from first available one.
swap.quote({currency: 'USD/SAR'}, function (err, rate) {
// print the exchange rate
console.log(rate[0].value);

// print the date from the provider
console.log(rate[0].date);

// print the provider name
console.log(rate[0].provider);
});
```

Synchronously in case of any error it throws an error which you should handle through try/catch

```js
// if there is single provider in the list it fetch the rate from that provider but if there are multiple provider in the list it fetch the rate from first available one.
var rate = swap.quoteSync({currency: 'USD/SAR'});

// print the exchange rate
console.log(rate[0].value);

// print the date from the provider
console.log(rate[0].date);

// print the provider name
console.log(rate[0].provider);
```

To fetch rate from all the added providers

```js
var rates = swap.quoteSync({currency: 'USD/SAR', fetchMultipleRate: true});

rates.forEach(function(rate){
// print the exchange rate
console.log(rate.value);

// print the date from the provider
console.log(rate.date);

// print the provider name
console.log(rate.provider);

});
```

To fetch rate from cache if available if not it fetch the rate from provider and store in cache

```js
var rates = swap.quoteSync({currency: 'USD/SAR', cache: true});

rates.forEach(function(rate){
// print the exchange rate
console.log(rate.value);

// print the date from the provider
console.log(rate.date);

// print the provider name
console.log(rate.provider);

});
```

> Currencies are expressed as their [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) code.

### swap.currencyCodes

Swap provides an object of currency codes so you can use it to avoid typos.

```js
var rates = swap.quoteSync({
    currency: {
            baseCurrency: swap.currencyCodes.ISO_USD,
            quoteCurrency: swap.currencyCodes.ISO_AED
        }
    });
```

## Options

- `currency` - currency info to get exchange rate either as string `USD/AED` or as object `{baseCurrency:'USD', quoteCurrency:'AED'}`.
- `fetchMultipleRate` - if true, fetch rate from all the added providers. (default: `false`)
- `cache` - if true, it tries to fetch rate from cache if available otherwise fetch rate from added provider and store it in cache. (default: `false`)
- `ttl` - time in `ms` to retain rate in cache. (default: `360000`) 1 hour

## Providers

- [European Central Bank](http://www.ecb.europa.eu/home/html/index.en.html)
Supports only EUR as base currency.
```js
// options.timeout in ms (optional) To set request timeout default (default: 3000ms)
swap.addProvider(new swap.providers.EuropeanCentralBank(options));
```
- [Google Finance](http://www.google.com/finance)
Supports multiple currencies as base and quote currencies.
```js
// options.timeout in ms (optional) To set request timeout (default: 3000ms)
swap.addProvider(new swap.providers.GoogleFinance(options));
```
- [Open Exchange Rates](https://openexchangerates.org)
Supports only USD as base currency for the free version and multiple ones for the enterprise version.
```js
// options.appId (required) API key from open exchange rates
// options.enterprise (optional) true in case you have enterprise account (default: false)
// options.timeout in ms (optional) To set request timeout (default: 3000ms)
swap.addProvider(new swap.providers.OpenExchangeRates(options));
```
- [Xignite](https://www.xignite.com)
You must have access to the `XigniteGlobalCurrencies` API.
Supports multiple currencies as base and quote currencies.
```js
// options.token (required) API token from Xignite
// options.timeout in ms (optional) To set request timeout (default: 3000ms)
swap.addProvider(new swap.providers.Xignite(options));
```
- [Yahoo Finance](https://finance.yahoo.com/)
Supports multiple currencies as base and quote currencies.
```js
// options.timeout in ms (optional) To set request timeout (default: 3000ms)
swap.addProvider(new swap.providers.YahooFinance(options));
```
- [National Bank of Romania](http://www.bnr.ro)
Supports only RON as base currency.
```js
// options.timeout in ms (optional) To set request timeout (default: 3000ms)
swap.addProvider(new swap.providers.NationalBankOfRomania(options));
```
- [Currency Layer](https://currencylayer.com/)
Supports multiple currencies as base and quote currencies.
```js
// options.accessKey (required) API access key from Currency Layer.
// options.timeout in ms (optional) To set request timeout (default: 3000ms)
swap.addProvider(new swap.providers.CurrencyLayer(options));
```

## Copyright and license

Code released under the [Apache Software License v2.0](http://www.apache.org/licenses/LICENSE-2.0)
