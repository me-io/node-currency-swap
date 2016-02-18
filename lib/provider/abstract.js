/*
 * This file is part of Swap.
 *
 * (C) 2016 Tajawal
 * MIT LICENCE
 *
 */

var syncRequest = require('sync-request');
var request = require('then-request');

// set the request options
var requestOptions = {
    timeout: 2000
};

/**
 *
 * Base class for providers.
 */
var AbstractProvider = module.exports = function () {
};

/**
 * Fetches the content of the given url.
 * @param url
 * @param callback
 * @returns string
 */
AbstractProvider.prototype.fetchContent = function (url, callback) {
    request('GET', url, requestOptions, function (err, res) {
        if (err) {
            return callback(new Error('Request to provider failed due to connection issue or server does not responded'), null);
        }

        if (res.statusCode != 200) {
            return callback(new Error('Server responded with status code ' + res.statusCode + ':\n' + res.body.toString('utf8')), null);
        }

        return callback(null, res.body.toString('utf8'));
    });
};

/**
 * Fetches the content of the given url synchronously.
 * @param url
 * @returns string
 */
AbstractProvider.prototype.fetchContentSync = function (url) {
    try{
        var res = syncRequest('GET', url, requestOptions);
    }
    catch(err){
        throw new Error('Request to provider failed due to connection issue or server does not responded');
    }

    if (res.statusCode != 200) {
        throw new Error('Server responded with status code ' + res.statusCode + ':\n' + res.body.toString('utf8'));
    }

    return res.body.toString('utf8');
};