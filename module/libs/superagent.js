/**
 * Created by Administrator on 2018/2/1 0001.
 */
var superagent = require('superagent');
var config = require('./../config/config.zhihu');
var _cookie = "";
function post($url, $params, $success, $error)
{
	$params.cookie = $params.cookie || "";
	if ($url.indexOf("http") >= 0)
	{
		config.server = "";
	}

	var promise = new Promise((resolved, rejected) =>
	{
		superagent
			.post(config.server + $url)
			.set({
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'zh-CN,zh;q=0.8',
				'Connection': 'keep-alive',
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			})
			.set("Cookie", _cookie)
			.type("form")
			.send($params)
			.on('error', (err)=>
			{
				throw err;
			})
			.end((err, res)=>
			{
				if (err)
				{
					rejected();
					throw err;
				}
				if (res.headers["set-cookie"] && res.headers["set-cookie"][0])
				{
					_cookie = res.headers["set-cookie"][0];
				}
				$success && $success();
				resolved(res);
			});
	});
	return promise;
}

function get($url, $params, $success, $error)
{
	if ($url.indexOf("http") >= 0)
	{
		config.server = "";
	}
	trace("config.server", config.server)
	var promise = new Promise((resolved, rejected) =>
	{
		superagent
			.get(config.server + $url)
			.set({
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'zh-CN,zh;q=0.8',
				'Connection': 'keep-alive',
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			})
			.send($params)
			.on('error', (err)=>
			{
				throw err;
			})
			.end((err, res)=>
			{
				if (err)
				{
					rejected();
					throw err;
				}
				if (res.headers["set-cookie"] && res.headers["set-cookie"][0])
				{
					_cookie = res.headers["set-cookie"][0];
				}
				$success && $success();
				resolved(res);
			});
	});
	return promise;
}
module.exports = {
	get: get,
	post: post
}