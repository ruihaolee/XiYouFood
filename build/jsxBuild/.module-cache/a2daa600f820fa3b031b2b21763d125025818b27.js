// Create By ruihaoLee 
// at 2015.5.10
//食 模块
var Food = React.createClass({displayName: "Food",
	mixins : [setContentProp],
	getInitialState : function(){
		this.getMoreStore.isFinish = true;
		return {
			nowPlace : 0,
			sort : 'none',
			storeData : [],
			storeName : ''
		};
	},
	componentWillMount : function(){
		this.base().Ajax('http://localhost:5656/xiyouFood/getItems', {}, 'GET', (function (storeData){
			this.setState({
				storeData : storeData.data
			});
		}).bind(this));
	},
	render : function(){
		return (
			React.createElement("div", {id: "food", className: this.props.whichContent == 'food' ? 'nowContent' : 'otherContent'}, 
				React.createElement(Choice, {clickForSort: this.clickForSort, clickForPlace: this.clickForPlace, searchStoreName: this.searchStoreName}), 
				React.createElement(StoreContainer, {storeData: this.state.storeData, nowPlace: this.state.nowPlace, sort: this.state.sort, storeName: this.state.storeName}), 
				React.createElement(Getmore, {getMoreStore: this.getMoreStore})
			)			
		);
	},
	clickForPlace : function(whichPlace){
		var now_Place = null;
		switch(whichPlace){
			case '东区食堂': now_Place = 1; break;
			case '美食广场' : now_Place = 2; break;
			case '清蒸餐厅' : now_Place = 3; break;
			case '旭日苑' : now_Place = 4; break;
			case '全部' : now_Place = 0; break;
		}
		this.setState({
			nowPlace : now_Place
		});
	},
	clickForSort : function (targetName){
		this.setState({
			sort : targetName
		});
	},
	getMoreStore : function(){
		if (this.getMoreStore.isFinish) {
			this.getMoreStore.isFinish = false;
			this.base().Ajax('http://localhost:5656/xiyouFood/getItems', {}, 'GET', (function (storeData){
				var tempArr = this.state.storeData.concat(storeData.data);
				console.log(tempArr);
				this.getMoreStore.isFinish = true;
				this.setState({
					storeData : tempArr
				});
			}).bind(this));
		}
		else{
			alert('同学你的小爪子点击太快啦~');
		}
	},
	searchStoreName : function(storeName){
		this.setState({
			storeName : storeName
		});
	}
});

var Choice = React.createClass({displayName: "Choice",
	PropTypes : {
		clickForPlace : React.PropTypes.func.isRequired,
		clickForSort : React.PropTypes.func.isRequired,
		searchStoreName : React.PropTypes.func.isRequired
	},
	componentWillMount : function(){
		this.stringPlace = '全部';
	},
	render : function(){
		return (
			React.createElement("div", {id: "search_choice"}, 
				React.createElement(Search, {searchStoreName: this.props.searchStoreName}), 
				React.createElement("div", {id: "choice", onClick: this.topChoiceClickhandle}, 
					React.createElement("div", {className: "firstNav", name: "place"}, this.stringPlace), 
					React.createElement("div", {className: "firstNav", name: "score_sort"}, "好评"), 
					React.createElement("div", {className: "firstNav", name: "price_sort"}, "价格")
				), 
				React.createElement("div", {id: "placeChoiceBox", ref: "placesBox", onClick: this.placeChoiceClickhandle}, 
					React.createElement("div", {className: "secondNav"}, "东区食堂"), 
					React.createElement("div", {className: "secondNav"}, "美食广场"), 
					React.createElement("div", {className: "secondNav"}, "清蒸餐厅"), 
					React.createElement("div", {className: "secondNav"}, "旭日苑"), 
					React.createElement("div", {className: "secondNav"}, "全部")
				)
			)
		);
	},
	topChoiceClickhandle : function(event){
		var nameArr = ['place', 'score_sort', 'price_sort'];
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var targetName = target.getAttribute('name');
		for(var i = 0; i < nameArr.length; i++){
			var thisfirstNav = document.getElementsByName(nameArr[i])[0];
			if (nameArr[i] == targetName) {
				thisfirstNav.style.backgroundColor = '#FFCE05';
			}
			else
				thisfirstNav.style.backgroundColor = '#FCFCFC';
		}

		switch(targetName){
			case 'place' : 
					var placesBox = this.refs.placesBox;
					if (!this.show) {
						placesBox.style.display = 'block';
						this.show = true;
					}
					else{
						placesBox.style.display = 'none';
						this.show = false;						
					}
					break;
			default : 
					if (this.show) {
						var placesBox = this.refs.placesBox;
						placesBox.style.display = 'none';
						this.show = false;
					}
					this.props.clickForSort(targetName);
					break;							
		}
	},
	placeChoiceClickhandle : function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		if (target.id == 'placeChoiceBox') 
			return;
		var whichPlace = target.innerHTML;
		if (this.show) {
			var placesBox = this.refs.placesBox;
			placesBox.style.display = 'none';
			this.show = false;
		}
		this.stringPlace = whichPlace;
		this.props.clickForPlace(whichPlace);
	}
});

var Search = React.createClass({displayName: "Search",
	PropTypes : {
		searchStoreName : React.PropTypes.func.isRequired
	},
	getInitialState : function(){
		return {
			searchVal : ''
		};
	},
	render : function(){
		return (
			React.createElement("div", {id: "search"}, 
				React.createElement("div", {id: "searchPic"}), 
				React.createElement("input", {type: "text", value: this.state.searchVal, placeholder: "店铺名称", onChange: this.inputValHandle})
			)
		);
	},
	inputValHandle : function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		this.setState({
			searchVal : target.value
		});
		clearTimeout(this.inputValHandle.timeId);
		this.inputValHandle.timeId = setTimeout((function(){
			this.props.searchStoreName(target.value);
		}).bind(this), 1000);
	}
});

var StoreContainer = React.createClass({displayName: "StoreContainer",
	mixins : [storeClick],
	PropTypes : {
		storeData : React.PropTypes.array.isRequired,
		nowPlace : React.PropTypes.number.isRequired,
		sort : React.PropTypes.string.isRequired,
		storeName : React.PropTypes.string.isRequired
	},
	componentWillMount : function(){
		this.useData = this.props.storeData;
	},
	render : function(){
		return (
			React.createElement("div", {id: "allstoreBox", onClick: this.storeClickHandle}, 
			
				this.useData.map(function (oneStore){
						return React.createElement("div", {className: "store", name: oneStore.id, key: ((Math.random() * 1000 * Math.floor(oneStore.id)) / Math.random())}, 
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
		);
	},
	componentWillReceiveProps : function(props){
		var tempArr = [] , tempArr_sec = [];
		this.useData = props.storeData.concat();
		if (props.nowPlace != 0) {
			for(var i = 0; i < this.useData.length; i++){
				if (this.useData[i].area == props.nowPlace) {
					tempArr.push(this.useData[i]);
				}
			}
			this.useData = tempArr;
		}

		if (props.storeName != '') {
			for(var i = 0; i < this.useData.length; i++){
				if (this.useData[i].name == props.storeName) {
					tempArr_sec.push(this.useData[i]);
				}
			}
			this.useData = tempArr_sec;
		}

		if (props.sort == 'score_sort') {
			this.useData.sort(function (a,b){
				return parseFloat(b.score) - parseFloat(a.score);
			});
		}
		else if(props.sort == 'price_sort'){
			this.useData.sort(function (a,b){
				return parseFloat(a.price) - parseFloat(b.price);
			});			
		}			

	}
});

var Getmore = React.createClass({displayName: "Getmore",
	PropTypes : {
		getMoreStore : React.PropTypes.func.isRequired
	},
	render : function(){
		return (
			React.createElement("div", {id: "getMore", onClick: this.props.getMoreStore}, "加载更多")
		);
	}
});