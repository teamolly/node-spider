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
var event = require("./../event/emit");
var page = 1;
var timerId = null;
var $;
var proxies = [];
module.exports = class {
	constructor()
	{
		this.add('init', this.init);
	}

	init($data, $succcess, $error, $client)
	{
		this.initEvent();
		this.initProxy()
	}

	initProxy()
	{
		var targetPath = g.path.resolve(__projpath('./assets/data.json'));
		var content = g.fs.readFileSync(targetPath).toString();
		var data = JSON.parse(content);
		this.checkProxy(data);
	}

	initEvent()
	{
		process.on("exit", function ()
		{
			trace("程序已经退出")
		})
	}

	getProxyList()
	{
		var self = this;
		var random = Math.floor(Math.random() * proxies.length)
		var proxy = proxies[random];
		trace("正在爬取", config.proxyServer + page);
		trace("代理IP：", proxy);
		superagent.get(config.proxyServer + page, {
			proxy: proxy
		}).then((response) =>
		{
			g.log.out(JSON.stringify(response))
			if (response.status == 200)
			{
				$ = cheerio.load(response.text);
				this.cleanoutData($("tbody tr"))
				timerId = setTimeout(() =>
				{
					page++;
					self.getProxyList();
				}, config.timeDelay)
			}
			else
			{
				var list = dataPool.proxyPool.list;
				this.checkProxy(list, true)
				clearTimeout(timerId);
			}
		});
	}

	cleanoutData($nodeList)
	{
		var nodeList = convertArray($nodeList)
		for (var node of nodeList)
		{
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

	checkProxy(proxyList, $isEnd)
	{
		var targetOptions = {
			method: 'GET',
			url: 'http://ip.chinaz.com/getip.aspx',
			timeout: 8000,
			encoding: null
		};
		var self = this;
		var proxys = __merge([], proxyList);
		var validProxys = [];
		sliceProxy();

		function sliceProxy()
		{
			if (proxys.length > 0)
			{
				var proxyItem = proxys.shift();
				proxyItem = typeof proxyItem == "string" ? {
					complete: proxyItem
				} : proxyItem;
				var proxy = proxyItem.complete.indexOf("http") < 0 ? "http://" + proxyItem.complete : proxyItem.complete;
				superagent.get(targetOptions.url, {
					proxy: proxy
				}).then((response) =>
				{
					sliceProxy();
					if (response.status == 200)
					{
						validProxys.push(proxy);
						trace(`验证成功==>> ${proxy}`);
					}
					else if (response)
					{
						trace(`验证失败==>> ${proxy}`);
					}
				}, (err) =>
				{
					trace(`验证失败==>> ${proxy}`);
					sliceProxy();
				});
			}
			else
			{
				var targetPath = g.path.resolve(__projpath('./assets/result.json'));
				proxies = __merge([], validProxys);
				trace("验证完毕================", validProxys)
				trace("存储路径================", targetPath)
				g.fs.writeFile(targetPath, JSON.stringify(proxies), function (err)
				{
					if (err)
					{
						throw err;
					}
					trace("有效代理数据============", validProxys)
					if (!$isEnd)
					{
						self.getProxyList();
					}
					else
					{
						event.emitEvent("PROXYINITED")
					}
				})
			}
		}
	}
}