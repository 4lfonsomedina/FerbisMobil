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
		$("#producto_modal").val($(this).attr('producto'))
		$(".input_orden").val(1);
		$(".check_asado").prop('checked',false);
		$(".ord_detalles").val("");
		$("#agregarArticuloModal").modal("show");
	})
	
// Al precional el boton de mas producto
	$(document).on("click",".ord_mas",function(){
		$(".input_orden").val(parseInt($(".input_orden").val())+1);
	})
// Al precional el boton de menos producto
	$(document).on("click",".ord_menos",function(){
		if($(".input_orden").val()>0)
			$(".input_orden").val(parseInt($(".input_orden").val())-1);
	})
// Al precional el input de cantidad
	$(document).on("click",".input_orden",function(){
		$(this).select();
	})

// funcion con cadena para mostrar el loader en pantalla
	

//functiones para abrir menu lateral
	$(document).on("click","#abrir_menu_lateral",function(){
		$(".contenedor_menu_lateral_izq").show(300);
	})
	$(document).on("click","#abrir_menu_lateral_der",function(){
		$(".contenedor_menu_lateral_der").show(300);
	})
	$(document).on("click",".sombra_menu",function(){
		$(".contenedor_menu_lateral_izq").hide(300);
		$(".contenedor_menu_lateral_der").hide(300);
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


});//fin



function loader(){
		return '<div style="text-align:center;padding-top:100px;"><i class="fa fa-spinner fa-spin fa-5x fa-fw"></i><span class="sr-only"></span></div>';
	}