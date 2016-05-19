var express = require('express');
var app = express();

app.get('/ceshi', function (req, res, next){
	console.log('路由未终止');
	next();
});
app.get('/ceshi', function (req, res, next){
	console.log('检测到错误并抛出');
	// next();
	throw new Error('失败');
});
app.use('/ceshi' ,function (req, res, next){
	console.log('检测到错误并传递');
	next();
});
app.use('/ceshi', function (err, req, res, next){
	console.log('检测到错误:' + err.message);
	// console.log('1111');
	res.send('505');
});
app.listen(1010);