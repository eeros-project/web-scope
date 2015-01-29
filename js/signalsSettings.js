//var allSignals = [];

var config1 = {
    layout: {
        name: 'layout',
        padding: 4,
        panels: [
            { type: 'main', minSize: 300 }
        ]
        
    },
    grid: { 
        name: 'grid_signalSettings',
        show: { 
        	selectColumn: false, 
        	header: false,
        	toolbar: true,
        	toolbarSearch: false,
        	toolbarColumns: false,
        	toolbarReload: false
        },
	    toolbar: {
	        items: [
	            { type: 'button', id: 'btn_save', caption: 'Save settings', ico: 'icon-save' }
	        ],
	        onClick: function (target, data) {
	        	if (target == 'btn_save') { 
	        		w2ui['grid_signalSettings'].save();
	            	localStorage.setItem("eeros_signalsettings", JSON.stringify(w2ui['grid_signalSettings'].records));
	            }

	        }
	    },        
        columns: [               
            { field: 'recid', caption: 'Name', size: '30%', sortable: true },
            { field: 'unit', caption: 'Unit', size: '50px' },
            { field: 'min', caption: 'Y min', size: '80px',  editable: { type: 'int' } },
            { field: 'max', caption: 'Y max', size: '80px',  editable: { type: 'int' } },
            { field: 'trigvalue', caption: 'Trigger value', size: '120px',  editable: { type: 'double' } }
        ],
        
    }
}


$(function () {
    // initialization in memory
    $().w2layout(config1.layout);
    $().w2grid(config1.grid);
});



function popupSignalSettings(records) {
	
	if (!eeros.is_connected) return;
	//If settings exist in localstorage
	var obj = localStorage["eeros_signalsettings"];
	if (obj!=null){
		var o = JSON.parse(obj);
	
		for (n = 0; n < records.length; n++ ) {
			var signalName = records[n].recid;
	
			for (m = 0; m < o.length; m++ ) {
				if(o[m].recid==signalName){
					records[n].min = o[m].min;
					records[n].max = o[m].max;
					records[n].trigvalue = o[m].trigvalue;
				}
			}
		}
	} else {

		for (n = 0; n < records.length; n++ ) {
			records[n].min = 0;
			records[n].max = 10;
			records[n].tr_value = 10;
		}
	}


	w2ui.grid_signalSettings.clear();
	w2ui.grid_signalSettings.add(records);
	
    w2popup.open({
        title   : 'Signal settings',
        width   : 500,
        height  : 300,
        showMax : true,
        body    : '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('layout');
                w2ui.layout.content('main', w2ui.grid_signalSettings);
            };
        },
        onToggle: function (event) { 
            event.onComplete = function () {
                w2ui.layout.resize();
            }
        }
    });
}