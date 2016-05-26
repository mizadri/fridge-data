$(function(){
var url_receta = "https://es.wikibooks.org/wiki/Artes_culinarias/Recetas/";
var url_ingrediente = "https://es.wikibooks.org/wiki/Ingrediente:";
var url_recetas = "https://es.wikibooks.org/wiki/Categoría:Recetas";
var url_ingredientes = "https://es.wikibooks.org/wiki/Categor%C3%ADa:Ingredientes";

var recetas_links = [];
var recetas = [];


$( "#limpiar" ).click(function() {
    $('#data').html("");
});

$( "#recetas" ).click(function() {
    $('#data').html("<img id='pizza' src='img/pizza-loading.gif'/>")
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
    $('#pizza').remove();
    for (var i = 0; i < recetas.length; i++) {   
        $.ajax({
            url: url_receta+recetas_links[i],
            type: "get",
            receta: recetas[i],
            indice: i,
            dataType: "html",
            success: function (data) {
                
                var result = "<br>Receta: " + this.receta +"<br>";
                var tiempo = $('td[align="center"]',data.responseText)[3].textContent.split("\n")[1];
                if (typeof tiempo[3] == 'undefined'){
                    console.log("Undef");
                    console.log($('td[align="center"]',data.responseText));
                    tiempo = $('td[align="center"]',data.responseText)[2].textContent.split("\n")[1];
                }

                var personas = $('td[align="center"] b', data.responseText)[0].textContent;
                var dificultad = $('td[align="left"] a.image img[src$=".svg.png"]', data.responseText)[0].alt;
                var html_ingreds = $("td[width='35%'] li",data.responseText).get();
                var html_refs = $("td[width='35%'] li a",data.responseText).get();
                var texto_ingredientes = [];
                var ingredientes = [];
                
              /*  if(this.indice == 0){
                    console.log($('td[align="center"]',data.responseText));
                }*/

                result += "Dificultad: "+dificultad+"<br>Tiempo: "+tiempo+"<br>"+ personas + "<br>Ingredientes:<br>";

                for (var k = 0; k < html_refs.length; k++) {
                    ingredientes.push(html_refs[k].textContent);
                }

                for (var j = 0; j < html_ingreds.length; j++) {
                    texto_ingredientes.push(html_ingreds[j].textContent);
                    result += html_ingreds[j].textContent+"<br>";
                }

                $('#data').append(result);
            }
        });

       
        
    }
}

$( "#ingredientes" ).click(function() {
    $('#data').html("<img src='img/pizza-loading.gif'/>")
  $.ajax({
        url: url_ingredientes,
        type: "get",
        dataType: "html",
        success: function (data) {
            var ingrediente;
            var result = "";
            var html_refs = $('.mw-content-ltr ul li a',data.responseText).get();
            for (var i = 0; i < html_refs.length; i++) {
                ingrediente = html_refs[i].title.split('/')[2];

                if (ingrediente != undefined && ingrediente.length > 1)
                    result += "'"+ingrediente+"'<br>";
   
            }
           $('#data').html(result);
        }
    });
});


})