// var http = require('http');
// var url = require('url');

// var routes = [];
// var pushRoute = function(path, action){
// 	routes.push([path, action]);
// }

// pushRoute('/xiyouFood/getItems', './getItems.js');

// var server = http.createServer(function (req, res){
// 	var pathName = url.parse(req.url).pathname;
// 	for(var i = 0; i < routes.length; i++){
// 		var route = routes[i];
// 		if (route[0] == pathName) {
// 			var action = require(route[1]);
// 			action.fn(req, res);
// 			return;
// 		}
// 	}

// 	handle404(req, res);
// });
// server.listen(5656);

// function handle404(req, res){
// 	res.end('404 No Found!!!!!!!!');
// }

var express = require('express');
var getItems = require('./getItems.js');
var login = require('./login.js');
var getData = require('./loginData.js');

var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({
	secret: '12345',
	name: 'login_sessionId',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
	cookie: {maxAge: 8000000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
	resave: true, //是指每次请求都重新设置session cookie，假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒
	saveUninitialized: false//是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
}));

app.get('/xiyouFood/getItems', getItems.fn);
app.get('/xiyouFood/login', login.loginFun.checkUser);
app.get('/xiyouFood/ifLogin', login.loginFun.ifLogin);
app.get('/xiyouFood/outLogin', login.loginFun.outLogin);
app.get('/xiyouFood/getLoginData', getData.getLoginData);
app.get('/xiyouFood/getStoreData', getData.getStoresData);

app.listen(5656);	