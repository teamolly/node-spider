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
var _file = g.data.file.get("douban");
var dataPool = require("./data/DataPool");
var _nextPage = 1;
var _sql;
var $;

module.exports = class {
	constructor()
	{
		_sql = g.data.manager.getManager('local-service');
		this.add('init', this.init);
	}

	init()
	{
		this.login();
	}

	login()
	{
		var str = "";
		str += config.loginInfo.grant_type;
		str += config.loginInfo.client_id;
		str += config.loginInfo.source;
		str += config.loginInfo.timestamp;
		crypto.update(str);
		var signature = crypto.digest("hex");
		config.loginInfo.signature = signature;
		superagent.post("oauth/sign_in", config.userInfo, ($data) =>
		{
			trace("$data", $data);
		})
	}

	afterLogin()
	{

	}

	resolve()
	{

	}

	toNextPage()
	{

	}

	destroy()
	{

	}
}
