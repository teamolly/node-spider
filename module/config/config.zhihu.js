/**
 * Created by Administrator on 2018/2/24 0024.
 */
module.exports = {
	server: "https://www.zhihu.com/",
	pageSize:10,
	header: {
		'authorization':'Bearer' +
		' 2|1:0|10:1519635953|4:z_c0|80:MS4xZmVlOEF3QUFBQUFtQUFBQVlBSlZUZkViZ1Z1Mk9zc2VGUkZUZFJ3c0NUNkU3azIxbGdHU1NnPT0=|559bf2926576879ea8600b196509637e7b20e18defa3e94eb49e5d6d15a4ae7a',
		'accept': 'application/json, text/plain, */*',
		'Accept-Language': 'zh-CN,zh;q=0.9',
		'Cookie': '_zap=b16311ce-9080-44f0-86fd-0afc31427264; q_c1=193cca1937f846b8b533b3cb0c75b595|1519377586000|1516180482000; aliyungf_tc=AQAAAPVE2WrwMAUAFqPBc1KgIyy30NtA; _xsrf=bd4323a5-9e89-44af-ab6d-1c6e5ee4bbee; capsion_ticket="2|1:0|10:1519635819|14:capsion_ticket|44:ZWQxNzJlYTBjYmU5NGM1OWE1MjU5M2MwNDgwYTM2Yjc=|1d185a9f6e4de1b2758a0b3661398c23f77bd8a67df38fb5bebb01ad39261ce1"; z_c0="2|1:0|10:1519635953|4:z_c0|80:MS4xZmVlOEF3QUFBQUFtQUFBQVlBSlZUZkViZ1Z1Mk9zc2VGUkZUZFJ3c0NUNkU3azIxbGdHU1NnPT0=|559bf2926576879ea8600b196509637e7b20e18defa3e94eb49e5d6d15a4ae7a";d_c0="ALBs_uZrNA2PTlhYqXa0SWR7I-UioR6mHSU=|1519636246"',
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
	},
	proxyServer:"http://www.xicidaili.com/wt/",
	loginInfo: {
		client_id: "c3cef7c66a1843f8b3a9e6a1e3160e20",
		grant_type: "password",
		timestamp: Date.now(),
		source: "com.zhihu.web",
		username: "**********",
		password: "**********",
		lang: "en",
		ref_source: "homepage",
		utm_source: "baidu"
	}
}
