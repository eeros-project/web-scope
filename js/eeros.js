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
        fields: [ { name: 'url', type: 'text', html: { caption: 'EEROS URL', attr: 'size="40" maxlength="40"' } },
				  { name: 'username', type: 'text', html: { caption: 'Username', attr: 'size="20" maxlength="40"' } },
				  { name: 'password', type: 'password', html: { caption: 'Password', attr: 'size="20" maxlength="40"' } }
				],
        actions: {
            Connect: function (target, data) {
            	var url = document.getElementById("url").value;
				if (url.length == 0) return;
				var username = document.getElementById("username").value;
				var password = document.getElementById("password").value;
				$.ajaxSetup({ cache: false });	
	
				$.ajax({
					url: 'http://' + url + '/connection/' + username + "," + password,			//Test LogIn, muss verschlüsselt werden
					type: "GET",
					crossDomain: true,
					dataType: 'json',					
					success: function(jsondata) {
						if (jsondata.login==false) { 
							alert("Login failed!");
							return;
						}

						sessionStorage.eerosUrl= url;
						sessionStorage.robotname= jsondata.robotname;
						eeros.robotname = jsondata.robotname;
						eeros.url = url;
						eeros.is_connected = true;
						w2popup.close();
						location.reload();
					},
					error: function(){
						alert("Could not connect to '" + url+ "'");
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

function conn(url, username) {

}

function popupConnect() {
	
    w2popup.open({
        title   : 'Connect to Eeros',
        width   : 500,
        height  : 250,
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

