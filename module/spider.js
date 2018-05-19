/**
 * Created by billy on 2017/4/25.
 */
var fs = require("fs");
var path = require("path");
var superagent = require('./libs/superagent');
var _sql;
var _platList = [1, 2];
var _rangeList = [2, 2.5];
var _count = 0;
module.exports = class {
	constructor()
	{
		this.id = new Date().getTime();
		_sql = g.data.manager.getManager('local-service');
		this.add('init', this.init);
	}

	init($data, $succcess, $error, $client)
	{
		this.getBlueStreeter();
// 		this.start()
	}

	getBlueStreeter()
	{
		superagent.get("/eqt.html").then(($res) =>
		{
			var data = $res.text;
			var resultPath = path.resolve(__dirname, "../result/");
			if (!fs.exists(resultPath))
			{
				fs.mkdir(resultPath);
			}

			fs.writeFileSync(resultPath+"\\eqt.html",$res.text)

		})
	}

	start()
	{
		superagent.post('user/login', {
			account: 15868095558,
			pass: 123456
		}).then(() =>
		{
			this.afterLogin();
		})
	}

	afterLogin()
	{
		_count++;
		superagent.post("search/getRankList", {
			plat: 2,
			range: 100,
			lnt: 120.11903004086066,
			lat: 30.287287240256124,
			page: _count
		}).then((res) =>
		{
			var data = res.text && JSON.parse(res.text);
			if (data.data.list)
			{
				var promiseList = [];
				for (var itemData of data.data.list)
				{
					var promise = new Promise((resolved, rejected) =>
					{
						superagent.post('shop/getDetail', {shopId: itemData.id}).then((response) =>
						{
							var resText = response.text && JSON.parse(response.text);
							var item = resText.data;
							var sqlStr = 'insert into `shop`' +
								' (originId,plat,`name`,brandId,province,city,address,tel,soldNum,lnt,lat,logo,startCost,carryTime,carryCost,score,class,activity)' +
								' values (' + item.originId + ',' + item.plat + ',"' + item.name + '",' + item.brandId + ',' + item.province + ',' + item.city + ',"' + item.address + '","' + item.tel + '",' + item.soldNum + ',' + item.lnt + ',' + item.lat + ',"' + `${item.logo}` + '",' + item.startCost + ',' + item.carryTime + ',' + item.carryCost + ',' + item.score + ',' + JSON.stringify(item.class) + ',' + JSON.stringify(item.activity) + ')';

							_sql.query(sqlStr, ($res) =>
							{
								resolved($res)
							})
						});
					})
					promiseList.push(promise);
				}

				Promise.all(promiseList).then(($data) =>
				{
					trace(_count, '插入成功');
					this.afterLogin();
				})
			}
		}, (error) =>
		{
			if (error)
			{
				throw error;
				process.exit();
			}
		});
	}
}