/**
 * Created by Administrator on 2018/4/2 0002.
 */

var g = require("nodeLib");
var superagent = require('../libs/superagent');
var dataPool = require('../data/DataPool')
var cheerio = require('cheerio');
var config = require('../config/config.ganji.js')
var page = 1;

module.exports = class {
	constructor() {
		this.add('init', this.init);
		this.promiseList = [];
	}

	init($data, $succcess, $error, $client) {
		checkProxy(dataPool.proxyPool.list)
	}
	getProxyList() {
		superagent.get(config.proxyServer + page, {}).then((response) => {
			$ = cheerio.load(response.text);
		});
	}
	checkProxy(proxyList) {
		var targetOptions = {
			method: 'GET',
			url: 'http://ip.chinaz.com/getip.aspx',
			timeout: 8000,
			encoding: null,
		};
		var proxys = __merge([], proxyList);
		var validProxys = [];
		//这里修改一下，变成你要访问的目标网站
		sliceProxy();

		function sliceProxy() {
			if (proxys.length > 0) {
				var proxy = "http://" + proxys.shift();
				superagent.get(targetOptions.url, {
					proxy: proxy
				}).then((response) => {
					sliceProxy();
					// 				g.fs.writeFile("data.log", JSON.stringify(response))
					if (response.status == 200) {
						validProxys.push(proxy);
						trace(`验证成功==>> ${proxy}`);
						trace("validProxys", validProxys.length);
					}
				});
			} else {
				g.fs.writeFile("result.log", JSON.stringify(validProxys))
			}
		}
	}
}