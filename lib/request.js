'use strict';

var request = require('request');

function defaults(target, source) {
	target = target || {};
	for (var prop in source) {
		if (typeof target[prop] === 'undefined') {
			target[prop] = source[prop];
		}
	}

	return target;
}

module.exports = function(options, cb) {
	options = defaults(options, {
		method: 'GET',
		// json: true,
		encoding: 'utf8',
		timeout: 5 * 1000,
		headers: {}
	});

	request(options, function(error, response, body) {
		cb(error, body);
	});
};
