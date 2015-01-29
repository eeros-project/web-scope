
var _Model = function ( data ) {

	this.label = data.label;
	this.value = data.value;
	return this;
};


_Model.find = function ( id ) {

	var eventData = {
		'getSignals': {
			label: 'Stop signals', value: 'stopSignals'
		},
		'stopSignals': {
			label: 'Get signals', value: 'getSignals'
		},
		'Connect': {
			label: 'Disconnect', value: 'Disconnect'
		},
		'Disconnect': {
			label: 'Connect', value: 'Connect'
		}

	};

	var model = new _Model(eventData[id]);
	return model;
};


var _View = function ( model ) {

	if (model.value =='Connect' || model.myProperty =='Disconnect') {
		document.getElementById('btnConnect').innerHTML = model.label;
		document.getElementById('btnConnect').value = model.value;
	}
	
	if (model.value =='stopSignals' || model.value =='getSignals') {
		document.getElementById('btnSignal').innerHTML = model.label;
		document.getElementById('btnSignal').value = model.value;
	}	
};



var _Controller = {};

_Controller.loadView = function ( id ) {

	var model = _Model.find( id );
	var view = new _View(model);

};


var _Event = function (eventname) {
	
	_Controller.loadView(eventname);

};


function listener() {


	document.getElementById("btnSignal").onclick = function () {
		_Event(document.getElementById("btnSignal").value);
		if (!eeros.is_connected) return;
		if (chart.doGetSignals==false) {
			if(w2ui.grid_sn.getSelection().length == 0) {
				alert("No signal selected");
				return;
			}
	
			resetPlotData();
			subscribeSignals(w2ui.grid_sn.getSelection());
			chart.doGetSignals = true;
			setupChart();
		
			get_signals();
			plotSignals();
		} 
		else {
			//stop signals
			chart.doGetSignals = false;
			chart.doPlotting = false;
		}	

	};


	document.getElementById("btnConnect").onclick = function () {
		_Event(document.getElementById("btnConnect").value);
		if (!eeros.is_connected){
			popupConnect();
			if (eeros.ip !="") {
				chart.getSettings();	//Settings for the chart
				bindChart();			//binding master and detail charts for selection/zooming
				currentLogs(); 
				currentLevel();
				getListOfSignals();
			}
		} else {
			//Disconnect and clear session

			document.getElementById("safetylevel").value = "";
			document.getElementById("robotname").value = "";
			sessionStorage.clear();
			eeros.robotname = "";
			eeros.ip = "";
			eeros.is_connected = false;
		
			location.reload();
		}	

	};
	

}
