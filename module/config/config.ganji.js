/**
 * Created by Administrator on 2018/2/1 0001.
 */
module.exports = {
	proxy: "http://www.xicidaili.com/wt",
	header: {
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
		"Accept-Encoding": "gzip, deflate",
		"Accept-Language": "zh-CN,zh;q=0.9",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive",
		"Pragma": "no-cache",
		"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36"
	},
	client: "http://hz.ganji.com/fang1/",
	server: "http://hz.ganji.com/fang1/",
	proxyServer:"http://www.xicidaili.com/wt/",
    timeDelay:Math.random()*(10000) + 5000
}