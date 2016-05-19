
var loginData = null;
var storeData = null;

var getData = {
	getLoginData : function(req, res){
		if (req.session.userName) {
			loginData = {
				state : true,
				data : {
					loginPic : 'http://ww1.sinaimg.cn/crop.7.22.1192.1192.1024/5c6defebjw8epti0r9noaj20xc0y1n0x.jpg',
					collection : [
						{name : '星巴克', locat : '民族餐厅3号', price: '40.0', score: '4.5', imgurl: 'http://www.mroyal.cn/uploadfile/20140904/20140904171333539.jpg', label:'咖啡', collected:240, id:'1', area: 3},
						{name : '麦当劳', locat : '旭日院三楼5号', price: '51.0', score: '3.1', imgurl: 'http://www.gzxinhua.com/uploads/allimg/130527/2-13052G53523I0.jpg', label:'快餐', collected:150, id:'3', area : 4}
					],
					comment : [
						{name : '李睿豪', score : '4.5', storeName : '星巴克', time: '2016-2-14 15:30', text:'这家店非常不错,环境很好么么哒'},
						{name : '李睿豪', score : '3.2', storeName : '肯德基', time: '2016-3-17 10:15', text:'老版人很好，价格便宜'}
					]
				}
			};
		}
		else{
			loginData = {
				state : false,
				reason : '未登录'
			}
		}
		responseItems(req, res, loginData);		
	},
	getStoresData : function(req, res){
		storeData = {
			topImage : [{name : '梅子蛋糕', src:'http://pics.sc.chinaz.com/files/pic/pic9/201604/fpic775.jpg'}, {name: '巴西烤肉' ,src:'http://img.7808.cn/10/2012/0106/13258208449687.jpg'}, {name:'中国烤肉' ,src:'http://anhui.sinaimg.cn/2012/0710/U7657P1276DT20120710105817.jpg'}],
			menu : [{name: '麻辣鸡丁', price: 33.0}, {name: '水煮肉片', price: 42.5}, {name: '辣子鸡', price: 52.0}, {name: '糖醋里脊', price: 18.6}, {name: '红烧排骨', price: 26.0}],
			data : {name : '肯德基', locat : '美食广场45号', price: '27.3', score: '2.5', imgurl: 'http://img4.imgtn.bdimg.com/it/u=3234364829,4036790727&fm=21&gp=0.jpg', label:'快餐', collected:250, id:'2', area: 2},
			comment : [
					{name : '坑逼后台狗', score : '4.5', storeName : '肯德基', time: '2016-2-14 15:30', text:'这家店非常不错,环境很好么么哒'},
					{name : '苦逼安卓狗', score : '3.2', storeName : '肯德基', time: '2016-3-17 10:15', text:'老版人很好，价格便宜'}
			]
		}
		responseItems(req, res, storeData);
	}
}

function responseItems(req, res, data){
	 if (req.query && req.query.callback) {
	 	var jsonpStr = req.query.callback + '(' + JSON.stringify(data) + ')';
		res.writeHead(200);
		res.write(jsonpStr);
	 }
	 else{
		res.writeHead(200,{
			'Content-Type' : 'application/json',
			'Access-Control-Allow-Origin' : 'http://localhost'			
		});
		res.write(JSON.stringify(data));	 	
	 }
	 res.end();
}

module.exports = getData;