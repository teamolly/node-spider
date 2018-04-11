/**
 * Created by Administrator on 2018/2/24 0024.
 */
var _list = [];
var _hash = {};
class ProxyPool {
	constructor()
	{

	}

	update($list)
	{
		for (var item of $list)
		{
			this.add(item);
		}
	}

	add($item)
	{
		var itemData = createData($item);
		if (!_hash[itemData.id])
		{
			_hash[itemData.id] = itemData;
			_list.push(itemData);
		}
	}

	remove($id)
	{
		var index = _list.indexOf(_hash[$id]);
		if (index >= 0)
		{
			_list.splice(index, 1)
		}
	}

	getDataById($id)
	{
		return _hash[$id]
	}

	get list()
	{
		return _list;
	}

	removeAll()
	{
		_list = [];
		_hash = {};
	}
}

function createData($dObj)
{
	var d = {};
	d.id = Math.random();
	d.ip = "";
	d.port = "";
	d.address = "";
	d.protocol = "";
	d.validtime = "";
	d.createTime = "";
	d.update = updateData.bind(d);
	d.update($dObj)
	return d;
}

function updateData($dObj)
{
	$dObj.hasOwnProperty("ip") && (this.ip = $dObj.ip);
	$dObj.hasOwnProperty("port") && (this.port = $dObj.port);
	$dObj.hasOwnProperty("address") && (this.address = $dObj.address);
	$dObj.hasOwnProperty("protocol") && (this.protocol = $dObj.protocol);
	$dObj.hasOwnProperty("validtime") && (this.validtime = $dObj.validtime);
	$dObj.hasOwnProperty("createTime") && (this.createTime = $dObj.createTime);
}

module.exports = ProxyPool;