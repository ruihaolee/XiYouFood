var url = require('url');

var itemsData = {
	state : true,
	data : [
		{name : '星巴克', locat : '民族餐厅3号', price: '40.0', score: '4.5', imgurl: 'http://www.mroyal.cn/uploadfile/20140904/20140904171333539.jpg', label:'咖啡', collected:240, id:'1', area: 3},
		{name : '肯德基', locat : '美食广场45号', price: '27.3', score: '2.5', imgurl: 'http://img4.imgtn.bdimg.com/it/u=3234364829,4036790727&fm=21&gp=0.jpg', label:'快餐', collected:250, id:'2', area: 2},
		{name : '麦当劳', locat : '旭日院三楼5号', price: '51.0', score: '3.1', imgurl: 'http://www.gzxinhua.com/uploads/allimg/130527/2-13052G53523I0.jpg', label:'快餐', collected:150, id:'3', area : 4},
		{name : '德克士', locat : '东区食堂一楼7号', price: '18.2', score: '4.0', imgurl: 'http://img4.imgtn.bdimg.com/it/u=3823076356,2872466908&fm=21&gp=0.jpg', label:'咖啡', collected:120, id:'4', area : 1},
		{name : '必胜客', locat : '东区食堂二楼10号', price: '64.3', score: '3.5', imgurl: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1461834998&di=f2e105794ddb4ec667a8eb6cdf7adae8&src=http://imgsrc.baidu.com/baike/pic/item/4610b912c8fcc3ce420fbb429045d688d53f20f7.jpg', label:'披萨', collected:360, id:'5', area: 1}
	]
};

function responseItems(req, res){
	 if (req.query && req.query.callback) {
	 	var jsonpStr = req.query.callback + '(' + JSON.stringify(itemsData) + ')';
		res.writeHead(200);
		res.write(jsonpStr);
	 }
	 else{
		res.writeHead(200,{
			'Content-Type' : 'application/json',
			'Access-Control-Allow-Origin' : 'http://localhost'			
		});
		res.write(JSON.stringify(itemsData));	 	
	 }
	 res.end();
}

exports.fn = responseItems;

