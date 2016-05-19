(function(){
	var Base = function(){};
	Base.prototype = {
		constructor : Base,
		Ajax : function(url, data, type, callback){
			$.ajax({
				url : url,
				type : type,
				dataType : 'jsonp',
				data : data,
				success : callback
			});	
		}
	}
	var commonBase = {
		base : function(){
			return new Base();
		}
	}


	var Store = React.createClass({displayName: "Store",
		mixins: [commonBase],
		getInitialState : function(){
			return {
				storeData : {
					topImage : [],
					menu : [],
					data : {},
					comment : []
				}
			}
		},
		componentWillMount : function(){
			var paramStr = window.location.search;
			var reg = new RegExp('storeId=[^&]*');
			var result = reg.exec(paramStr);
			if (!result) {
				window.location.href = 'index.html';
			}
			else{
				var storeId = result[0].substr(8);
				this.base().Ajax('http://localhost:5656/xiyouFood/getStoreData', {storeId : storeId}, 'GET', (function (storeData){
					this.setState({
						storeData : storeData
					});
				}).bind(this));
			}
		},
		render : function(){
			return (
				React.createElement("div", {id: "storeContainer"}, 
					React.createElement(StoreImageAnimate, {imageData: this.state.storeData.topImage}), 
					React.createElement(StoreMain, {mainData: this.state.storeData.data}), 
					React.createElement(StoreContainer, {menu: this.state.storeData.menu, comment: this.state.storeData.comment})
				)
			);
		}
	});
	//轮播图
	var StoreImageAnimate = React.createClass({displayName: "StoreImageAnimate",
		prototype : {
			imageData : React.PropTypes.array.isRequired
		},
		componentWillMount : function(){//初始化渲染前先规定当前的轮播偏移位置
			this.nowImage = 0;
		},
		componentDidMount : function(){//在第一次初始化渲染后就开启轮播器
			setInterval((function(){
				stringRight = (this.nowImage * 100) + '%';
				this.refs.animateImageBox.style.right = stringRight;
				//更新导航圆圈
				for(var i = 1; i <= 3; i++){
					var circleString = 'circle' + i;
					if ((this.nowImage + 1) == i) {
						this.refs[circleString].style.backgroundColor = '#666';
					}
					else{
						this.refs[circleString].style.backgroundColor = '#ffffff';
					}
				}
				
				this.nowImage++;
				if (this.nowImage == 3) {
					this.nowImage = 0;
				}
			}).bind(this), 3500);
		},
		render : function(){
			console.log(this.props.imageData);
			return (
				React.createElement("div", {id: "storeImageBox"}, 
					React.createElement("div", {id: "animateImageBox", ref: "animateImageBox"}, 
						
							this.props.imageData.map(function (oneImage){
								return React.createElement("div", {key: Math.random() / Math.random()}, 
											React.createElement("img", {src: oneImage.src}), 
											React.createElement("div", {className: "bottomShadowText"}, 
												React.createElement("span", null, oneImage.name)
											)
										);								
							})
												
					), 
					React.createElement("div", {id: "circleBox"}, 
						React.createElement("div", {ref: "circle1"}), 
						React.createElement("div", {ref: "circle2"}), 
						React.createElement("div", {ref: "circle3"})
					), 
					React.createElement("div", {id: "back", onClick: this.backClickHandle}, React.createElement("img", {src: "src/img/back_index.png"})), 
					React.createElement("div", {id: "collect", onClick: this.collectHandle}, React.createElement("img", {src: "src/img/shoucang.png"}))
				)
			);
		},
		backClickHandle : function(){
			window.location.href = 'index.html';
		},
		collectHandle : function(){
			alert('服务端正在建设..sorry');
		}
	});

	//店铺信息组件
	var StoreMain = React.createClass({displayName: "StoreMain",
		mixins: [commonBase],
		PropTypes : {
			mainData : React.PropTypes.object.isRequired
		},
		getInitialState : function(){
			return {
				ifDisplay : false,
				textarea : '',
				userName : '',
				passWord : ''
			}
		},
		render : function(){
			return (
				React.createElement("div", {id: "mainText"}, 
					React.createElement("p", null, this.props.mainData.name), 
					React.createElement("p", null, 
						React.createElement("span", null, "评分: " + this.props.mainData.score), 
						React.createElement("span", null, "人均: " + this.props.mainData.price)
					), 
					React.createElement("div", {id: "localBox"}, 
						React.createElement("div", {id: "localImageBox"}, 
							React.createElement("img", {src: "src/img/localImage.png"})
						), 
						React.createElement("div", null, this.props.mainData.locat)
					), 
					React.createElement("div", {id: "say", onClick: this.sayClickHandle}, "我要评价"), 
					React.createElement(SayShadow, React.__spread({},  this.state, {changeShadow: this.changeShadow, inputWatch: this.inputWatch}))
				)
			);
		},
		sayClickHandle : function(){
			var ifLogin = null;
			this.base().Ajax('http://localhost:5656/xiyouFood/ifLogin', {}, 'GET', (function (data){
				ifLogin = data.result;
				this.setState({
					ifDisplay : !this.state.ifDisplay,
					ifLogin : ifLogin
				});	
			}).bind(this));

		},
		changeShadow : function(){
			this.setState({
				ifDisplay : !this.state.ifDisplay
			});
		},
		inputWatch : function(event){
			var event = event || window.event;
			var target = event.target || event.srcElement;
			if(target.id == 'sayText'){
				this.setState({
					textarea : target.value
				});
			}
			else if(target.id == 'userName'){
				this.setState({
					userName : userName.value
				});
			}
			else if(targetId == 'passWord'){
				this.setState({
					passWord : passWord.value
				});
			}
		}
	});
	//阴影 登陆和评论 组件
	var SayShadow = React.createClass({displayName: "SayShadow",
		mixins : [commonBase],
		PropTypes : {
			ifDisplay : React.PropTypes.bool.isRequired,
			changeShadow : React.PropTypes.func.isRequired,
			inputWatch : React.PropTypes.func.isRequired,
			textarea : React.PropTypes.string.isRequired,
			passWord : React.PropTypes.string.isRequired,
			userName : React.PropTypes.string.isRequired,
			ifLogin : React.PropTypes.bool
		},
		componentDidMount : function(){
			this.setShadowHeight();
		},
		render : function(){
			return (
				React.createElement("div", {id: "sayShadow", ref: "sayShadow", onClick: this.shadowClick}, 
					React.createElement("div", {id: "sayForm", ref: "sayForm"}, 
						React.createElement("p", null, "留下你对店家的评价吧"), 
						React.createElement("div", {id: "sayTextBox"}, 
							React.createElement("textarea", {ref: "textarea", onChange: this.props.inputWatch, id: "sayText", value: this.props.textarea})
						), 
						React.createElement("div", {id: "buttonSay"}, "就这些啦")
					), 
					React.createElement("div", {id: "loginForm", ref: "loginForm"}, 
						React.createElement("p", null, "欢迎使用西邮食堂"), 
						React.createElement("div", {id: "inputBox"}, 
							React.createElement("div", {className: "lineBox"}, 
								React.createElement("label", {htmlFor: "userName"}, "账号"), 
								React.createElement("input", {type: "text", id: "userName", onChange: this.props.inputWatch, value: this.props.userName, placeholder: "请输入你的学号"})
							), 
							React.createElement("div", {className: "lineBox"}, 
								React.createElement("label", {htmlFor: "passWord"}, "密码"), 
								React.createElement("input", {type: "password", id: "passWord", onChange: this.props.inputWatch, value: this.props.passWord, placeholder: "请输入你的密码"})
							)
						), 
						React.createElement("div", {id: "goLogin", ref: "loginBottomText"}, "点击登陆")
					)
				)
			);
		},
		componentDidUpdate : function(){
			this.setShadowHeight();
			if (this.props.ifDisplay) {
				this.refs.sayShadow.style.display = 'block';
			}
			else {
				this.refs.sayShadow.style.display = 'none';
			}

			if (this.props.ifLogin === true) {
				this.refs.sayForm.style.display = 'block';
				this.refs.loginForm.style.display = 'none';
			}
			else if(this.props.ifLogin === false){
				this.refs.sayForm.style.display = 'none';
				this.refs.loginForm.style.display = 'block';				
			}
		},
		setShadowHeight : function(){
			var clientHeight = document.documentElement.clientHeight;
			this.refs.sayShadow.style.height = clientHeight + 'px';
		},
		shadowClick : function(event){
			var event = event || window.event;
			var target = event.target || event.srcElement;
			targetId = target.id;
			if (targetId == 'sayShadow') {
				this.props.changeShadow();
			}
			else if(targetId == 'buttonSay'){
				this.sayTextSubmit();
				this.props.changeShadow();
			}
			else if(targetId == 'goLogin'){
				this.userLogin();
			}
		},
		sayTextSubmit : function(){
			var sayText = this.props.textarea;
			this.base().Ajax('http://localhost:5656/xiyouFood/ifLogin', {}, 'GET', function (data){
				if (data.result) {
					//此时验证用户已经登陆然后请求评论API
					
				}
			});
		},
		userLogin : function(){
			var data = {
				number: this.props.userName,
				password: this.props.passWord
			};
			this.base().Ajax('http://localhost:5656/xiyouFood/login', data, 'GET', (function (data){
				if (data.result) {
					this.props.changeShadow();
				}
				else{
					alert('请检查账号的密码');
				}
			}).bind(this));
		}
	});

	StoreContainer = React.createClass({displayName: "StoreContainer",
		PropTypes : {
			menu : React.PropTypes.array.isRequired,
			comment : React.PropTypes.array.isRequired
		},
		render : function(){
			return (
				React.createElement("div", {id: "storeContainer"}, 
					React.createElement("div", {id: "menu"}, 
						React.createElement("div", {className: "containerTitle"}, "推荐菜品"), 
						React.createElement("div", {id: "menuContent"}, 
						
							this.props.menu.map(function (oneFood){
								return React.createElement("div", {key: Math.random()/oneFood.price}, oneFood.name + '￥' + oneFood.price)
							})
						
						)
					), 
					React.createElement("div", {id: "comment"}, 
						React.createElement("div", {className: "containerTitle"}, "热门评论"), 
						React.createElement("div", {id: "commentContent"}, 
							
								this.props.comment.map(function (oneComment){
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
		}
	});
	ReactDOM.render(
		React.createElement(Store, null),
		document.getElementById('store')
	);
})();
