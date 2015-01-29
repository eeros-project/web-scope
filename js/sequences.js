
var config3 = {
    layout: {
        name: 'layout2',
        padding: 4,
        panels: [
        	{ type: 'left', size: '50%', resizable: true, minSize: 300 },
            { type: 'main', minSize: 300 }
        ]
        
    },
    
    grid1: { 
        name: 'grid_seq',
        fixedBody : false,
        header: 'List of sequences',
        method: 'GET',
        show: { 
        	header: true
        },
      
		multiSelect: false,
        columns: [                
            { field: 'recid', caption: 'Name', size: '30%', sortable: true },
            { field: 'description', caption: 'Description', size: '70%', sortable: true },
            { field: 'param', caption: 'Param', size: '0%' }
        ],
        onClick: function (event) {

            var record = this.get(event.recid);
            var arrayParam = [];
            var objParam = {};
            w2ui.grid2.clear();		//Grid Parameter
            if (record.param !== undefined){
				for (var n = 0; n < record.param.length; n++ ) {
					objParam = { "recid" : record.param[n][1], "value": "", "paramtype": record.param[n][0]  };
					arrayParam.push(objParam);
				}
			}
			w2ui.grid2.add(arrayParam);
        }        
        
    },
    

    grid2: {
        header: 'Parameters',
        show: { header: true, 
        		columnHeaders: false, 
        		footer: true,
        		toolbar: true,
	        	toolbarSearch: false,
	        	toolbarColumns: false,
	        	toolbarReload: false
   		},
        name: 'grid2', 
	    toolbar: {
	        items: [
	            { type: 'button', id: 'btn_startseq', caption: 'Start sequence', icon: 'fa-wrench' }       
	        ],
	        onClick: function () {
	        	if(w2ui.grid_seq.getSelection().length == 0) {
					alert("No sequence selected");
					return;
				}
				w2ui.grid2.save();
		     	if (isEnabled(w2ui.grid2, w2ui.grid2.records.length, 1)==true) {
		     		w2ui.grid2.status('Starting sequence...');
					startSequence(w2ui.grid2, w2ui.grid_seq.getSelection());
				} else {
					w2ui.grid2.status('Missing parameter values.');
				}
	        }
	    }, 
        columns: [                
            { field: 'recid', caption: 'Name', size: '80px', style: 'background-color: #efefef; border-bottom: 1px solid white; padding-right: 5px;', attr: "align=right" },
            { field: 'value', caption: 'Value', size: '40%', editable: { type: 'text'} }
        ]
     	    
    } 
 
}
    



$(function () {
    // initialization in memory
    $().w2layout(config3.layout);
    $().w2grid(config3.grid1);
    $().w2grid(config3.grid2);
});



function startSequence(objGrid, seqName) {
	
	var records = objGrid.records;
	var arrayParams = [];
	
	for (var n = 0; n < records.length; n++ ) {
		arrayParams.push( records[n].value );
	}

	$.ajaxSetup({ cache: false });	
	$.ajax({
		url: 'http://' + eeros.url + '/eeros/sequences',
		type: "PUT",
		crossDomain: true,
		contentType : 'application/json',
		data: JSON.stringify({ "seqName": seqName[0] , "params" : arrayParams }),
		dataType: 'json',
	    success: function(jsondata) {
	    	var state = "ok";
	    	if (jsondata.success==false) state = "failed" ;
			w2ui.grid2.status('Starting sequence...' + state);
		},
		error: function(){
			w2ui.grid2.status('Starting sequence...error'); 
		} 
	});
}



function getListOfSequences() {

	if (!eeros.is_connected) return;
	w2ui['grid_seq'].load('http://' + eeros.url + '/eeros/sequences/list');
	
    w2popup.open({
        title   : 'List of sequences',
        width   : 800,
        height  : 300,
        showMax : true,
        body    : '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('layout2');
                w2ui.layout2.content('left', w2ui.grid_seq);
                w2ui.layout2.content('main', w2ui.grid2);
				w2ui['grid_seq'].hideColumn('param');
				w2ui['grid_seq'].SelectNone();
				w2ui.grid2.clear();
            };
        },
        onToggle: function (event) { 
            event.onComplete = function () {
                w2ui.layout.resize();
            }
        }
    });   
}


function isEnabled(objGrid, count, colindex) {
	
	var enabled = true;

	for (n = 0; n < count; n++ ) {
		var v = objGrid.getCellValue(n, colindex);
		enabled  = (v !="");
		if (enabled==false) return;
	}
	return enabled;
}


