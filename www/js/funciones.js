//variables genericas en todos los scripts posteriores a funciones.js
var url_api = "http://ferbis.com/domicilio/index.php/api_controller/";

$(document).ready(function() {

//variables de inicio para las funciones
	iniciar_app();


// funcion que se ejecuta al iniciar la aplicacion PRODUCTOS FERBIS
	function iniciar_app(){
		$("#contenedor_articulos").html(loader());
		$.post(url_api+'get_productos_dep',{dep:'007'}, function(resp_json){
			string_articulos(resp_json);
			actualizar_burbuja_carrito();
		});
	}

// Al precionar el departamento
	$(document).on("click",".img_dep",function(){
		$(".input_search").val("");
		$("#contenedor_articulos").html(loader());
		$.post(url_api+'get_productos_dep',{dep:$(this).attr('dep')}, function(resp_json){
			string_articulos(resp_json);
		});
	})

// Al escribir en el filtro buscador
	$(document).on("keyup",".input_search",function(){
		if($(this).val()==""){return;}
		$("#contenedor_articulos").html(loader());
		$.post(url_api+'get_productos_filtro',{desc:$(this).val()}, function(resp_json){
			string_articulos(resp_json);
		});
	})

// Al presionar un articulo
	$(document).on("click",".row_articulo",function(){
		$(".descripcion_modal").html($(this).attr('descripcion'));
		$(".unidad_modal").html($(this).attr('unidad'));
		$(".input_orden").val(1);
		$(".check_asado").prop('checked',false);
		$(".ord_detalles").val("");
		$(".check_asado_input").val(0);

		//datos fara formulario 
		$("#producto_modal_form").val($(this).attr('producto'));
		$("#unidad_modal_form").val($(this).attr('unidad'));
		$("#precio_modal_form").val($(this).attr('precio'));
		$("#cliente_modal_form").val(sesion_local.getItem("FerbisAPP_id"));
		$("#descripcion_modal_form").val($(this).attr('descripcion'));
		$("#agregarArticuloModal").modal("show");
	})
	$(document).on('click',".check_asado",function(){
		if($(this).is(":checked")){$(".check_asado_input").val(1);}
		else{$(".check_asado_input").val(0);}
	})
	
// Al precional el boton de mas producto
	$(document).on("click",".ord_mas",function(){
		$(".input_orden").val(parseInt($(".input_orden").val())+1);
	})
// Al precional el boton de menos producto
	$(document).on("click",".ord_menos",function(){
		if($(".input_orden").val()>1)
			$(".input_orden").val(parseInt($(".input_orden").val())-1);
	})
// Al precional el input de cantidad
	$(document).on("click",".input_orden",function(){
		$(this).select();
	})

//functiones para abrir menu lateral
	$(document).on("click","#abrir_menu_lateral",function(){
		$(".contenedor_menu_lateral_izq").show(300);
	})
	$(document).on("click","#abrir_menu_lateral_der",function(){
		$(".contenedor_menu_lateral_der").show(300);
		$(".contenido_carrito").html(loader());
		$.post(url_api+'get_carrito_activo',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
			if(jQuery.parseJSON(r).length==0){
				$(".contenido_carrito").html("<div class='carrito_vacio'>Carrito vacío</div>");
			}else{
				$(".cant_carrito").html(jQuery.parseJSON(r).length);
				$(".contenido_carrito").html(string_carrito(r));
				var total_aprox=0;
				$(".car_importe").each(function() {total_aprox+=parseFloat($(this).html());});
				$(".total_pedido").html(parseFloat(total_aprox).toFixed(2));
			}
		})
	})
	$(document).on("click",".sombra_menu",function(){
		$(".contenedor_menu_lateral_izq").hide(300);
		$(".contenedor_menu_lateral_der").hide(300);
	})

//funcion alta de producto al carrito
$(document).on("click",".agregar_al_carrito_btn",function(){
	$("#agregarArticuloModal").modal("hide");
	$.post(url_api+'agregar_producto_pedido_activo',$("#form_alta_carrito").serialize(),function(r){
		if(r>0){
			notificacion("Producto agregado a su carrito!");
			actualizar_burbuja_carrito();
		}else{
			notificacion("Error!");
		}
	})
})

//funcion para abrir modal de edicion deun pedido
$(document).on("click",".articulo_carrito",function(){
	$(".descripcion_modal_e").html($(this).attr('descripcion'));
	$(".unidad_modal_e").html($(this).attr('unidad'));
	$(".input_orden").val(parseFloat($(this).attr('cantidad')).toFixed(2));
	$(".check_asado").prop('checked',false);
	if($(this).attr('asado')=='1'){$(".check_asado").prop('checked',true);}
	$(".ord_detalles").val($(this).attr('detalles'));
	$(".check_asado_input").val($(this).attr('asado'));

	//datos fara formulario 
	$("#producto_carrito_modal_form_e").val($(this).attr('id_carrito_det'));
	$("#producto_modal_form_e").val($(this).attr('producto'));
	$("#unidad_modal_form_e").val($(this).attr('unidad'));
	$("#precio_modal_form_e").val($(this).attr('precio'));
	$("#cliente_modal_form_e").val(sesion_local.getItem("FerbisAPP_id"));
	$("#descripcion_modal_form_e").val($(this).attr('descripcion'));
	$(".contenedor_menu_lateral_der").hide(300);
	$("#editarArticuloModal").modal("show");
})



//funcion para eliminar producto del carrito
$(document).on("click",".btn_modal_borrar_e", function(){
	if(confirm("Esta seguro de que desea remover el articulo del carrito?")){
		var id_carrito_det=$("#producto_carrito_modal_form_e").val();
		$("#editarArticuloModal").modal("hide");
		$.post(url_api+'remover_carrito',{id_carrito_det:id_carrito_det},function(r){
			actualizar_burbuja_carrito();
			notificacion("Articulo removido del carrito");
		})
	}
})

//funcion para guardar cambios de la edicion del pedido
$(document).on("click",".btn_modal_guardar_e", function(){
	$("#editarArticuloModal").modal("hide");
	$.post(url_api+'editar_carrito',$("#form_editar_carrito").serialize(),function(r){
		notificacion("Articulo del pedido actualizado");
	})
})

// Funcion para mostrar los articulos de la busqueda
	function string_articulos(string_json){
		var string_ret="";
		$.each(jQuery.parseJSON(string_json), function( i, prod ) {
			
			string_ret+="<div class='row row_articulo' "+
							"producto='"+prod.producto+"' "+
							"descripcion='"+prod.descripcion+"' "+
							"unidad='"+prod.unidad+"' "+
							"precio='"+prod.precio+"' "+
							">"+
			  				"<div class='col-xs-12 articulo'><div class='col-xs-2'>"+
			  				"<div class='art_img'><img src='img/no_image.png' class='img_art'></div>"+
			  				"</div><div class='col-xs-10'>"+
			  				"<div class='col-xs-12'><div class='art_desc'>"+prod.descripcion+"</div></div>"+
			  				"<div class='col-xs-6'><div class='art_um'>"+prod.unidad+"</div></div>"+
			  				"<div class='col-xs-6'><div class='art_prec'>$"+parseFloat(prod.precio).toFixed(2)+"</div></div>"+
			  				"</div></div></div>";
		});
		//agregamos al contenedor
		$("#contenedor_articulos").hide();
		$("#contenedor_articulos").html(string_ret);
		$("#contenedor_articulos").slideDown(1000);
	}

	function string_carrito(string_json){
		var string_ret="";
		$.each(jQuery.parseJSON(string_json), function( i, prod ) {
			var asado=""; if(prod.asado=='1'){ asado='<i class="fa fa-fire ico_asado" aria-hidden="true"></i>';}
			string_ret+="<div class='articulo_carrito' "+
							"id_carrito_det='"+prod.id_carrito_det+"' "+
							"producto='"+prod.producto+"' "+
							"cantidad='"+prod.cantidad+"' "+
							"asado='"+prod.asado+"' "+
							"descripcion='"+prod.descripcion+"' "+
							"unidad='"+prod.unidad+"' "+
							"detalles='"+prod.detalles+"' "+
							"precio='"+prod.precio+"' >"+
			  				"<div class='col-xs-2 car_cantidad'>"+parseFloat(prod.cantidad).toFixed(2)+"<br><b>"+prod.unidad+"</b></div>"+
			  				"<div class='col-xs-8 car_desc'>"+asado+" "+prod.descripcion+"</div>"+
			  				"<div class='col-xs-2 car_importe'>"+parseFloat(prod.cantidad*prod.precio).toFixed(2)+"</div>"+
			  				"</div>";
		});
		return string_ret;
	}

});//fin

// alerta global
function notificacion(mensaje){
	$(".alerta_multiusos").html(mensaje);
	$(".alerta_multiusos").show(100);
	setTimeout(function() {$(".alerta_multiusos").hide(100);}, 3000);
}

//funcion que actualiza la cantidad de productos en el carrito de compras
function actualizar_burbuja_carrito(){
	$.post(url_api+'get_carrito_activo',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
		var productos_carrito = jQuery.parseJSON(r).length;
		if(productos_carrito>0){
			$(".mini_burbuja").html(productos_carrito);
			$(".mini_burbuja").show(100);
		}else{
			$(".mini_burbuja").hide(100);
		}
	})
}


// loader global
function loader(){
		return '<div style="text-align:center;padding-top:100px;"><i class="fa fa-spinner fa-spin fa-5x fa-fw"></i><span class="sr-only"></span></div>';
	}