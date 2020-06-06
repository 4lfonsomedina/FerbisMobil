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
				$("input:radio[name=servicio]").each(function(){if($(this).val()==cuenta.servicio){$(this).prop("checked", true);}});
				$("input:radio[name=pago]").each(function(){if($(this).val()==cuenta.pago){$(this).prop("checked", true);}});
				verificar_ubicacion();
				mostrar_tabla();
			})
		}

		function verificar_ubicacion(){
			var lat = parseFloat($(".cuenta_lat").val());
			var lon = parseFloat($(".cuenta_lon").val());
			if(lat!=""&&lon!=""){
				sucursal_cercana();
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
				$(".sucursal_distancia_input").val(sucursal.distancia);
				$(".pedido_id_sucursal").val(sucursal.id_sucursal);
				$(".pedido_sucursal").val(sucursal.sucursal);
			})
		}

		function mostrar_tabla(){
			if($('input:radio[name=servicio]:checked').val()==1){
				$(".tabla_cuenta_recoger").fadeOut(500);
				$(".tabla_cuenta").fadeIn(500);
				$(".contenedor_tipo_pago").show();
				$(".pedido_envio").show();
				verificar_ubicacion();
			}else{
				$(".tabla_cuenta").fadeOut(500);
				$(".tabla_cuenta_recoger").fadeIn(500);
				$(".contenedor_tipo_pago").hide();
				$(".pedido_envio").hide();
				$(".pedido_sucursal").val($(".tabla_cuenta_recoger").val());
			}
			//mostrar_tabla_pago();
		}
		$(".tabla_cuenta_recoger").change(function() {
			$(".pedido_sucursal").val($(this).val());
		});

		function mostrar_tabla_pago(){
			if($('input:radio[name=pago]:checked').val()==1){
				$(".tabla_pago").fadeIn(500);
			}else{
				$(".tabla_pago").fadeOut(500);
			}
		}

		function construir_mapa(myLatLng){
				$(".cuenta_lat").val(myLatLng.lat);
				$(".cuenta_lon").val(myLatLng.lng);
				sucursal_cercana();
				
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
		$(document).on("click",".btn_enviar_pedido",function(){
			/*
			validaciones:
			1 - Nunca debe de faltar el nombre ni el telefono
			2 - Si es a domicilio no falten colonia, calle, numero1
			*/
			// 1 - Nunca debe de faltar el nombre ni el telefono
			if($(".cuenta_nombre").val()==''){
				alert('Es necesario capturar su nombre');
				$(".li_paso2 > a").click();
				return;
			}
			if($(".cuenta_telefono").val()==''){
				alert('Es necesario capturar su telefono para comunicarnos con usted cuando su pedido este listo');
				$(".li_paso2 > a").click();
				return;
			}
			if($('input:radio[name=servicio]:checked').val()==1&&$(".cuenta_colonia").val()==''){
				alert('Es necesario capturar su colonia');
				$(".li_paso1 > a").click();
				return;
			}
			if($('input:radio[name=servicio]:checked').val()==1&&$(".cuenta_calle").val()==''){
				alert('Es necesario capturar la calle de su domicilio');
				$(".li_paso1 > a").click();
				return;
			}
			if($('input:radio[name=servicio]:checked').val()==1&&$(".cuenta_num").val()==''){
				alert('Es necesario capturar el numero de su domicilio');
				$(".li_paso1 > a").click();
				return;
			}
			$( ".btn_enviar_pedido" ).prop( "disabled", true );
			$.post(url_api+'alta_pedido',$("#pedido_form").serialize(),function(r){
				console.log(r);
				$('#modal_pedido_enviado').modal({backdrop: 'static', keyboard: false});
			})
			//console.log($("#pedido_form").serializeArray());
		})
		//envio finalizado
		$(document).on("click",".btn_aceptar",function(){
			closeBrowser();
		})

		$(document).on("click",".li_paso",function(){
			$(".btn_paso").hide();
			$(".btn_paso_"+$(this).attr('paso')).show();
			actualizar_paso3();
			mostrar_tabla();
		})
		$(document).on("click",".btn_paso",function(){
			$(".li_paso"+$(this).attr('paso')+" > a").click();
			actualizar_paso3();
			mostrar_tabla();
		})

		function actualizar_paso3(){
			var pedido = objectifyForm($("#pedido_form").serializeArray());
			$(".p3_nombre").html(pedido.nombre);
			$(".p3_telefono").html(pedido.telefono);
			$(".p3_frecuente").html(pedido.numero);
			var servicio = "A domicilio (+$30)"; if(pedido.servicio!=1){ servicio = "Paso por el"; }
			$(".p3_servicio").html(servicio);
			$(".p3_direccion").html(pedido.dir_calle+" "+pedido.dir_numero1+" "+pedido.dir_numero1+","+pedido.dir_colonia);
			$(".p3_referencia").html(pedido.referencia);
		}

		$.post(url_api+'get_carrito_activo',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
			var productos_carrito = jQuery.parseJSON(r);
			$('.pedido_articulos').html(productos_carrito.length);
			$('.pedido_articulos_input').val(productos_carrito.length);
			$(".pedido_id_carrito").val(productos_carrito[0].id_carrito);
			var total=0;
			$.each(productos_carrito, function( i, prod ) {
				total+=parseFloat(prod.cantidad)*parseFloat(prod.precio);
			});
			$('.pedido_total').html(parseFloat(total).toFixed(2));
			$('.pedido_total_input').val(parseFloat(total).toFixed(2));
			mostrar_tabla();
			$(".contenedor_resumen_pedido").html(string_carrito(r));
		});

		function objectifyForm(formArray) {//serialize data function
		  var returnArray = {};for (var i = 0; i < formArray.length; i++){returnArray[formArray[i]['name']] = formArray[i]['value'];}
		  return returnArray;
		}
		$(document).on("click",".pedido_radio",function(){mostrar_tabla();})
		

		mostrar_tabla();
		$(document).on("click",".pedido_radio",function(){mostrar_tabla();})
		
		
		


		function string_carrito(string_json){
			var string_ret="";
			$.each(jQuery.parseJSON(string_json), function( i, prod ) {
				var asado=""; if(prod.asado=='1'){ asado='<i class="fa fa-fire ico_asado" aria-hidden="true"></i>';}
				string_ret+="<div class='articulo_carrito' "+
								"id_carrito_det='"+prod.id_carrito_det+"' "+
								"producto='"+prod.producto+"' "+
								"cantidad='"+prod.cantidad+"' "+
								"asado='"+prod.asado+"' "+
								"descripcion='"+capitalize(prod.descripcion)+"' "+
								"unidad='"+prod.unidad+"' "+
								"detalles='"+prod.detalles+"' "+
								"precio='"+prod.precio+"' >"+
				  				"<div class='col-xs-2 car_cantidad'>"+parseFloat(prod.cantidad).toFixed(2)+"<br><b>"+prod.unidad+"</b></div>"+
				  				"<div class='col-xs-8 car_desc'>"+asado+" "+capitalize(prod.descripcion)+"</div>"+
				  				"<div class='col-xs-2 car_importe'>"+parseFloat(prod.cantidad*prod.precio).toFixed(2)+"</div>"+
				  				"</div>";
			});
		return string_ret;
		}
		

		$(document).on("click",".btn_mapa_cuenta",function(){
			$("#modal_mapa").modal("show");

			//si existen las coordenadas no se hace geolocalizacion

			if($(".cuenta_lat").val()!=0&&$(".cuenta_lon").val()!=0){
				construir_mapa({lat: parseFloat($(".cuenta_lat").val()), lng: parseFloat($(".cuenta_lon").val())});
			}else if($(".cuenta_calle").val()!=""&&$(".cuenta_num").val()!=""&&$(".cuenta_colonia").val()!=""){
				var direccion=	$(".cuenta_calle").val()+", "+
								$(".cuenta_num").val()+", "+
								$(".cuenta_colonia").val()+
								", Mexicali, BC";
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({ 'address': direccion}, function(results, status) {
					console.log(results[0]);
					$(".cuenta_lat").val(results[0].geometry.location.lat);
					$(".cuenta_lon").val(results[0].geometry.location.lng);
					construir_mapa(results[0].geometry.location);
				});
		}else{
			navigator.geolocation.getCurrentPosition(function(e){
				$(".cuenta_lat").val(e.coords.latitude);
				$(".cuenta_lon").val(e.coords.longitude);
				construir_mapa({lat: e.coords.latitude, lng: e.coords.longitude});
			}, function(e){
				geolacalizar_direccion();
			});
		}
		})
	});

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
	});
}