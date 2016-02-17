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

// Add the google finance provider 
swap.addProvider(new swap.providers.YahooFinance());
```

### Copyright and license

Code released under the [MIT license](https://github.com/tajawal/swap/blob/master/LICENSE)
