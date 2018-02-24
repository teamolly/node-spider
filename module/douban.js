/**
 * Created by billy on 2017/4/25.
 */
var g = require("nodeLib");
var fs = require("fs");
var path = require("path");
var config = require("./config/config.douban");
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

	init($data, $succcess, $error, $client)
	{
// 		0. 获取页面数据
// 		1. 创建表结构
// 		2. 登录
		_file.add(__projpath('./module/sql/douban'));
		var sqlStr = _file.get("createTable.sql");
		_sql.query(sqlStr, ($data) =>
		{
			this.afterLogin("/");
		});
	}

	login()
	{
		superagent.post("accounts/login", {
			source: "index_nav",
			form_email: config.username,
			form_password: config.password,
			"captcha-solution": "vessel",
			"captcha-id": "lh3wpPwCYWW3xZlgZWEzY3SF:en"
		}).then(($data) =>
		{
			this.afterLogin();
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
		})
		return promise;

	}

	resolve($)
	{
		var list = [];
		var nodes = $("div.stream-items > div").filter(function (el, index)
		{
			return $(this).attr("data-uid") > 0;
		});
		convertArray(nodes).forEach(function (el, index)
		{
			var itemData = {};
			itemData.home = $(el).find("div.usr-pic a").attr("href");
			itemData.author = $(el).find("div.usr-pic a").attr("title");
			itemData.avatar = $(el).find("div.usr-pic a > img").attr("src");
			itemData.title = excludeSpecicalChar($(el).find("div.content a").text());
			itemData.desc = excludeSpecicalChar($(el).find("div.content p").text());
			list.push(itemData);
		});
		dataPool.articlePool.update(list);
		trace(dataPool.articlePool.list);
// 		this.toNextPage();
	}

	toNextPage()
	{
		_nextPage++;
		this.afterLogin("?p=" + _nextPage).then(() =>
		{
			setTimeout(() =>
			{
				this.toNextPage();
			}, 3000);
		}, (err) =>
		{
			fs.writeFile("result.json", JSON.stringify(dataPool.articlePool.list), function ()
			{
				trace("done")
				process.exit();
			});
		});

	}
}

function convertArray($obj)
{
	return Array.prototype.slice.call($obj)
}

function excludeSpecicalChar($str)
{
	$str = $str.replace(/[\'\"\\\/\b\f\n\r\t]/g, '')
	$str = $str.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\<\>\?\[\]\ ]/g, '')
	return $str;
}