$(document).ready(function() {

	var path_=getPhoneGapPath();
	//alert(path_);
	//carcar contenidos de los div_contenido
	$(".div_contenido").each(function(index, el){
		if($(this).attr("contenido")==""){
			$(this).attr("contenido",get_value("ruta"));
		}
		$(this).load(path_+'/contenido/'+$(this).attr("contenido"),function(){
			$(".slash").fadeOut(500,"swing");
			$(".titulo_emergente").each(function(index, el) {
				$(this).html(get_value("ruta").toUpperCase().split(".")[0]);
			})
		});

		$(".div_contenido").each(function(index, el){
			$(this).hide();
			$(this).slideDown(500);
		})
		//$(this).show('10000');
	});
	
	//regresar a inicio
	$(document).on("click",".menu_inicio",function(){
		window.location.href = "index.html";
	})

	//cargar ventanas emergentes
	/*
	$(document).on("click",".ventana_emergente",function(){
		window.open('emergente.html?ruta='+$(this).attr('ruta')+".html");
	})
	*/

	//cerrar ventanas emergentes
	$(document).on("click",".cerrar_ventana",function(){
		closeBrowser();
	})

	

	//funcion que extrae variables get
	function get_value(variable){ 
	  var query = window.location.search.substring(1); 
	  var vars = query.split("&"); 
	  for (var i=0;i<vars.length;i++){ 
	    var pair = vars[i].split("="); 
	    if (pair[0] == variable){return pair[1];} 
	  }
	  return ""; //not found 
	}
});

//funcion phonegap para cerrar ventanas
	function closeBrowser(){
		window.history.go(-1);
       	return false;
	}
	function getPhoneGapPath() {
	   var path = window.location.pathname;
	   path = path.substr( path, path.length - 10 );
	   return path;
	};