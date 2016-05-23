$(function(){
var url_receta = "https://es.wikibooks.org/wiki/Artes_culinarias/Recetas/";
var url_ingrediente = "https://es.wikibooks.org/wiki/Ingrediente:";
var url_recetas = "https://es.wikibooks.org/wiki/Categoría:Recetas"

var recetas_links = [];
var recetas = [];


$( "#limpiar" ).click(function() {
    $('#data').html("");
});

$( "#recetas" ).click(function() {
    $('#data').html("<img src='img/pizza-loading.gif'/>")
    //Obtener recetas

    $.ajax({
        url: url_recetas,
        type: "get",
        dataType: "html",
        success: function (data) {
            var receta;
            var a_list = $('.mw-category a',data.responseText).get();

            for(var i = 1; i < a_list.length; i++){

                receta = a_list[i].innerHTML.split('/')[2];
                if( receta != undefined && receta.length >1){

                    recetas.push(receta);
                    receta = receta.replace(/\s+/g, "_");
                    recetas_links.push(receta);

                }
                

            }
                recetasObtained();
        }
    });
});

//Obtener ingredientes de una receta
//Necesitas haber recibido la respuesta(success) antes de usar resultados que ella obtiene
function recetasObtained(){
    $('#data').html("");

    for (var i = 0; i < recetas.length; i++) {   
        $.ajax({
            url: url_receta+recetas_links[i],
            type: "get",
            receta: recetas[i],
            dataType: "html",
            success: function (data) {
                
                var result = "<br>Receta: " + this.receta +"<br> Ingredientes:<br>";
                var a_list = $('#mw-content-text > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) li',data.responseText).get();
                var texto_ingredientes = [];

                console.log(a_list);
                for (var j = 0; j < a_list.length; j++) {
                    texto_ingredientes.push(a_list[j].textContent);
                    result += a_list[j].textContent+"<br>";
                }

                $('#data').append(result);
            }
        });

       
        
    }
}

$( "#ingredientes" ).click(function() {
    $('#data').html("<img src='img/pizza-loading.gif'/>")
  $.ajax({
        url: url_recetas,
        type: "get",
        dataType: "html",
        success: function (data) {
            var ingrediente;
            var result = "";
            var a_list = $('.mw-content-ltr ul li a',data.responseText).get();
            for (var i = 0; i < a_list.length; i++) {
                ingrediente = a_list[i].title.split('/')[2];

                if (ingrediente != undefined && ingrediente.length > 1)
                    result += "'"+ingrediente+"'<br>";
   
            }
           $('#data').html(result);
        }
    });
});


})