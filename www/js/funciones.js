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
			if(r==0){
				$(".contenido_carrito").html("<div class='carrito_vacio'>Carrito vacío</div>");
			}else{
				console.log(string_carrito(r));
				$(".contenido_carrito").html(string_carrito(r));
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
		}else{
			notificacion("Error!");
		}
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
			string_ret+="<div class='articulo_carrito' "+
							"producto='"+prod.producto+"' "+
							"descripcion='"+prod.descripcion+"' "+
							"unidad='"+prod.unidad+"' "+
							"precio='"+prod.precio+"' >"+
			  				"<div class='col-xs-2 car_cantidad'>"+parseFloat(prod.cantidad).toFixed(2)+"<br><b>"+prod.unidad+"</b></div>"+
			  				"<div class='col-xs-8 car_desc'>"+prod.descripcion+"</div>"+
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
// loader global
function loader(){
		return '<div style="text-align:center;padding-top:100px;"><i class="fa fa-spinner fa-spin fa-5x fa-fw"></i><span class="sr-only"></span></div>';
	}