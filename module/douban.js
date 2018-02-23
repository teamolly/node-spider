/**
 * Created by billy on 2017/4/25.
 */
var fs = require("fs");
var path = require("path");
var config = require("./../config");
var superagent = require('./libs/superagent');
var DOMParser = require('xmldom').DOMParser;
var xpath = require('xpath');
var Ngocr = require("ng-ocr");
var _sql;
var _dom;
var _file = g.data.file.get("douban");
module.exports = class {
	constructor()
	{
		_sql = g.data.manager.getManager('local-service');
		_file.add(__projpath('./modules/sql/douban/'));
		this.add('init', this.init);
	}

	init($data, $succcess, $error, $client)
	{
// 		0. 获取页面数据
// 		1. 创建表结构
// 		2. 登录
		superagent.get("/").then(($data) =>
		{
// 			_dom = new DOMParser().parseFromString($data.text);
			var sqlStr = _file.get("createTable.sql");
			trace("sqlStr",sqlStr)
			_sql.query(sqlStr, ($data) =>
			{
				trace("$data",$data)
				trace("开始尝试登录===========================================")
				this.login();
			});
		});
	}

	login()
	{
		superagent.post("accounts/login", {
			source: "index_nav",
			form_email: config.username,
			form_password: config.password,
			"captcha-solution": "probable",
			"captcha-id": "zTEK8ytHBtT4p3X1CSvHlLZG:en"
		}).then(($list) =>
		{
			this.afterLogin();
			trace("$list", $list)
		})
	}

	getCodeImage()
	{
		superagent.get("misc/captcha?id=UQyoW6xydkdt26eLXsU2TTHc:en").then(($list) =>
		{
			var dir = "../assets/";
			var target = path.resolve(__dirname, dir);
			fs.exists(target, (isExist) =>
			{
				if (isExist)
				{
					fs.writeFileSync(target + "\\captcha.png", $list.body);
					this.getCode();
				}
				else
				{
					fs.mkdir(target, (err) =>
					{
						if (err)
						{
							throw err;
						}
						fs.writeFileSync(target + "\\captcha.png", $list.body)
						this.getCode();
					}, true);
				}
			})
		})
	}

	getCode()
	{
		var target = path.resolve(__dirname, "../assets/captcha.png");
// 		trace("target",target)
// 		var stream = fs.createReadStream(target);
// 		Ngocr.decodeStream(stream, function (err, $data)
// 		{
// 			if (err)
// 			{
// 				throw err;
// 			}
// 			trace($data);
// 		})
	}

	afterLogin()
	{
		trace(11111111111111)
	}
}