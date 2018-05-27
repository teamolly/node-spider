/**
 * Created by billy on 2017/4/25.
 */
var g = require("./../../nodeLib");
var config = require("./config/config.ganji");
var superagent = require('./libs/superagent');
var cheerio = require('cheerio');
var _file = g.data.file.get("ganji");
var dataPool = require("./data/DataPool");
var util = require("./util/index");
var event = require("./event/emit");
var _nextPage = 1;
var _sql;
var $;
var _timer = null;

module.exports = class {
	constructor()
	{
		_sql = g.data.manager.getManager('local-service');
		_file.add(__projpath("./module/sql/ganji"))
		this.add('init', this.init);
		this.data = [];
	}

	init($data, $succcess, $error, $client)
	{
//		event.addListener("PROXYINITED", () =>
//		{
			var targetPath = g.path.resolve(__projpath('./assets/result.json'));
			var content = g.fs.readFileSync(targetPath).toString();
			this.data = typeof content == "object" ? content : JSON.parse(content);
			this.afterLogin("").then(() =>
			{
				this.toNextPage();
			}, (err) =>
			{
				trace("程序即将退出======================");
				process.exit();
			})
//		})
	}

	afterLogin($url)
	{
		var promise = new Promise((resolved, rejected) =>
		{
			var random = Math.floor(Math.random() * this.data.length)
			var proxy = this.data[random];
			trace("开始爬取网站===================")
			superagent.get($url).then(($data) =>
			{
				clearTimeout(_timer);
				_timer = setTimeout(() =>
				{
					$ = cheerio.load($data.text);
					this.resolveData($);
					resolved();
				}, config.timeDelay)
			}, (err) =>
			{
				g.log.out(err);
				rejected();
			})
		});
		return promise;
	}

	resolveData($)
	{
		var list = [];
		var nodes = $("div.f-list-item ");
		var nodeList = util.convertArray(nodes);
		var node;
		var self = this;
		crawlLink();

		function crawlLink()
		{
			if (nodeList.length > 1)
			{
				node = nodeList.shift();
				var link = $(node).attr("id") || "pass";
				if (link.indexOf("-") > 0)
				{
					link = link.split("-")[1] + "x.htm";
					var random = Math.floor(Math.random() * self.data.length)
					var proxy = self.data[random];
					superagent.get(link).then(($data) =>
					{
						trace("link", link);
						trace("nextPage", _nextPage)
						var $$ = cheerio.load($data.text);
						self.saveData(self.parse($$), () =>
						{
							clearTimeout(_timer);
							_timer = setTimeout(() =>
							{
								crawlLink();
							}, config.timeDelay)
						});
					})
				}
			}
			else
			{
				clearTimeout(_timer);
				self.toNextPage();
			}

		}
	}

	saveData($itemData, $callback)
	{
		var sqlStr = _file.get("insertData.sql", $itemData);
		_sql.query(sqlStr, function ($list)
		{
			trace("done");
			$callback && $callback()
		}, (err) =>
		{
			trace("数据存储失败===============", err);
		});
	}

	parse($$)
	{
		var itemData = {};
		itemData.title = $$("div.card-info p.card-title i").text();
		itemData.link = $$("input#puid").val() + "x.htm";
		itemData.type = $$("div.card-info ul.er-list span.content").eq(0).text();
		itemData.square = $$("div.card-info ul.er-list span.content").eq(1).text();
		itemData.direction = $$("div.card-info ul.er-list span.content").eq(2).text();
		itemData.traffic = $$("div.card-info ul.er-list-two div.subway-wrap span.content").text();
		itemData.address = $$("div.card-info ul.er-list-two li.er-item a.blue").text();
		itemData.price = $$("div.card-info ul.card-pay span.num").text();
		try
		{
			var location = JSON.parse($$("div#baidu_Map").attr("data-ref"))
		}
		catch (e)
		{
			location = {
				lnglat: "d0,0"
			}
		}
		location.lnglat = location.lnglat.substr(1);
		itemData.lng = location.lnglat.split(",")[0];
		itemData.lat = location.lnglat.split(",")[1];
		return itemData;
	}

	toNextPage()
	{
		_nextPage++;
		// 这里缺少一个出口
		if (_nextPage <= 200000)
		{
			this.afterLogin("o" + _nextPage + "/").then(() =>
			{
				this.toNextPage();
			}, (err) =>
			{

				for (var item of dataPool.housePool.list)
				{
					var sqlStr = _file.get("insertData.sql", item);
					_sql.query(sqlStr, function ($list)
					{
						trace("done");
					})
				}
			});
		}
	}
}