
$(function() {
	$('#grid_signals').w2grid({ 
	    name: 'grid_sn', 
	    show: { 
	    	selectColumn: true, 
	    	header: true,
	    	toolbar: true,
	    	toolbarSearch: false,
	    	toolbarColumns: false,
	    	toolbarReload: false
	    },
	    toolbar: {
	        items: [
	            { type: 'button', id: 'btnSignalSettings', caption: 'Signal settings', icon: 'fa-wrench', hint: '' },
	            { type: 'button', id: 'btnChartSettings', caption: 'Chart settings', icon: 'fa-wrench', hint: '' }
	
	        ],
	        onClick: function (target, data) {
	        	if (target == 'btnSignalSettings') popupSignalSettings(w2ui['grid_sn'].records);
	            if (target == 'btnChartSettings') popupChartSettings(w2ui['grid_sn'].records);
	        }
	    },                    
	    fixedBody : true,
	    header: 'List of signals',
	    method: 'GET',    
		multiSelect: true,
	
	    columns: [               
	        { field: 'recid', caption: 'Name', size: '30%', sortable: true },
	        { field: 'unit', caption: 'Unit', size: '15%' },      
	    ]
	});
});


function getListOfSignals() {

	if (!eeros.is_connected) return;
	w2ui['grid_sn'].load('http://' + eeros.url + '/eeros/signals/list');

}

 
    
function subscribeSignals(signals) {
	
	$.ajaxSetup({ cache: false });	
	$.ajax({
		type: "PUT",
		url: 'http://' + eeros.url + '/eeros/signals/' ,
		crossDomain: true,
		contentType : 'application/json',
		data: JSON.stringify({ "signals": signals }),
		dataType: 'json',
	    success: function(jsondata, textStatus, jqXHR) {
	    	if (jsondata.signals[0].length > 0) {
	    		signals= jsondata.signals[0];
	    	}
	    	//checkbox grid with subscribed signals
			w2ui['grid_sn'].selectNone();
    		for (var n = 0; n < signals.length; n++ ) {
				w2ui['grid_sn'].select(signals[n]);
			}
		}
	});
}



function requestSignals() {

	var signals="";
	
	for	(var i = 0; i < data_plot.length; i++) {
		if (signals.length > 0) signals= signals + ",";
		signals = signals + data_plot[i].label;
	}
	
	$.ajaxSetup({ cache: false });	
	$.ajax({
		url: 'http://' + eeros.url + '/eeros/signals/' ,
		crossDomain: true,
		type: "GET",
		dataType: "json",
	    success: function(jsondata) {
			data_request.push(jsondata.signals);
		}
	});
}



function request_testSignals() {

	var fileNames="";
	
	if (list_no==20) list_no=0;
	list_no++;
	for	(var i = 0; i < data_plot.length; i++) {
		if (fileNames.length > 0) fileNames = fileNames + ",";
		fileNames = fileNames + data_plot[i].label + list_no.toString();
	}
	
	if (fileNames.substring(0, 4) == "Test") fileNames = "random";	//Test with random data ringbuffer
	$.ajaxSetup({ cache: false });	
	$.ajax({
		url: 'http://' + eeros.url + '/eeros/test/signals/' + fileNames ,
		crossDomain: true,
		type: "GET",
		dataType: "json",
	    success: function(jsondata) {
			data_request.push(jsondata.signals);
		}
	});
}


function get_signals(){

	if (chart.doGetSignals == true) {
		if (list_no==chart.plot_buffer) {
			chart.doPlotting = true;
		}
		
		//requestSignals();

		request_testSignals();		//test signals form files
			
	} else {
		return;
	}

	setTimeout(get_signals, Math.floor(1000/chart.data_rate));
}



function plotSignals() {

	
	if (chart.doPlotting == true) {
		
		//Preparing signals to plot
		var data_block = data_request[0];
		
		for	(var i = 0; i < data_block.length; i++) {
	    	for (var m = 0; m < data_plot.length; m++ ) {    		
	    		if (data_plot[m].label==data_block[i].label) {
	    			data_plot[m].data = data_plot[m].data.concat(data_block[i].data);
	    			if (data_plot[m].data.length > parseFloat(chart.master_range) * 1000) data_plot[m].data.splice(0, data_plot[m].data.length - parseFloat(chart.master_range) * 1000);
	    		}
	    	}		    	
		}
		data_request.shift();
		
		var plotDetail = $.plot($("#graph_section #detailContainer"),
		    data_plot,
		    detailOptions
		);
		
		var axes = plotDetail.getAxes();
		var newmaxX = axes.xaxis.max;
		axes.xaxis.options.min = newmaxX - 1;
		plotDetail.setupGrid();
		plotDetail.draw();
		
		
		var plotMaster = $.plot($("#graph_section #masterContainer"),
		    data_plot,
		    masterOptions
		);
	} else {
		//return;
	}
	
	
	setTimeout(plotSignals, Math.floor(1000/chart.data_rate));
}
	


function getSignalSettings(selection) {
	var settings = [];

	if(localStorage.getItem("eeros_signalsettings") == null){
		localStorage.setItem("eeros_signalsettings", JSON.stringify(w2ui['grid_sn'].records));
	}
	
	var o = JSON.parse(localStorage["eeros_signalsettings"]);

	for (n = 0; n < selection.length; n++ ) {
		var selSignalName = selection[n];

		for (m = 0; m < o.length; m++ ) {
			if(o[m].recid==selSignalName){
				var obj = {};
				obj.label = selSignalName;
				obj.min = o[m].min;
				if (obj.min==null) obj.min = 0;
				obj.max = o[m].max;
				if (obj.max==null) obj.max = 10;
				//obj.trigvalue = o[m].trigvalue;
				obj.yaxis = n+1;
				settings .push(obj);
			}
		}
	}
	return settings ;
}


