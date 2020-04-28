$(document).ready(function() {
	//$('body').html(loader());
	$(".div_contenido").each(function(index, el) {
		$(this).load('contenido/'+$(this).attr("contenido"));
	});
});