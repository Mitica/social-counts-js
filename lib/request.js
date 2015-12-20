'use strict';

var url = require('url');

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

	// console.log('options', options);

	var urlInfo = url.parse(options.url);

	if (options.qs) {
		urlInfo.query = options.qs;
		urlInfo = url.format(urlInfo);
		urlInfo = url.parse(urlInfo);
	}

	var protocol = urlInfo.protocol.substr(0, urlInfo.protocol.length - 1);

	var request = require(protocol).request;

	var reqOptions = {
		host: urlInfo.host,
		port: protocol === 'https' ? 443 : 80,
		path: urlInfo.path,
		method: options.method,
		headers: options.headers
	};

	var timer, req, ended;

	function callReject(error) {
		if (!ended) {
			ended = true;
			clearTimeout(timer);
			cb(error);
		}
	}

	function callResolve(data) {
		if (!ended) {
			ended = true;
			clearTimeout(timer);
			cb(null, data);
		}
	}

	function callTimeout() {
		if (req) {
			req.abort();
		}
		var error = new Error('Request timeout!');
		error.timeout = true;
		callReject(error);
	}

	timer = setTimeout(callTimeout, options.timeout);

	// console.log('reqOptions', reqOptions);

	req = request(reqOptions, function(res) {
		res.setEncoding(options.encoding);
		var data = '';

		res.on('data', function(chunk) {
			data += chunk;
		});

		res.on('end', function() {
			if (!ended) {
				if (options.json) {
					try {
						data = JSON.parse(data);
					} catch (e) {
						return callReject(e);
					}
				}
				callResolve(data);
			}
		});
	});

	req.on('error', function(error) {
		callReject(error);
	});

	req.end();
};
