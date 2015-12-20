'use strict';

var services = require('./services');
var async = require('async');
var request = require('./request');

function is(target, type) {
	return typeof target === type;
}

function isString(target) {
	return is(target, 'string');
}

function isObject(target) {
	return is(target, 'object');
}

function getCount(service, opts, cb) {
	var options = {
		url: service.url.replace(/@URL/, encodeURIComponent(opts.url)),
		timeout: opts.timeout
	};

	return request(options, function(error, body) {
		if (error) {
			return cb(error);
		}

		cb(null, service.parse(body));
	});
}

exports = module.exports = function(serviceNames, options, cb) {
	if (!Array.isArray(serviceNames)) {
		serviceNames = [serviceNames];
	}

	if (isString(options)) { // is url
		options = {
			url: options
		};
	} else if (!isObject(options) || !isString(options.url)) {
		return cb(new Error('social-counts requires a url'));
	}

	var actions = {};

	serviceNames.forEach(function(serviceName) {
		var service = services[serviceName];
		if (service && !actions[serviceName]) {
			actions[serviceName] = function(callback) {
				getCount(service, options, callback);
			};
		}
	});

	async.parallel(actions, cb);
};

exports.services = Object.keys(services);
