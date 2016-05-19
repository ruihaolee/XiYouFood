// Create By ruihaoLee 
// at 2015.5.2
var Container = React.createClass({displayName: "Container",
	getInitialState : function(){
		return {
			whichContent : 'home'
		};
	},
	navHandleClick : function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var key = target.getAttribute('name');
		this.setState({
			whichContent : key
		});
	},
	render : function(){
		return (
			React.createElement("div", {id: "container"}, 
				React.createElement(Nav, {navHandleClick: this.navHandleClick, whichContent: this.state.whichContent}), 
				React.createElement(Content, {whichContent: this.state.whichContent})
			)
		);
	}
});

var Nav = React.createClass({displayName: "Nav",
	PropTypes : {
		navHandleClick : React.PropTypes.func.isRequired
	},
	render : function(){
		return (
			React.createElement("div", null, 
				React.createElement("div", {id: "header"}, 
					React.createElement("div", {id: "xiyoulogo"}), 
					React.createElement("span", null, "西邮食堂")
				), 
				React.createElement("div", {id: "navBox", onClick: this.props.navHandleClick}, 
					 React.createElement("div", {className: "nav", name: "home"}, 
						React.createElement("img", {src: "src/img/home_2.png", name: "home", ref: "home", className: "navImage"})	
					 ), 
					 React.createElement("div", {className: "nav", name: "food"}, 
						React.createElement("img", {src: "src/img/food_1.png", name: "food", ref: "food", className: "navImage"})	
					 ), 
					 React.createElement("div", {className: "nav", name: "me"}, 
						React.createElement("img", {src: "src/img/me_1.png", name: "me", ref: "me", className: "navImage"})	
					 )
				)
			)
		);
	},
	componentDidUpdate : function(){
		var navArr = ['home', 'food', 'me'];
		for(var i = 0; i < navArr.length; i++){
			var nowLogo = this.refs[navArr[i]];
			if (navArr[i] == this.props.whichContent)
				var srcString = "src/img/" + this.props.whichContent + "_2.png";
			else
				var srcString = "src/img/" + navArr[i] + "_1.png";
			nowLogo.src = srcString;
		}
	}
});

var Content = React.createClass({displayName: "Content",
	PropTypes : {
		whichContent : React.PropTypes.string.isRequired
	},
	render : function(){
		return (
			React.createElement("div", {id: "content"}, 
				React.createElement(Home, {whichContent: this.props.whichContent}), 
				React.createElement(Food, {whichContent: this.props.whichContent}), 
				React.createElement(Me, {whichContent: this.props.whichContent})
			)
		);
	}
});

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

ReactDOM.render(
	React.createElement(Container, null),
	document.body
);