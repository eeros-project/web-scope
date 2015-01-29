
function loadLogs() {

   $('#grid_log').w2grid({ 
        name: 'grid_log', 
        show: { 
        	header: true,
        	toolbar: true,
        	toolbarSearch: false,
        	toolbarColumns: false,
        	toolbarReload: false
        },
	    toolbar: {
	        items: [
	            { type: 'button', id: 'btnSeveritySettings', caption: 'Severity settings', img: 'pics/wrench-2x', hint: '' }
	        ],
	        onClick: function (target, data) {
	        	if (target == 'btnSeveritySettings') popupSeveritySettings(w2ui['grid_sn'].records);
	        }
	    },                  
        fixedBody : true,
        header: 'Log messages',
        method: 'GET',    
		multiSelect: true,
	
        columns: [               
            { field: 'time', caption: 'Timestamp', size: '15%', sortable: true },
            { field: 'sev', caption: 'Cat', size: '5%', sortable: true },
            { field: 'text', caption: 'Text', size: '80%' }      
        ]
    });
}