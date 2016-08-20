'use strict';

module.exports = {
	facebook: {
		url: 'https://graph.facebook.com/?id=@URL',
		parse: function(body) {
			var data = JSON.parse(body);
			if (data && data.share) {
				return (data.share.share_count || 0) + (data.share.comment_count || 0);
			}
			return 0;
		}
	},

	pinterest: {
		url: 'https://api.pinterest.com/v1/urls/count.json?callback=_&url=@URL',
		parse: function(body) {
			var data = JSON.parse(body.match(/_\((.+)\)/)[1]);
			return data.count;
		}
	},

	linkedin: {
		url: 'https://www.linkedin.com/countserv/count/share?url=@URL',
		parse: function(body) {
			var data = JSON.parse(body.match(/IN\.Tags\.Share\.handleCount\((.+)\)/)[1]);
			return data.count;
		}
	},

	stumbleupon: {
		url: 'http://badge.stumbleupon.com/badge/embed/5/?url=@URL',
		parse: function(body) {
			var matches = body.match(/>([0-9]+)<\/a><\/li><\/ul>/);
			var data = matches ? parseInt(matches[1]) : 0;
			return data;
		}
	},

	buffer: {
		url: 'https://api.bufferapp.com/1/links/shares.json?url=@URL',
		parse: function(body) {
			var data = JSON.parse(body);
			return data.shares;
		}
	},

	odnoklassniki: {
		url: 'https://connect.ok.ru/dk?st.cmd=extLike&uid=odklcnt0&ref=@URL',
		parse: function(res) {
			return res.match(/^ODKL\.updateCount\(\'odklcnt0\',\'(\d+)\'\);$/)[1] / 1;
		}
	},

	vk: {
		url: 'http://vk.com/share.php?act=count&url=@URL',
		parse: function(res) {
			return res.match(/^VK\.Share\.count\(\d, (\d+)\);$/)[1] / 1;
		}
	},

	plusone: {
		url: 'https://share.yandex.ru/gpp.xml?url=@URL',
		parse: function(res) {
			return parseInt(res.replace(/\D/g, ''), 10);
		}
	}
};
