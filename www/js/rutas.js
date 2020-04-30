$(document).ready(function() {
	//$('body').html(loader());
	$(".div_contenido").each(function(index, el) {
		$(this).load('contenido/'+$(this).attr("contenido"));
	});
	$(document).on("click",".menu_inicio",function(){
		window.location.href = "index.html";
	})
	$(document).on("click",".menu_notificaciones",function(){
		window.open("notificaciones.html");
	})
	$(document).on("click",".cerrar_ventana",function(){
		closeBrowser();
	})

	function closeBrowser(){
	    if(history.length==1){
	        window.open('mobile/close');
	    }else{
	        history.back();
	    }
	}
});