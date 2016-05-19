// Create By ruihaoLee 
// at 2015.5.2
var Container = React.createClass({
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
			<div id='container'>
				<Nav navHandleClick={this.navHandleClick} whichContent={this.state.whichContent}></Nav>
				<Content whichContent={this.state.whichContent}></Content>
			</div>
		);
	}
});

var Nav = React.createClass({
	PropTypes : {
		navHandleClick : React.PropTypes.func.isRequired
	},
	render : function(){
		return (
			<div>
				<div id='header'>
					<div id='xiyoulogo'></div>
					<span>西邮食堂</span>
				</div>
				<div id='navBox' onClick={this.props.navHandleClick}>
					 <div className='nav' name='home'>
						<img src="src/img/home_2.png" name='home' ref='home' className='navImage'/>	
					 </div>
					 <div className='nav' name='food'>
						<img src="src/img/food_1.png" name='food' ref='food' className='navImage'/>	
					 </div>
					 <div className='nav' name='me'>
						<img src="src/img/me_1.png" name='me' ref='me' className='navImage'/>	
					 </div>
				</div>
			</div>
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

var Content = React.createClass({
	PropTypes : {
		whichContent : React.PropTypes.string.isRequired
	},
	render : function(){
		return (
			<div id='content'>
				<Home whichContent={this.props.whichContent}></Home>
				<Food whichContent={this.props.whichContent}></Food>
				<Me whichContent={this.props.whichContent}></Me>
			</div>
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
	<Container/>,
	document.body
);