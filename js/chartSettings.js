
var config = {
    layout: {
        name: 'layout_chartSettings',
        padding: 4,
        panels: [
            { type: 'main', minSize: 300 }
        ]
        
    },    
    grid: {
        name: 'grid_chartSettings',    
        header: 'Parameters',
        show: { header: false, 
        		columnHeaders: false, 
        		toolbar: true,
	        	toolbarSearch: false,
	        	toolbarColumns: false,
	        	toolbarReload: false
   		}, 
	    toolbar: {
	        items: [
	            { type: 'button', id: 'btn_saveChartSettings', caption: 'Save settings', img: 'icon-save' },
	        	{ type: 'button', id: 'btn_reset', caption: 'Reset settings', img: 'icon-save' }
	        ],
	        onClick: function (target, data) {
	        	if (target == 'btn_saveChartSettings') {
	        		w2ui['grid_chartSettings'].save();
	            	localStorage.setItem("eeros_chartsettings", JSON.stringify(w2ui['grid_chartSettings'].records));
	            }
	        	if (target == 'btn_reset') {
	        		localStorage.removeItem("eeros_chartsettings");
	            	loadChartSettings();
	            }
	            
	        }
	    }, 
        columns: [
        	{ field: 'recid', caption: '', size: '0px' },                
            { field: 'name', caption: 'Name', size: '250px', style: 'background-color: #efefef; border-bottom: 1px solid white; padding-right: 5px;', attr: "align=right" },
            { field: 'value', caption: 'Value', size: '100%', editable: { type: 'double' } }
        ]
    }    
}


$(function () {
    // initialization in memory
    $().w2layout(config.layout);
    $().w2grid(config.grid);
});


function loadChartSettings(){
	var records = [];

	var obj = localStorage["eeros_chartsettings"];
	//if settings exist in local storage
	if (obj!=null){
		var o=JSON.parse(obj);
		for (m = 0; m < o.length; m++ ) {
			records .push(o[m]);
		}
	} else {
		//else set preset values
		records .push({ "recid" : "1", "name": "Data rate per second", "value": chart.data_rate});
		records .push({ "recid" : "2", "name": "Plotting rate per data", "value": chart.plot_buffer});
		records .push({ "recid" : "3", "name": "Range master chart (sec)", "value": chart.master_range});
		records .push({ "recid" : "4", "name": "Range detail chart (sec)", "value": chart.detail_range});
		records .push({ "recid" : "5", "name": "Refresh rate current level per second", "value": chart.level_rate});
		records .push({ "recid" : "6", "name": "Refresh rate log messages per second", "value": chart.logs_rate});
	}
	
	
	w2ui.grid_chartSettings.clear();
	w2ui.grid_chartSettings.add(records);
	w2ui.grid_chartSettings.hideColumn('recid');

}



function popupChartSettings() {

	if (!eeros.is_connected) return;
	loadChartSettings();
		
    w2popup.open({
        title   : 'Chart settings',
        width   : 500,
        height  : 300,
        showMax : true,
        body    : '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('layout_chartSettings');
                w2ui.layout_chartSettings.content('main', w2ui.grid_chartSettings);
            };
        },
        onToggle: function (event) { 
            event.onComplete = function () {
                w2ui.layout.resize();
            }
        }
    });
}