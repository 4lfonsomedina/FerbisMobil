var sesion_local = window.localStorage;



$(document).ready(function() {
	//sesion_local.clear();
	

	function actualizar_session(session_id){
		$.post(url_api+"actualizar_session",{id:session_id},function(r){
			//actualizamos variables
			if(jQuery.parseJSON(r).length>0){
				var cliente = jQuery.parseJSON(r)[0];
				sesion_local.setItem("FerbisAPP_id",		cliente.id_cliente);
				sesion_local.setItem("FerbisAPP_numero", 	cliente.numero);
				sesion_local.setItem("FerbisAPP_nombre",	cliente.nombre);
				sesion_local.setItem("FerbisAPP_telefono", cliente.telefono);
				sesion_local.setItem("FerbisAPP_correo", 	cliente.correo);
				sesion_local.setItem("FerbisAPP_dir_calle", cliente.dir_calle);
				sesion_local.setItem("FerbisAPP_dir_numero1", cliente.dir_numero1);
				sesion_local.setItem("FerbisAPP_dir_numero2", cliente.dir_numero2);
				sesion_local.setItem("FerbisAPP_lat", cliente.lat);
				sesion_local.setItem("FerbisAPP_lon", cliente.lon);
				sesion_local.setItem("link_banner", cliente.link_banner);
				actualizar_interfaz();
				try{verificacion_encuesta(cliente.id_cliente);}
				catch{}
			}else{
				$('#modal_bienvenida').modal({backdrop: 'static', keyboard: false});
			}
		});
	}
	//actualizamos interfaz
	function actualizar_interfaz(){
		$("#nombre_usuario").html(sesion_local.getItem("FerbisAPP_nombre"));
		if(sesion_local.getItem("link_banner")=='1'){
			 $("#link_banner").removeAttr('disabled');
		}
	}
	//evitar que se pueda ocultar el modal de bienvenida

	//verificar si el cliente esta dado de alta
	setTimeout(function(){
		if(sesion_local.getItem("FerbisAPP_id")!=null){
		actualizar_session(sesion_local.getItem("FerbisAPP_id"));
		}else{
			$('#modal_bienvenida').modal({backdrop: 'static', keyboard: false});
		}
	}, 2000);
	

	//Captura de nombre
	$(document).on("click",".btn_bienvenida",function(){
		if($(".modal_bienvenida_nombre").val()!=""){
			var temp_nombre = $(".modal_bienvenida_nombre").val();
			$(".modal_bienvenida_body").html(loader());
			$.post(url_api+"alta_cliente",{nombre:temp_nombre},function(r){
				var cliente = jQuery.parseJSON(r)[0];
				actualizar_session(cliente.id_cliente);
				$("#modal_bienvenida").modal("hide");
			})
		}else{
			alert_2("Es importante que contemos su nombre para saber con quien nos dirigimos.");
		}
	})
});




// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
  //Remove this method to stop OneSignal Debugging 
  window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});
  
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };
  // Set your iOS Settings
  var iosSettings = {};
  iosSettings["kOSSettingsKeyAutoPrompt"] = false;
  iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
  
  window.plugins.OneSignal
    .startInit("82e5a9a1-634d-4c23-8629-0524c9fc5379")
    .handleNotificationOpened(notificationOpenedCallback)
    .iOSSettings(iosSettings)
    .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
    .endInit();
  
  // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
  window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
    console.log("User accepted notifications: " + accepted);
  });
  
}, false);