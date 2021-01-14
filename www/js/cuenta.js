
	function cargar_datos() {
		$.post(url_api+'datos_cuenta',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
			var cuenta = jQuery.parseJSON(r);
			$(".cuenta_id_cliente").val(cuenta.id_cliente);
			$(".cuenta_lat").val(cuenta.lat);
			$(".cuenta_lon").val(cuenta.lon);
			$(".cuenta_nombre").val(cuenta.nombre);
			$(".cuenta_telefono").val(cuenta.telefono);
			$(".cuenta_correo").val(cuenta.correo);
			$(".cuenta_numero").val(cuenta.numero);
			$(".cuenta_colonia").val(cuenta.dir_colonia);
			$(".cuenta_calle").val(cuenta.dir_calle);
			$(".cuenta_num").val(cuenta.dir_numero1);
			$(".cuenta_num2").val(cuenta.dir_numero2);
			$(".cuenta_referencia").val(cuenta.referencia);

			$(".resumen_direccion").html(cuenta.dir_calle+", "+cuenta.dir_numero1+" "+cuenta.dir_numero2+", "+cuenta.dir_colonia);
			get_t();

			verificar_ubicacion();
		}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
	}
/***************************/
	$(document).on("click",".btn_alta_tarjeta",function(){
		$("#form_nueva_tarjeta :input").val("");
		$("#modal_alta_tarjeta").modal("show");
	})

	$(document).on("click",".btn_guardar_tarjeta",function(){
		$("#t_i_c").val(sesion_local.getItem("FerbisAPP_id"));
		var datos_t = $("#form_nueva_tarjeta :input").serialize();
		var datos_a = $("#form_nueva_tarjeta :input").serializeArray();
		if(datos_a[1].value.length<16||datos_a[2].value.length<2||datos_a[3].value.length<2||datos_a[4].value.length<3){
			alert_2("Datos de tarjeta incorrectos<br> por favor verifica la informacion");
		}else{
			$.post(url_api+'alta_tarjeta', datos_t , function(r) {
				$("#modal_alta_tarjeta").modal("hide");
				notificacion("Tarjeta registrada");
				get_t();
			}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
		}
	})

	function get_t(){
		$.post(url_api+'get_t', {id:sesion_local.getItem("FerbisAPP_id")}, function(r) {
			var trs = "";
			$.each(jQuery.parseJSON(r), function( i, ttt ) {
				trs+='<tr>'+
            			'<td>XXXX XXXX XXXX '+ttt.valor+'</td>'+
            			'<td class="borrar_ttt">'+
            				'<a id_opc3="'+ttt.id_opc3+'"><i class="fa fa-trash" aria-hidden="true"></i></a>'+
            			'</td>'+
          			'</tr>';
			})
			$(".tabla_ttt").html(trs);
		}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
	}
	$(document).on("click",".borrar_ttt",function(){
		var id_t = $(this).find("a").attr("id_opc3");
		confirm_2("¿ Esta seguro de que desea borrar esta tarjeta ?",function (){
			$.post(url_api+'baja_tarjeta', {id_t:id_t} , function(r) {
				notificacion("Tarjeta retirada");
				get_t();
			}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
		});
	})

/****************************/
	$(document).on("click",".panel_direccion",function(){
		$("#modal_direccion").modal({backdrop: 'static', keyboard: false});
	})

	$(document).on("click",".btn_guardar_direccion",function(){
		$(".resumen_direccion").html($(".cuenta_calle").val()+", "+$(".cuenta_num").val()+" "+$(".cuenta_num2").val()+", "+$(".cuenta_colonia").val());
		verificar_ubicacion();
	})

	


	function verificar_ubicacion(){
	if($(".cuenta_calle").val()!=""&&$(".cuenta_num").val()!=""&&$(".cuenta_colonia").val()!=""){
		var direccion=	$(".cuenta_calle").val()+", "+$(".cuenta_num").val()+", "+$(".cuenta_colonia").val()+", Mexicali, BC";
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': direccion}, function(results, status) {
			$(".cuenta_lat").val(results[0].geometry.location.lat);
			$(".cuenta_lon").val(results[0].geometry.location.lng);
			sucursal_cercana();
		});
	}
}
	function sucursal_cercana(){
		$.post(url_api+'sucursal_cercana',{lat:$(".cuenta_lat").val(),lon:$(".cuenta_lon").val()},function(r){
			var sucursal = jQuery.parseJSON(r);
			$(".sucursal_cercana").html(sucursal.sucursal);
			$(".sucursal_distancia").html(sucursal.distancia+"km");
		}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
	}

	function geolacalizar_direccion(){
		var direccion=	$(".cuenta_calle").val()+", "+
							$(".cuenta_num").val()+", "+
							$(".cuenta_colonia").val()+
							", Mexicali, BC";
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': direccion}, function(results, status) {
			$(".cuenta_lat").val(results[0].geometry.location.lat);
			$(".cuenta_lon").val(results[0].geometry.location.lng);
			sucursal_cercana();
			construir_mapa({lat: results[0].geometry.location.lat, lng: results[0].geometry.location.lng});
		});
	}

	function construir_mapa(myLatLng){
		var map = new google.maps.Map(document.getElementById('map_cuenta'), {
          zoom: 17,
          center: myLatLng
        });
        var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: myLatLng,
          map: map,
          icon: 'img/map_icon.png',
          title: 'Ferbis Brasil'
        });
        marker.addListener("dragend", function(e) { 
	    	$(".cuenta_lat").val(e.latLng.lat);
			$(".cuenta_lon").val(e.latLng.lng);
			sucursal_cercana();
	    }); 
	    map.addListener('click', function(e) {
			marker.setPosition(e.latLng);
			$(".cuenta_lat").val(e.latLng.lat);
			$(".cuenta_lon").val(e.latLng.lng);
			sucursal_cercana();
		});
	}

	$(document).ready(function() {
		$(document).on("click",".btn_guardar_cuenta",function(){
			$.post(url_api+'actualizar_cuenta',$("#form_datos_cuenta").serialize(),function(r){
				notificacion("Datos guardados con éxito");
			}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
		})
		$.post(url_api+'datos_cuenta',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
			var cuenta = jQuery.parseJSON(r);
			$(".cuenta_id_cliente").val(cuenta.id_cliente);
			$(".cuenta_lat").val(cuenta.lat);
			$(".cuenta_lon").val(cuenta.lon);
			$(".cuenta_nombre").val(cuenta.nombre);
			$(".cuenta_telefono").val(cuenta.telefono);
			$(".cuenta_correo").val(cuenta.correo);
			$(".cuenta_numero").val(cuenta.numero);
			$(".cuenta_colonia").val(cuenta.dir_colonia);
			$(".cuenta_calle").val(cuenta.dir_calle);
			$(".cuenta_num").val(cuenta.dir_numero1);
			$(".cuenta_num2").val(cuenta.dir_numero2);
			$(".cuenta_referencia").val(cuenta.referencia);
		}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
		$(document).on("click",".btn_mapa_cuenta",function(){
			$("#modal_mapa").modal("show").on('shown.bs.modal', function () {
  			//si existen las coordenadas no se hace geolocalizacion
			if($(".cuenta_lat").val()!=0&&$(".cuenta_lon").val()!=0){
				construir_mapa({lat: parseFloat($(".cuenta_lat").val()), lng: parseFloat($(".cuenta_lon").val())});
			}else{
				var direccion=	$(".cuenta_calle").val()+", "+
								$(".cuenta_num").val()+", "+
								$(".cuenta_colonia").val()+
								", Mexicali, BC";
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({ 'address': direccion}, function(results, status) {
					$(".cuenta_lat").val(results[0].geometry.location.lat);
					$(".cuenta_lon").val(results[0].geometry.location.lng);
					construir_mapa(results[0].geometry.location);
				});
			}
		});

			
		})

	});



	