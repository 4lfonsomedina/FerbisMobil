//variables genericas en todos los scripts posteriores a funciones.js
var url_api = "https://sd.ferbis.com/index.php/api_controller/";

$(document).ready(function() {

//variables de inicio para las funciones
	iniciar_app();


// funcion que se ejecuta al iniciar la aplicacion PRODUCTOS FERBIS
	function iniciar_app(){
		actualizar_burbuja_carrito();
		actualizar_burbuja_notificaciones();
		/*
		$.post('contenido/banner.html', function(resp_json){
			$("#contenedor_articulos").html(resp_json);
		})
		/*
		$("#contenedor_articulos").html(loader());
		$.post(url_api+'get_productos_dep',{dep:'007'}, function(resp_json){
			string_articulos(resp_json);
			actualizar_burbuja_carrito();
			actualizar_burbuja_notificaciones();
		});
		*/
	}

// Al precionar el departamento
	$(document).on("click",".img_dep",function(){
		var temp_dep=$(this).attr('dep');
		if(temp_dep==0){regresar_inicio(); return;}
		$("#contenedor_articulos").fadeOut(500,"swing",function(){
			$("#contenedor_articulos").load('contenido/subbanner.html');
		$.post(url_api+'get_subdepartamentos',{dep:temp_dep}, function(r){
			var subdeps = "";
			$.each(jQuery.parseJSON(r), function( i, subdep ) {
				subdeps+="<div class='col-xs-4 img_subdep' subdep='"+subdep.id_subdepartamento+"'><img src='img/"+subdep.id_departamento+subdep.id_subdepartamento+".png' width='100%'></div>";
			})
			$("#contenedor_articulos").slideDown(500);
			$(".banner_dep").attr('src','img/banner'+temp_dep+'.png');
			$(".contenedor_subdepartamentos").html(subdeps);
			$(".img_dep").attr('dep',temp_dep);
			$(".ver_todo_link").attr('dep',temp_dep);
			crecer_buscador();
		})
		});
		/*
		$(".input_search").val("");
		var dep = $(this).attr('dep');
		$("#contenedor_articulos").fadeOut(500,"swing",function(){	
			$.post(url_api+'get_productos_dep',{dep:dep}, function(resp_json){
				string_articulos(resp_json);
				reducir_buscador();
			});
		})
		*/
	})

	$(document).on("click",".img_subdep",function(){
		$(".input_search").val("");
		var subdep = $(this).attr('subdep');
		$("#contenedor_articulos").fadeOut(500,"swing",function(){	
			$.post(url_api+'get_productos_subdep',{subdep:subdep}, function(resp_json){
				string_articulos(resp_json);
				reducir_buscador();
			});
		})
	})

	$(document).on("click",".ver_todo_link",function(){
		$(".input_search").val("");
		var dep = $(this).attr('dep');
		$("#contenedor_articulos").fadeOut(500,"swing",function(){	
			$.post(url_api+'get_productos_dep',{dep:dep}, function(resp_json){
				string_articulos(resp_json);
				reducir_buscador();
			});
		})
	})

	$(document).on("click",".regresar_link",function(){
		regresar_inicio();
	})

// Al escribir en el filtro buscador
	$(document).on("keyup",".input_search",function(){
		if($(this).val()==""){return;}
		$("#contenedor_articulos").html(loader());
		$.post(url_api+'get_productos_filtro',{desc:$(this).val()}, function(resp_json){
			reducir_buscador();
			string_articulos(resp_json);
			$(".img_dep").attr('dep',0);
		});
	})

// Al presionar un articulo
	$(document).on("click",".row_articulo",function(){
		$("#agregarArticuloModal").modal("show");
		$(".descripcion_modal").html($(this).attr('descripcion'));
		$(".unidad_modal").html($(this).attr('unidad'));

		//transicion de imagen
		$(".img_modal_loader").html(loader_mini());
		$(".img_modal_loader").show();
		$(".img_prod_modal").hide();
		$(".img_prod_modal").attr('src',$(this).attr('imagen'));
		setTimeout(function() {$(".img_modal_loader").hide();$(".img_prod_modal").show();},1500)
		
		$(".input_orden").val(1);
		$(".check_asado").prop('checked',false);
		$(".ord_detalles").val("");
		$(".check_asado_input").val(0);

		//datos fara formulario 
		$("#producto_modal_form").val($(this).attr('producto'));
		$("#departamento_modal_form").val($(this).attr('departamento'));
		$("#unidad_modal_form").val($(this).attr('unidad'));
		$("#precio_modal_form").val($(this).attr('precio'));
		$("#cliente_modal_form").val(sesion_local.getItem("FerbisAPP_id"));
		$("#descripcion_modal_form").val($(this).attr('descripcion'));

		

		//ocultar o mostrar servicio de asado
		if($(this).attr('departamento')=='002'||$(this).attr('departamento')=='005'){
			$(".row_asado").show();
		}else{
			$(".row_asado").hide();
		}
	})
	// al pesionar el texto del servicio_asado
	$(document).on("click",".servicio_asado",function(){
		$(this).parent('div').find('.div_check_asado').find('input').click();
	})
	//actualizacion de input de asado
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
			$(".cant_carrito").html(jQuery.parseJSON(r).length);
			if(r==0){
				$(".contenido_carrito").html("<div class='carrito_vacio'>Carrito vacío</div>");
				$(".div_procesar_pedido").hide();
			}else{	
				$(".div_procesar_pedido").show();
				$(".contenido_carrito").html(string_carrito(r));
			}
			var total_aprox=0;
			$(".car_importe").each(function() {total_aprox+=parseFloat($(this).html());});
			$(".total_pedido").html(parseFloat(total_aprox).toFixed(2));
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
			actualizar_burbuja_notificaciones();
		}else{
			notificacion("Error!");
		}
	})
})

//funcion para abrir modal de edicion deun pedido
$(document).on("click",".articulo_carrito",function(){
	$("#editarArticuloModal").modal("show");

	//transicion de imagen
	$(".img_modal_loader_e").html(loader_mini());
	$(".img_modal_loader_e").show();
	$(".img_prod_modal_e").hide();
	$(".img_prod_modal_e").attr('src',$(this).attr('imagen'));
	setTimeout(function() {$(".img_modal_loader_e").hide();$(".img_prod_modal_e").show();},1500)

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
	$("#departamento_modal_form_e").val($(this).attr('departamento'));
	$("#unidad_modal_form_e").val($(this).attr('unidad'));
	$("#precio_modal_form_e").val($(this).attr('precio'));
	$("#cliente_modal_form_e").val(sesion_local.getItem("FerbisAPP_id"));
	$("#descripcion_modal_form_e").val($(this).attr('descripcion'));
	$(".contenedor_menu_lateral_der").hide(300);
	

	//ocultar o mostrar servicio de asado
	if($(this).attr('departamento')=='002'||$(this).attr('departamento')=='005'){
		$(".row_asado").show();
	}else{
		$(".row_asado").hide();
	}
})



//funcion para eliminar producto del carrito
$(document).on("click",".btn_modal_borrar_e", function(){
	if(confirm("Esta seguro de que desea remover el articulo del carrito?")){
		var id_carrito_det=$("#producto_carrito_modal_form_e").val();
		$("#editarArticuloModal").modal("hide");
		$.post(url_api+'remover_carrito',{id_carrito_det:id_carrito_det},function(r){
			actualizar_burbuja_carrito();
			actualizar_burbuja_notificaciones();
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
			// se utiliza puntuacion para la imagen
			string_ret+="<div class='row row_articulo' "+
							"producto='"+prod.producto+"' "+
							"departamento='"+prod.departamento+"' "+
							"descripcion='"+capitalize(prod.descripcion)+"' "+
							"unidad='"+prod.unidad+"' "+
							"imagen='"+prod.puntuacion+"' "+
							"precio='"+prod.precio+"' "+
							">"+
			  				"<div class='col-xs-12 articulo'><div class='col-xs-5 cont_imagen_articulo'>"+
			  				"<div class='art_img'><img src='"+prod.puntuacion+"' class='img_art'></div>"+
			  				"<div class='loader_img'>"+loader_mini()+"</div>"+
			  				"</div><div class='col-xs-7 articulo_desc'>"+
			  				"<div class='col-xs-12'><div class='art_desc'>"+capitalize(prod.descripcion)+"</div></div>"+
			  				"<div class='col-xs-12'><div class='art_um'>$"+parseFloat(prod.precio).toFixed(2)+" "+prod.unidad+"</div></div>"+
			  				"<div class='col-xs-7'><button class='btn btn-default btn-sm btn_agragar'>Agregar</button></div>"+
			  				"</div></div></div>";
		});
		//agregamos al contenedor
		$("#contenedor_articulos").hide();
		$("#contenedor_articulos").html(string_ret);
		$("#contenedor_articulos").slideDown(500);

		$(".art_img").hide();setTimeout(function() {

			$(".loader_img").each(function(index, el) {

				setTimeout(function() {
					$(el).hide();
					$(el).parent("div").find(".art_img").show();
				},150*index);

			});

		}, 2000);
	}
	function string_carrito(string_json){
		var string_ret="";
		$.each(jQuery.parseJSON(string_json), function( i, prod ) {
			// se utiliza puntuacion para la imagen
			var asado=""; if(prod.asado=='1'){ asado='<i class="fa fa-fire ico_asado" aria-hidden="true"></i>';}
			string_ret+="<div class='articulo_carrito' "+
							"id_carrito_det='"+prod.id_carrito_det+"' "+
							"producto='"+prod.producto+"' "+
							"departamento='"+prod.departamento+"' "+
							"cantidad='"+prod.cantidad+"' "+
							"asado='"+prod.asado+"' "+
							"descripcion='"+capitalize(prod.descripcion)+"' "+
							"unidad='"+prod.unidad+"' "+
							"detalles='"+prod.detalles+"' "+
							"imagen='"+prod.puntuacion+"' "+
							"precio='"+prod.precio+"' >"+
			  				"<div class='col-xs-2 car_cantidad'>"+parseFloat(prod.cantidad).toFixed(2)+"<br><b>"+prod.unidad+"</b></div>"+
			  				"<div class='col-xs-8 car_desc'>"+asado+" "+capitalize(prod.descripcion)+"</div>"+
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

//funcion que actualiza la burbuja de notificaciones
function actualizar_burbuja_notificaciones(){
	$.post(url_api+'get_num_notificaciones',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
		if(parseInt(r)>0){
			$(".mini_burbuja_notificaciones").html(r);
			$(".mini_burbuja_notificaciones").show(100);
		}else{
			$(".mini_burbuja_notificaciones").hide(100);
		}
	})
}

// loader global
function loader(){
		return '<div style="text-align:center;padding-top:100px;color:gray;"><i class="fa fa-spinner fa-spin fa-5x fa-fw"></i><span class="sr-only"></span></div>';
}
function loader_mini(){
		return '<div style="height: 120px;display: flex;align-items: center;justify-content: center; color:gray;"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only"></span></div>';
}

function diaSemana(){
	var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	var f=new Date();
	alert(diasSemana[f.getDay()]);   
}
function capitalize(texto) {
	texto = texto.toLowerCase();
  return texto[0].toUpperCase() + texto.slice(1);
}
function crecer_buscador(){
	$(".menu_buscar").find(".col-xs-2").hide(500,function(){
		$(".menu_buscar").find(".col-xs-10").addClass('col-xs-12');
		$(".menu_buscar").find(".col-xs-10").removeClass('col-xs-10');
		$('#contenedor_articulos').scrollTop(0);
		$(".input_search").val("");
	});
	
}
function reducir_buscador(){
	$(".menu_buscar").find(".col-xs-2").show(500);
	$(".menu_buscar").find(".col-xs-12").addClass('col-xs-10');
	$(".menu_buscar").find(".col-xs-12").removeClass('col-xs-12');
	$('#contenedor_articulos').scrollTop(0);
	
}
function regresar_inicio(){
	$("#contenedor_articulos").fadeOut(500,"swing",function(){
		$.post('contenido/banner.html', function(resp_json){
			$("#contenedor_articulos").html(resp_json);
			$("#contenedor_articulos").slideDown(500);
			crecer_buscador();
		})
	});
}