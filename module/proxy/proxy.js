/**
 * Created by Administrator on 2018/4/2 0002.
 */

var g = require("nodeLib");
var superagent = require('../libs/superagent');
var dataPool = require('../data/DataPool')
var cheerio = require('cheerio');
var config = require('../config/config.ganji.js')
var {
	convertArray
} = require('./../util/index')
var page = 1;
var timerId = null;
var $;
module.exports = class {
	constructor() {
		this.add('init', this.init);
		this.promiseList = [];
	}

	init($data, $succcess, $error, $client) {
		this.getProxyList();
	}

	getProxyList() {
		superagent.get(config.proxyServer + page, {}).then((response) => {
			if (response) {
				g.fs.writeFile("log/test.log", JSON.stringify(response))
				$ = cheerio.load(response.text);
				this.cleanoutData($("tbody tr"))
				timerId = setTimeout(() => {
					page++;
					this.getProxyList();
				}, 10000)
			} else {
				var list = dataPool.proxyPool.list;
				this.checkProxy(list)
				clearTimeout(timerId);
			}
		});


	}

	cleanoutData($nodeList) {
		var nodeList = convertArray($nodeList)
		for (var node of nodeList) {
			var item = {};
			var children = $(node).children();
			item.ip = children.eq(1).text()
			item.port = children.eq(2).text()
			item.address = children.eq(3).children().first().text()
			item.protocol = children.eq(5).text()
			item.validTime = children.eq(8).text()
			item.createTime = children.eq(9).text()
			dataPool.proxyPool.add(item);
		}
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
				var proxyItem = proxys.shift()
				var proxy = proxyItem.complete.indexOf("http") < 0 ? "http://" + proxyItem.complete : proxyItem.complete;
				trace("proxy", proxy)
				superagent.get(targetOptions.url, {
					proxy: proxy
				}).then((response) => {
					sliceProxy();
					if (response.status == 200) {
						validProxys.push(proxy);
						trace(`验证成功==>> ${proxy}`);
						trace("validProxys", validProxys.length);
					}
				});
			} else {
				g.fs.writeFile("result.log", JSON.stringify(validProxys), {
					flag: "a"
				})
			}
		}
	}
}