
var config_events = {
    layout: {
        name: 'layout_events',
        padding: 4,
        panels: [
            { type: 'main', minSize: 300 }
        ]
        
    },
    grid: { 
        name: 'grid_events',
        fixedBody : false,
        header: 'List of events',
        method: 'GET',
        show: { 
        	selectColumn: true, 
        	header: false,
        	footer: true,
        	toolbar: true,
        	toolbarSearch: false,
        	toolbarColumns: false,
        	toolbarReload: false
        },
	    toolbar: {
	        items: [
	            { type: 'button', id: 'btn_trigger', caption: 'Trigger event', img: 'icon-save' }
	        ],
	        onClick: function () {
	        	if(w2ui.grid_events.getSelection().length == 0) {
					alert("No event selected");
					return;
				}
				w2ui.grid_events.status('Triggering event...');
	        	triggerEvent(w2ui.grid_events.getSelection()[0]);

	        }
	    },       
		multiSelect: false,
        columns: [                
            { field: 'recid', caption: 'Name', size: '30%', sortable: true },
            { field: 'description', caption: 'Description', size: '70%', sortable: true },
        ],
    }
}
    



$(function () {
    // initialization in memory
    $().w2layout(config_events.layout);
    $().w2grid(config_events.grid);
});



function triggerEvent(selectedEvent) {
	
	$.ajaxSetup({ cache: false });	
	$.ajax({
		url: 'http://' + eeros.url + '/eeros/events',
		type: "PUT",
		crossDomain: true,
		contentType : 'application/json',
		data: JSON.stringify({ "event": selectedEvent}),
		dataType: 'json',
	    success: function(jsondata) {
	    	var state = "ok";
	    	if (jsondata.success==false) state = "failed" ;
			w2ui.grid_events.status('Triggering event...' + state);
		},
		error: function(){
			w2ui.grid_events.status('Triggering event...error'); 
		}
	});
}


function getListOfEvents() {
	
	if (!eeros.is_connected) return;
	w2ui['grid_events'].load('http://' + eeros.url + '/eeros/events/list');
	
    w2popup.open({
        title   : 'List of events',
        width   : 500,
        height  : 300,
        showMax : true,
        body    : '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('layout');
                w2ui.layout.content('main', w2ui.grid_events);
            };
        },
        onToggle: function (event) { 
            event.onComplete = function () {
                w2ui.layout.resize();
            }
        }
    });   
}





