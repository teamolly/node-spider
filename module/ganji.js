/**
 * Created by billy on 2017/4/25.
 */
var g = require("nodeLib");
var fs = require("fs");
var path = require("path");
var config = require("./config/config.ganji");
var superagent = require('./libs/superagent');
var cheerio = require('cheerio');
var _file = g.data.file.get("ganji");
var dataPool = require("./data/DataPool");
var util = require("./util/index");
var _nextPage = 1;
var _sql;
var $;

module.exports = class {
	constructor()
	{
		_sql = g.data.manager.getManager('local-service');
		_file.add(__projpath("./module/sql/ganji"))
		this.add('init', this.init);
		this.promiseList = [];
	}

	init($data, $succcess, $error, $client)
	{
		this.afterLogin("/")
	}

	afterLogin($url)
	{
		var promise = new Promise((resolved, rejected) =>
		{
			superagent.get($url).then(($data) =>
			{
				$ = cheerio.load($data.text);
				this.resolve($);
				resolved();
			}, (err) =>
			{
				rejected();
			})
		});
		return promise;
	}

	resolve($)
	{
		var promises = [];
		var list = [];
		var nodes = $("div.f-list-item ");
		var self = this;
		util.convertArray(nodes).forEach(function (el, index)
		{
			var link = $(el).attr("id");
			if (link.indexOf("-") > 0)
			{
				link = link.split("-")[1] + "x.htm";
				var promise = new Promise((resolved, rejected) =>
				{
					setTimeout(function ()
					{
						superagent.get(link).then(($data) =>
						{
							var $$ = cheerio.load($data.text);
							list.push(self.parse($$));
							resolved();
						}, (err) =>
						{
							rejected();
						})
					},5000)
				})
				promises.push(promise);
			}
		});
		Promise.all(promises).then(() =>
		{
			dataPool.housePool.update(list);
			for (var item of dataPool.housePool.list)
			{
				var sqlStr = _file.get("insertData.sql", item);
				_sql.query(sqlStr, function ($list)
				{
					trace("done");
				});
			}
			trace("dataPool.housePool.list", dataPool.housePool.list);
			dataPool.housePool.removeAll();
			this.toNextPage();
		})
	}

	parse($$)
	{
		var itemData = {};
		itemData.title = $$("div.card-info p.card-title i").text();
		itemData.link = $$("input#puid").val() + "x.html";
		itemData.type = $$("div.card-info ul.er-list span.content").eq(0).text();
		itemData.square = $$("div.card-info ul.er-list span.content").eq(1).text();
		itemData.direction = $$("div.card-info ul.er-list span.content").eq(2).text();
		itemData.traffic = $$("div.card-info ul.er-list-two div.subway-wrap span.content").text();
		itemData.address = $$("div.card-info ul.er-list-two li.er-item a.blue").text();
		itemData.price = $$("div.card-info ul.card-pay span.num").text();
		var location = JSON.parse($$("div#baidu_Map").attr("data-ref"));
		location.lnglat = location.lnglat.substr(1);
		itemData.lng = location.lnglat.split(",")[0];
		itemData.lat = location.lnglat.split(",")[1];
		return itemData;
	}

	toNextPage()
	{
		_nextPage++;
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

