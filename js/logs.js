//var logsColor=["#FF0000", "#FF00FF", "#FFB6FF", "#FFFF00", "#00FF00", "#00FFFF", "#00BBFF", "#DADADA"]	//rot, pink, orange, gelb, grün, türkis, blau, grau

var Logs = {doGetLogs : true, data : []};		//doGetLogs: start/stop log messages

$(function() {
   $('#grid_log').w2grid({ 
        name: 'grid_logMessages', 
        show: { 
        	header: true,
        	toolbar: true,
        	toolbarSearch: false,
        	toolbarColumns: false,
        	toolbarReload: false
        },
	    toolbar: {
	        items: [
	        	{ type: 'button', id: 'btn_getLogs', caption: 'Get logs', img: 'pics/wrench-2x', hint: '' },
	            { type: 'button', id: 'btn_stopLogs', caption: 'Stop logs', img: 'pics/wrench-2x', hint: '' },
	            { type: 'button', id: 'btn_clearLogs', caption: 'Clear logs', img: 'pics/wrench-2x', hint: '' }
	        ],
	        onClick: function (target, data) {
	        	if (target == 'btn_getLogs') { Logs.doGetLogs = true; currentLogs(); }
	        	if (target == 'btn_stopLogs') Logs.doGetLogs = false;
	        	if (target == 'btn_clearLogs') {
	        		Logs.data = []; 
	        		w2ui['grid_logMessages'].clear();
	        		w2ui['grid_logMessages'].refresh;
	        	}
	        }
	    },                  
        fixedBody : true,
        header: 'Log messages',
        method: 'GET',    
		multiSelect: true,
	
        columns: [               
            { field: 'timestamp', caption: 'Timestamp', size: '15%', sortable: false },
            { field: 'cat', caption: 'Cat', size: '5%'},
            { field: 'sev', caption: 'Sev', size: '0px'},
            { field: 'message', caption: 'Text', size: '80%' }      
        ]
    });
	w2ui['grid_logMessages'].hideColumn('sev');
});


function getLogs() {

    $.ajaxSetup({ cache: false });
	$.ajax({
		url: 'http://' + eeros.url + '/eeros/logs',
		type: "GET",
		crossDomain: true,
	    success: function(jsondata) {    
	    	Logs.data = Logs.data.concat(jsondata.records);
	    	if (Logs.data.length > 100) Logs.data.splice(0, Logs.data.length - 100);
			w2ui['grid_logMessages'].clear()
	    	w2ui['grid_logMessages'].add(Logs.data);
		    w2ui['grid_logMessages'].hideColumn('sev');
		    w2ui['grid_logMessages'].sort('timestamp', 'desc');
	    	w2ui['grid_logMessages'].refresh;
 		}
	});
}


function get_test_Logs() {

    $.ajaxSetup({ cache: false });
	$.ajax({
		url: 'http://' + eeros.url + '/eeros/test/logs',
		type: "GET",
		crossDomain: true,
	    success: function(jsondata) {
			for (m = 0; m < jsondata.records.length; m++ ) {
				var t_current = new Date(parseFloat(jsondata.records[m]['timestamp'])*1000);
		        var h = t_current.getHours();
		        var m = t_current.getMinutes();

		        var sec = t_current.getSeconds();
		        var ms = t_current.getMilliseconds();
				//jsondata.records[m]['timestamp'] = "1"; //t_current;
			}

	    	Logs.data = Logs.data.concat(jsondata.records);
	    	if (Logs.data.length > 100) Logs.data.splice(0, Logs.data.length - 100);
			w2ui['grid_logMessages'].clear()
	    	w2ui['grid_logMessages'].add(Logs.data);
		    w2ui['grid_logMessages'].hideColumn('sev');
		    w2ui['grid_logMessages'].sort('timestamp', 'desc');
	    	w2ui['grid_logMessages'].refresh;
 		}
	});
}

