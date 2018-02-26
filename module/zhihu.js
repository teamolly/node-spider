/**
 * Created by Administrator on 2018/2/24 0024.
 */
/**
 * Created by billy on 2017/4/25.
 */
var g = require("nodeLib");
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var config = require("./config/config.zhihu");
var superagent = require('./libs/superagent');
var cheerio = require('cheerio');
var dataPool = require("./data/DataPool");
var util = require('./util/index');
var _file = g.data.file.get("zhihu");
var _nextPage = 1;
var _sql;
var $;

module.exports = class {
	constructor()
	{
		_sql = g.data.manager.getManager('local-service');
		_file.add("./module/sql/zhihu");
		this.add('init', this.init);
	}

	init()
	{
		var pageSize = 1;
		var url = "api/v3/feed/topstory?action_feed=True&limit=" + pageSize + "&session_token=df829fa60f7441bbdea12da5c5b78d90&action=down&after_id=" + (_nextPage * pageSize - 1) + "&desktop=true";
		this.afterLogin(url);
	}

	login()
	{
		var str = "";
		str += config.loginInfo.grant_type;
		str += config.loginInfo.client_id;
		str += config.loginInfo.source;
		str += config.loginInfo.timestamp;
		const hash = crypto.createHmac('sha1', str).digest("hex");
		config.loginInfo.signature = hash;
		superagent.post("api/v3/oauth/sign_in", config.loginInfo, ($data) =>
		{
			trace("$data", $data);
		}, (err) =>
		{
			throw err;
		})
	}

	afterLogin($url)
	{
		var promise = new Promise((resolved, rejected) =>
		{
			superagent.get($url).then(($data) =>
			{
				var result = JSON.parse($data.text);
				result = result.paging.data;
				this.resolve(result);
				resolved();
			}, (err) =>
			{
				rejected();
			})
		})
		return promise;

	}

	resolve($list)
	{
		var list = [];

		dataPool.answerPool.update(list);
// 		this.toNextPage();
	}

	toNextPage()
	{
		_nextPage++;
		var pageSize = 10;
		if (_nextPage <= 3)
		{
			var url = "api/v3/feed/topstory?action_feed=True&limit=" + pageSize + "&session_token=df829fa60f7441bbdea12da5c5b78d90&action=down&after_id=" + (_nextPage * pageSize - 1) + "&desktop=true";
			this.afterLogin(url).then(() =>
			{
				setTimeout(() =>
				{
					trace("dataPool.answerPool.list", dataPool.answerPool.list)
					for (var item of dataPool.answerPool.list)
					{
						var sqlStr = _file.get("insertData.sql", item);
						_sql.query(sqlStr, function ($list)
						{
							trace("done");
						})
					}
					dataPool.answerPool.removeAll();
					this.toNextPage();
				}, 5000);
			}, (err) =>
			{
				for (var item of dataPool.answerPool.list)
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

	destroy()
	{

	}
}
