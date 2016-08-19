'use strict';

var counts = require('../lib');
var links = ['http://meteo.ournet.ro', 'http://www.protv.md', 'https://en.wikipedia.org'];
var assert = require('assert');

describe('counts', function() {
	links.forEach(function(link) {
		it('link: ' + link, function(done) {
			counts(counts.services, link, function(error, result) {
				if (error) {
					return done(error);
				}
				assert.equal(true, result.facebook > 0);
				// console.log(link, result);
				done(null, result);
			});
		});
	});
});
