$(document).ready(function() {
	var url_api = "http://192.168.1.10:85/ferbis-interno/index.php/api/api_controller/";
	//get_peroductos_dep/01
	//get_productos_filtro/pollo
	$(".img_dep").click(function(){
		$("#contenedor_articulos").html(loader());
		$.post(url_api+'get_peroductos_dep/'+$(this).attr('dep'), function(resp_json){
			//agregar articulos a contenedor
			var resultados="";

			$.each(jQuery.parseJSON(resp_json), function( i, prod ) {
			  resultados+="<div class='articulo'>"+
			  				"<div class='art_img'>X</div>"+
			  				"<div class='art_desc'>"+prod.descripcion+"</div>"+
			  				"<div class='art_um'>"+prod.unidad+"</div>"+
			  				"<div class='art_prec'>"+prod.precio+"</div>"+
			  				"</div>";
			});
			$("#contenedor_articulos").html(resultados);
		});
	})

	function loader(){
		return '<div style="text-align:center;padding-top:100px;"><i class="fa fa-spinner fa-spin fa-5x fa-fw"></i><span class="sr-only"></span></div>';
	}
});