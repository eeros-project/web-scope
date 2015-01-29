
var selected_signals = [];
var subscribed_signals = [];
var data_request = [];			//data from REST
var data_block = [];			//Buffer data_request from REST
var data_plot = [];				//data of visible graphs
var yAxes = [];

var list_no=0;					//test signals from files
var t_start;

//***************
function Chart () {
	this.x_start = 0;				//first timestamp of data = 0 on x axis
    this.data_rate = 10;			//get data from REST per sec
    this.plot_buffer = 3;				//plot per data
    this.master_range = 5;			//sec
    this.detail_range = 2;			//sec
    this.level_rate = 2;			//per sec
    this.logs_rate = 2;				//per sec
    this.doGetSignals = false;		//start/stop getting signals
    this.doPlotting = false;		//start/stop plotting
	
    this.getSettings = function() {
    	//get settings from localStorage if exists
    	var obj = localStorage["eeros_chartsettings"];
    	if (obj!=null){
			var o=JSON.parse(obj);
			for (m = 0; m < o.length; m++ ) {
		    	if (o[m].recid == "1") this.data_rate = o[m].value;
		    	if (o[m].recid == "2") this.plot_buffer= o[m].value;
		    	if (o[m].recid == "3") this.master_range = o[m].value;
				if (o[m].recid == "4") this.detail_range = o[m].value;
				if (o[m].recid == "5") this.level_rate = o[m].value;
				if (o[m].recid == "6") this.logs_rate = o[m].value;
			}
		}
	};
};


$(function() {

    var plotDetail = $.plot($("#graph_section #detailContainer"),
        data_plot,
        detailOptions
    );
 
    var plotMaster = $.plot($("#graph_section #masterContainer"),
        data_plot,
        masterOptions
    );

});

var masterOptions = {            
         series: {
            lines: { show: true, lineWidth: 1.5 },                
            shadowSize: 0
        },
        //grid: {                
        //    backgroundColor: { colors: ["#96CBFF", "#75BAFF"] }
        //},

        yaxis:{
            show: false
        },
        xaxis:{
			mode: "Time",
		    tickFormatter: function (v, axis) {
		        var t_current = new Date(v*1000);
		        var sec = t_current.getSeconds();
		        var ms = t_current.getMilliseconds();
				return sec+"."+ms;
		    },
        },

        
        legend:{         
            show: false
        },        
        selection:{
            mode: "x"
        }
};

var detailOptions = {            
         series: {
            lines: { show: true, lineWidth: 1.5 },
            shadowSize: 0
        },
        grid: {  
            hoverable: true,               
        //    backgroundColor: { colors: ["#96CBFF", "#75BAFF"] }
        },
        

        //yaxis:{
        //    position: "right"
        //},
       // yaxes: yAxes,
        yaxes:  [
			    {
			        min: 0,
			        max: 21,
			        position: "right"
			    },{
			        min: 0,
			        max: 115,
			        position: "right"
			    }
			],
        xaxis:{
			mode: "Time",
			timeformat: "%ss:ms",
			
		    tickFormatter: function (v, axis) {
		    	//if (t_start == null) t_start = v*1000;
		        var t_current = new Date(v*1000);
		        var sec = t_current.getSeconds();
		        var ms = t_current.getMilliseconds();
				return sec+"."+ms;
		    },  
			
        },

        selection:{
            mode: "x"
        }
};


var t_min = 0;
var t_now = 0;
var t_start = 0;




function resetPlotData() {
	data_request = [];
	data_plot = [];
	
	list_no=0;
}




function bindChart() {

    //var plotDetail = $.plot($("#graph_section #detailContainer"),
    var plotDetail = $.plot($("#graph_section #detailContainer"),
        data_plot,
        detailOptions
    );
 
    var plotMaster = $.plot($("#graph_section #masterContainer"),
        data_plot,
        masterOptions
    );

 
    $("#graph_section #detailContainer").bind("plotselected", function (event, ranges) {        
       plotDetail = $.plot($("#graph_section #detailContainer"), data_plot,
                      $.extend(true, {}, detailOptions, {
                          xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
                      }));
         
       plotMaster.setSelection(ranges, true);

    });
 
 
 
    $("#graph_section #masterContainer").bind("plotselected", function (event, ranges) {
        plotDetail.setSelection(ranges);
    });

}


function setupChart() {

	var yAxes = [];
	var temp = [];
	temp = getSignalSettings(w2ui.grid_sn.getSelection());


	for (var n = 0; n < temp.length; n++ ) {
		var oPlotSignal = {};
		var yAxis = {};
		var yAxis = { "position" : "right", "min": parseInt(temp[n].min), "max": parseInt(temp[n].max)};	
		yAxes.push(yAxis);				//create all y axes with settings
		oPlotSignal.label = temp[n].label;
		oPlotSignal.yaxis = temp[n].yaxis;
		oPlotSignal.data = [];
		data_plot.push(oPlotSignal);		
	}
	
	detailOptions.yaxes = yAxes			//set y axes in detail chart
}




function requestData(timer) {
	
	//if (data_request.length >=5) {
	//	timer=0; 
	//	return;
	//}

	if (chart.doGetSignals==true) {

			//requestSignals();
			
			
			//test signals from files
			if (list_no==20) {
				list_no = 0;
				//timer=0;
				//return;
			}
			list_no++;
			request_testSignals(list_no);		    
	} else {
		timer = 0;
		return;
	}
	setTimeout(requestData, timer);
}





