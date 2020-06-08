
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
			verificar_ubicacion();
		})
	}
	function verificar_ubicacion(){
		var lat = parseFloat($(".cuenta_lat").val());
		var lon = parseFloat($(".cuenta_lon").val());
		if(lat!=""&&lon!=""){
			sucursal_cercana();
			construir_mapa({lat: lat, lng: lon});
		}
		else if($(".cuenta_calle").val()!=""&&$(".cuenta_num").val()!=""&&$(".cuenta_colonia").val()!=""){
			geolacalizar_direccion();
		}else{
			navigator.geolocation.getCurrentPosition(function(e){
				$(".cuenta_lat").val(e.coords.latitude);
				$(".cuenta_lon").val(e.coords.longitude);
				construir_mapa({lat: e.coords.latitude, lng: e.coords.longitude});
			}, function(e){
				geolacalizar_direccion();
			});
		}
	}
	function sucursal_cercana(){
		$.post(url_api+'sucursal_cercana',{lat:$(".cuenta_lat").val(),lon:$(".cuenta_lon").val()},function(r){
			var sucursal = jQuery.parseJSON(r);
			$(".sucursal_cercana").html(sucursal.sucursal);
			$(".sucursal_distancia").html(sucursal.distancia+"km");
		})
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
				notificacion("Datos Guardados con exito!");
			})
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
		})
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