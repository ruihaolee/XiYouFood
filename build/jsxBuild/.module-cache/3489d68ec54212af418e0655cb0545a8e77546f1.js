// Create By ruihaoLee 
// at 2015.5.15
// 个人页面模块
var Me = React.createClass({displayName: "Me",
	mixins : [setContentProp],
	getInitialState : function(){
		return {
			loginData : {
				collection : [],
				comment : []
			},
			loginPic : 'src/img/login.png',
			controlLoginButton : false                                                                                           
		}
	},
	render : function(){
		return (
			React.createElement("div", {id: "me", className: this.props.whichContent == 'me' ? 'nowContent' : 'otherContent'}, 
				React.createElement(LoginBack, {getLoginData: this.getLoginData, loginPic: this.state.loginPic, changeUserPic: this.changeUserPic, controlLoginButton: this.state.controlLoginButton}), 
				React.createElement(LoginItem, {loginData: this.state.loginData, outLogin: this.outLoginData})
			)			
		);
	},
	getLoginData : function(data){
		this.setState({
			loginData : data
		});
	},
	outLoginData : function(){
		console.log('outLoginData');
		this.setState({
			loginData : {
				collection : [],
				comment : []
			},
			loginPic : 'src/img/login.png',
			controlLoginButton : !this.state.controlLoginButton 
		});
	},
	changeUserPic : function(picUrl){
		this.setState({
			loginPic : picUrl
		});
	}
});

var Shadow = React.createClass({displayName: "Shadow",
	mixins : [commonBase],
	PropTypes : {
		shadowDisplay : React.PropTypes.bool.isRequired,
		watchShadow : React.PropTypes.func.isRequired,
		userName : React.PropTypes.string.isRequired,
		passWord : React.PropTypes.string.isRequired,
		watchInput : React.PropTypes.func.isRequired,
		changeUserPic : React.PropTypes.func.isRequired
	},
	componentDidMount : function(){
		this.setShadowHeight();

		//第一次的时候就检测用户之前是否已经登陆但是并没有退出
		//如果有   直接拿出用户信息		
		this.base().Ajax('http://localhost:5656/xiyouFood/ifLogin', {}, 'GET', (function (data){
			if (data.result) {
				this.ifLogin = true;
				this.refs.loginBottomText.innerHTML = '你已经成功登陆';

				this.base().Ajax('http://localhost:5656/xiyouFood/getLoginData', {}, 'GET', (function (data){
						this.props.changeUserPic(data.data.loginPic);
						this.props.getLoginData(data.data);					
				}).bind(this));	
			}
		}).bind(this));
	},
	componentWillReceiveProps : function(props){
		if(props.controlLoginButton != this.props.controlLoginButton){
			this.ifLogin = !this.ifLogin;
			this.flushButton = true;
		}
	},
	componentDidUpdate : function(){
		this.setShadowHeight();
		if(this.flushButton){
			this.refs.loginBottomText.innerHTML = '点击登陆';
			this.flushButton = false;
		}
	},
	render : function(){
		return (
			React.createElement("div", {id: "shadow", className: this.props.shadowDisplay === false ? 'noneBlock' : '', ref: "shadow", onClick: this.noneClickHandle}, 
				React.createElement("div", {id: "loginForm"}, 
					React.createElement("p", null, "欢迎使用西邮食堂"), 
					React.createElement("div", {id: "inputBox"}, 
						React.createElement("div", {className: "lineBox"}, 
							React.createElement("label", {htmlFor: "userName"}, "账号"), 
							React.createElement("input", {type: "text", id: "userName", onChange: this.props.watchInput, value: this.props.userName, placeholder: "请输入你的学号"})
						), 
						React.createElement("div", {className: "lineBox"}, 
							React.createElement("label", {htmlFor: "passWord"}, "密码"), 
							React.createElement("input", {type: "password", id: "passWord", onChange: this.props.watchInput, value: this.props.passWord, placeholder: "请输入你的密码"})
						)
					), 
					React.createElement("div", {id: "goLogin", onClick: this.loginClickHandle, ref: "loginBottomText"}, "点击登陆")
				)
			)
		);
	},
	setShadowHeight : function(){
		var clientHeight = document.documentElement.clientHeight;
		this.refs.shadow.style.height = clientHeight + 'px';
	},
	noneClickHandle : function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		if (target.id === 'shadow') {
			this.props.watchShadow();
		}
	},
	loginClickHandle : function(){
		if (this.ifLogin) {
			console.log('return');
			return;
		}

		var userData = {
			number : this.props.userName,
			password : this.props.passWord
		};

		this.base().Ajax('http://localhost:5656/xiyouFood/login', userData, 'GET', (function (data){
			var result = data.result;
			if (result) {
				this.base().Ajax('http://localhost:5656/xiyouFood/getLoginData', {}, 'GET', (function (data){
						// console.log(data.data.loginPic);
						this.props.changeUserPic(data.data.loginPic);
						this.props.getLoginData(data.data);
						//隐藏shadow
						this.props.watchShadow();
						this.refs.loginBottomText.innerHTML = '你已经成功登陆';
						this.ifLogin = true;
						this.props.clearInput();					
					}).bind(this));
			}
			else{
				alert('登陆失败,请检查账号的密码');
			}
		}).bind(this));
	}
});

var LoginBack = React.createClass({displayName: "LoginBack",
	PropTypes : {
		getLoginData : React.PropTypes.func.isRequired,
		loginPic : React.PropTypes.string.isRequired,
		changeUserPic : React.PropTypes.string.isRequired
	},
	mixins : [commonBase],
	getInitialState : function(){
		return {
			shadowDisplay : false,
			userName : '',
			passWord : ''
		}
	},
	render : function(){
		return (
			React.createElement("div", {id: "loginBox"}, 
				React.createElement(Shadow, React.__spread({},  this.state, {watchShadow: this.watchShadow, watchInput: this.watchInput, changeUserPic: this.props.changeUserPic, getLoginData: this.props.getLoginData, clearInput: this.clearInput, controlLoginButton: this.props.controlLoginButton})), 
				React.createElement("div", {id: "loginBack"}, 
					React.createElement("div", {id: "backImg"}), 
					React.createElement("div", {id: "loginPicBox", onClick: this.watchShadow}, 
						React.createElement("img", {src: this.props.loginPic, id: "loginPic"})
					)
				)
			)
		);
	},
	watchShadow : function(){
		this.setState({
			shadowDisplay : !this.state.shadowDisplay
		});
	},
	watchInput : function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var newText = target.value;
		if (target.id == 'userName') {
			this.setState({
				userName : newText
			});
		}
		else if(target.id == 'passWord'){
			this.setState({
				passWord : newText
			});
		}
	},
	clearInput : function(){
		this.setState({
			userName : '',
			passWord : ''
		});
	}
});

var LoginItem = React.createClass({displayName: "LoginItem",
	mixins : [commonBase],
	PropTypes : {
		loginData : React.PropTypes.object.isRequired,
		outLogin : React.PropTypes.func.isRequired
	},
	getInitialState : function(){
		return {
			itemContent : 'collection'
		}
	},
	render : function(){
		return (
			 React.createElement("div", {id: "loginItem"}, 
			 	React.createElement("div", {id: "threeBox", onClick: this.circleBoxClickHandle}, 
			 		React.createElement("div", {className: "oneBox"}, 
			 			React.createElement("div", {className: "oneCircle", name: "collection"}, this.props.loginData.collection.length), 
			 			React.createElement("span", null, "收藏")
			 		), 
			 		React.createElement("div", {className: "oneBox"}, 
			 			React.createElement("div", {className: "oneCircle", name: "comment"}, this.props.loginData.comment.length), 
			 			React.createElement("span", null, "评论")
			 		), 
			 		React.createElement("div", {className: "oneBox"}, 
			 			React.createElement("div", {className: "oneCircle", name: "out"}, "out"), 
			 			React.createElement("span", null, "退出")
			 		)
			 	), 
			 	React.createElement(MainItem, {itemContent: this.state.itemContent, loginData: this.props.loginData})
			 )
		);
	},
	circleBoxClickHandle : function (event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var whichCircle = target.getAttribute('name');
		if (whichCircle == '') {
			return;
		}
		else if(whichCircle == 'collection' || whichCircle == 'comment'){
			this.setState({
				itemContent : whichCircle
			});
		}
		else if (whichCircle == 'out'){
			this.base().Ajax('http://localhost:5656/xiyouFood/outLogin', {}, 'GET', (function (data){
				console.log(data);
				if (data.state == false) {
					alert('同学你还没有登陆~');
				}
				else{
					alert('退出成功');
					this.props.outLogin();
				}
			}).bind(this));
		}
	}
});

var MainItem = React.createClass({displayName: "MainItem",
	mixins : [storeClick],
	PropTypes : {
		loginData : React.PropTypes.object.isRequired
	},
	componentWillMount : function(){
		this.navText = '我的收藏';
	},
	componentWillReceiveProps : function(props){
		if (props.itemContent == 'collection') {
			this.navText = '我的收藏';
		}
		else if (props.itemContent == 'comment') {
			this.navText = '我的评论';
		}
	},
	render : function(){
		return (
			React.createElement("div", {id: "mainItem"}, 
				React.createElement("div", {id: "navItem"}, this.navText), 
				React.createElement("div", {id: "ItemBox"}, 
					React.createElement("div", {className: "item", ref: "collection", onClick: this.storeClickHandle}, 
						
							this.props.loginData.collection.map(function (oneStore){
									return React.createElement("div", {className: "store", key: oneStore.id}, 
												React.createElement("div", {className: "logoBox"}, 
													React.createElement("img", {src: oneStore.imgurl, className: "logoPic"})
												), 
												React.createElement("div", {className: "storeText_first"}, 
													React.createElement("p", null, oneStore.name), 
													React.createElement("p", null, "综合评分:", oneStore.score), 
													React.createElement("p", null, oneStore.label)
												), 
												React.createElement("div", {className: "storeText_second"}, 
													React.createElement("p", null, "人均￥", oneStore.price), 
													React.createElement("p", null, oneStore.locat)
												)
											);
					})
					), 
					React.createElement("div", {className: "item", ref: "comment"}, 
					
						this.props.loginData.comment.map(function (oneComment){
							return  React.createElement("div", {className: "comment", key: (Math.random() * 1000) / Math.random()}, 
										React.createElement("div", {className: "commentPic"}), 
										React.createElement("div", {className: "anotherText"}, 
											React.createElement("p", null, oneComment.name), 
											React.createElement("p", null, 
												React.createElement("span", null, '评分: ' + oneComment.score), 
												React.createElement("span", null, oneComment.time)
											)
										), 
										React.createElement("div", {className: "mainText"}, oneComment.text)
									);
						})
					
					)
				)
			)
		);
	},
	componentDidUpdate : function(){
		if (this.props.itemContent == 'collection') {
			this.refs.collection.style.display = 'block';
			this.refs.comment.style.display = 'none';
		}
		else if(this.props.itemContent == 'comment'){
			this.refs.collection.style.display = 'none';
			this.refs.comment.style.display = 'block';
		}
	}
});