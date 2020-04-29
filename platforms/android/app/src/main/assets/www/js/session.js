



$(document).ready(function() {
	//sessionStorage.clear();
	function actualizar_session(session_id){
		$.post(url_api+"actualizar_session",{id:session_id},function(r){
			//actualizamos variables
			var cliente = jQuery.parseJSON(r)[0];
			sessionStorage.setItem("FerbisAPP_id",		cliente.id_cliente);
			sessionStorage.setItem("FerbisAPP_numero", 	cliente.numero);
			sessionStorage.setItem("FerbisAPP_nombre",	cliente.nombre);
			sessionStorage.setItem("FerbisAPP_telefono", cliente.telefono);
			sessionStorage.setItem("FerbisAPP_correo", 	cliente.correo);
			sessionStorage.setItem("FerbisAPP_dir_calle", cliente.dir_calle);
			sessionStorage.setItem("FerbisAPP_dir_numero1", cliente.dir_numero1);
			sessionStorage.setItem("FerbisAPP_dir_numero2", cliente.dir_numero2);
			sessionStorage.setItem("FerbisAPP_lat", cliente.lat);
			sessionStorage.setItem("FerbisAPP_lon", cliente.lon);

			actualizar_interfaz();
		});
	}

	//actualizamos interfaz
	function actualizar_interfaz(){
		$("#nombre_usuario").html(sessionStorage.getItem("FerbisAPP_nombre"));
	}
	//evitar que se pueda ocultar el modal de bienvenida
	//

	//verificar si el cliente esta dado de alta
	setTimeout(function(){
		if(sessionStorage.getItem("FerbisAPP_id")!=null){
		actualizar_session(sessionStorage.getItem("FerbisAPP_id"));
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
			alert("Es importante que contemos su nombre para saber con quien nos dirigimos.");
		}
	})
});