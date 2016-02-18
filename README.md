# swap
Exchange rates library for nodejs

## Motivation
Swap is designed to be a simple and universal exchange rate library with support fo multiple providers. This library is heavily inspired from [PHP Swap](https://github.com/florianv/swap)

## Installation

```bashp
npm install swap
```
## Usage

First, you need to add a provider to swap by using addProvider() method

```js
var swap = require('swap');

// Add the google finance provider 
swap.addProvider(new swap.providers.GoogleFinance());
```

You can also add multiple providers

```js
var swap = require('swap');

// Add the google finance provider 
swap.addProvider(new swap.providers.GoogleFinance());

// Add the yahoo finance provider 
swap.addProvider(new swap.providers.YahooFinance());
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

* `options` - An object to specify options for quote. For complete list of options refer options section below.
* `callback(err, rate)` - A callback which returns error on any failure or rate array on success.

### quoteSync(options)

To retrieve the latest exchange rate for a currency pair synchronously.

__Arguments__

* `options` - An object to specify options for quote. For complete list of options refer options section below.

### Options

* `currency` - currency info to get exchange rate either as string `USD/AED` or as object `{baseCurrency:'USD', quoteCurrency:'AED'}`.
* `fetchMultipleRate` - if true, fetch rate from all the added providers. (default: `false`)
* `cache` - if true, it tries to fetch rate from cache if available otherwise fetch rate from added provider and store it in cache. (default: `false`)
* `ttl` - time in `ms` to retain rate in cache. (default: `360000`) 1 hour

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

Synchronously

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


> Currencies are expressed as their [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) code.

## Copyright and license

Code released under the [MIT license](https://github.com/tajawal/swap/blob/master/LICENSE)
