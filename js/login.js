function Eeros () {
    this.url = "";
    this.robotname = "";
    this.user = "";
    this.is_connected = false;
};


var config_conn = {
    layout: {
        name: 'layout_conn',
        padding: 4,
        panels: [
            { type: 'main', minSize: 300 }
        ]
    },
    form: { 
        name: 'form',
        fields: [ { name: 'url', type: 'text', html: { caption: 'EEROS URL', attr: 'size="40" maxlength="40"' } }],
        actions: {
            Connect: function (target, data) {
            	var eerosUrl = document.getElementById("url");
            	
				$.ajaxSetup({ cache: false });	
					
			    $.ajax({
					url: 'http://' + eerosUrl.value + '/connection',
					crossDomain: true,
    				type: "GET",
				    //xhrFields: {
				    //    withCredentials: true
				    //},					
					success: function(jsondata) {
						sessionStorage.eerosUrl= eerosUrl.value;
	    				sessionStorage.robotname= jsondata.robotname;
						eeros.robotname = jsondata.robotname;
						eeros.ip = eerosUrl.value;
						eeros.is_connected = true;
						w2popup.close();
						location.reload();
					},
					error: function(){
						alert("Could not connect to '" + eerosUrl.value + "'");
						return; 
					} 

			       
				});

            	
            }
        }
    }
}

$(function () {
    // initialization
    $('#main').w2layout(config_conn.layout);
    w2ui.layout_conn.content('main', $().w2form(config_conn.form));
});

function popupConnect() {
	
    w2popup.open({
        title   : 'Connect to Eeros',
        width   : 500,
        height  : 200,
        showMax : true,
        body    : '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('layout_conn');
               // w2ui.layout.content('main', w2ui.grid_signalSettings);
            };
        },
        onToggle: function (event) { 
            event.onComplete = function () {
                w2ui.layout_conn.resize();
            }
        }
    });
}

