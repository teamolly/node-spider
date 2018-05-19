/**
 * Created by Administrator on 2018/2/1 0001.
 */
var superagent = require('superagent');
require('superagent-proxy')(superagent);
// var config = require('./../config/config.douban');
// var config = require('./../config/config.zhihu');
var config = require('./../config/config.ganji');
var _cookie = "";

function post($url, $params, $success, $error) {
	var proxy = $params.proxy || "http://192.168.0.100:8081";
	$params.cookie = $params.cookie || "";
	if ($url.indexOf("http") >= 0) {
		config.server = "";
	}

	var promise = new Promise((resolved, rejected) => {
		var proxy = params.proxy;
		delete $params.proxy;
		if (proxy) {
			superagent
				.post(config.server + $url)
				.set(config.header)
				.set("Cookie", _cookie)
				.type("form")
				.send($params)
				.proxy(proxy)
				.end((err, res) => {
					if (res.headers["set-cookie"] && res.headers["set-cookie"][0]) {
						_cookie = res.headers["set-cookie"][0];
					}
					$success && $success();
					resolved(res);
				});
		} else {
			superagent
				.post(config.server + $url)
				.set(config.header)
				.set("Cookie", _cookie)
				.type("form")
				.send($params)
				.end((err, res) => {
					if (res.headers["set-cookie"] && res.headers["set-cookie"][0]) {
						_cookie = res.headers["set-cookie"][0];
					}
					$success && $success();
					resolved(res);
				});
		}
	});
	return promise;
}

function get($url, $params, $success, $error) {
	var proxy = $params.proxy;
	delete $params.proxy;
	if ($url.indexOf("http") >= 0) {
		config.server = "";
	}
	var promise = new Promise((resolved, rejected) =>
	{
		if (proxy) {
			superagent
				.get(config.server + $url)
				.set(config.header)
				.send($params)
				.proxy(proxy)
				.end((err, res) => {
					$success && $success();
					resolved(res);
				});
		} else {
			superagent
				.get(config.server + $url)
				.set(config.header)
				.send($params)
				.end((err, res) => {
					$success && $success();
					resolved(res);
				});
		}

	});
	return promise;
}
module.exports = {
	get: get,
	post: post
}