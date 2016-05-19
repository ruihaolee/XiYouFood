var loginFun = {
	checkUser : function(req, res){
		var getData = req.query;
		var responData = null;
		if (getData.number == '04141197' && getData.password == 'liruihao1910') {
			responData = {
				result : true,
				reason : '登陆成功'
			};
			console.log(req.session);
			if (!req.session.userName) {
				req.session.userName = '李睿豪';
				console.log('first login');
			}
			else{
				console.log(req.session.userName);
				console.log('have login');
			}
			
		}
		else{
			responData = {
				result : false,
				reason : '检测你的学号和密码'
			};
		}
		response(req, res, responData);		
	},
	ifLogin : function(req, res){
		if (req.session.userName) {
			response(req, res, {result:true, reason: '已登陆'});
		}
		else{
			response(req, res, {result:false, reason: '无登陆'});
		}
	},
	outLogin : function(req, res){
		if (req.session.userName) {
			delete req.session.userName;
			response(req, res, {state: true, reason: '已经退出登录'});
		}
		else{
			response(req, res, {state: false, reason: '没有登陆'});
		}
	}
}
function response(req, res, data){
	if (req.query && req.query.callback) {
		res.set('Content-Type', 'application/json');
		res.send(200, req.query.callback + '(' + JSON.stringify(data) + ')')
	}
}


exports.loginFun = loginFun;