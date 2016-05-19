// Create By ruihaoLee 
// at 2015.5.6
//首页 模块
var setContentProp = {
	PropTypes : {
		whichContent : React.PropTypes.string
	},
	base : function(){
		return new Base();
	}
};

storeClick = {
	storeClickHandle : function (event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		this.findWhichStore(target);
	},
	findWhichStore : function(targetEle){
		if (targetEle.className == 'store') {
			var storeId  = targetEle.getAttribute('name');
			window.location.href = 'store.html?' + 'storeId=' + storeId; 
			return;
		}
		else{
			targetEle = targetEle.parentNode;
			if (targetEle == null) 
				return;
			arguments.callee(targetEle);
		}
	}
}

var commonBase = {
	base : function(){
		return new Base();
	}
}
var Home = React.createClass({displayName: "Home",
	mixins : [setContentProp,storeClick],
	getInitialState : function(){
		return {
			imageBoxPos : 0,
			storeArr : []
		}
	},
	render : function(){
		return (
			React.createElement("div", {id: "home", className: this.props.whichContent == 'home' ? 'nowContent' : 'otherContent'}, 
				React.createElement("div", {id: "backImageBox"}, 
					React.createElement("div", {id: "overImageBox"}, 
						React.createElement("div", {id: "imageBox", ref: "imageBox"}, 
							React.createElement("div", null), 
							React.createElement("div", null), 
							React.createElement("div", null), 
							React.createElement("div", null)
						), 
						React.createElement("div", {id: "circleBox", ref: "circleBox"}, 
							React.createElement("div", {className: "circle"}), 
							React.createElement("div", {className: "circle"}), 
							React.createElement("div", {className: "circle"}), 
							React.createElement("div", {className: "circle"})							
						)
					)
				), 
				React.createElement("div", {id: "topFood"}, 
					React.createElement("div", {id: "topText"}, 
						React.createElement("div", {className: "toplogo"}), 
						React.createElement("p", null, "Top食"), 
						React.createElement("div", {className: "toplogo"})
					), 
					React.createElement("div", {id: "storeBox", onClick: this.storeClickHandle}, 
							
							this.state.storeArr.map(function (oneStore){
									// console.log(oneStore);
									return React.createElement("div", {className: "store", key: oneStore.id, name: oneStore.id}, 
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
					)
				)
			)			
		);
	},
	componentDidMount : function(){
		var circleArr = this.refs.circleBox.getElementsByClassName('circle');
		this.circleArr = circleArr;
		this.circleArr[this.state.imageBoxPos].style.backgroundColor = '#FFCE05';

		setInterval((function(){
			if (this.state.imageBoxPos == 3) {
				this.setState({
					imageBoxPos : 0
				});
				return;
			}
			var nowImageBoxPos = this.state.imageBoxPos + 1;
			this.setState({
				imageBoxPos : nowImageBoxPos
			});
		}).bind(this), 5000);
		
		this.addStoreItems();
	},
	componentDidUpdate : function(){
		var imageBox = this.refs.imageBox;
		var pos = (this.state.imageBoxPos * 100) + '%';
		imageBox.style.right = pos;

		for(var i = 0; i < this.circleArr.length; i++){
			if (this.state.imageBoxPos == i) {
				this.circleArr[i].style.backgroundColor = '#FFCE05';
			}
			else{
				this.circleArr[i].style.backgroundColor = '#fff';
			}
		}
	},
	addStoreItems : function(getStoresData){
		console.log('ajax');
		this.base().Ajax('http://localhost:5656/xiyouFood/getItems',{},'GET',(function (getData){
			// console.log(getData);
			this.setState({
				storeArr : getData.data
			});
		}).bind(this));
	}
});