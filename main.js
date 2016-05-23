$(function(){
var url_categoria = "https://es.wikibooks.org/wiki/Categoría:";
var url_ingrediente = "https://es.wikibooks.org/wiki/Ingrediente:";
var url_categorias = "https://es.wikibooks.org/wiki/Categoría:Ingredientes"

var categorias_links = [];
var categorias = [];



//Obtener ingredientes de una categoria
//Necesitas haber recibido la respuesta(success) antes de usar resultados que ella obtiene
function categoriasObtained(){
   
   for (var i = 0; i < categorias.length; i++) {
       console.log(categorias[i]);
       $.ajax({
        url: url_categoria+categorias_links[i],
        type: "get",
        dataType: "html",
        success: function (data) {
            var a_list = $('.mw-content-ltr ul li a',data.responseText).get();
            for (var i = 0; i < a_list.length; i++) {
                console.log(a_list[i].title.split('/')[2]);
            }

            }
        });
   }
}

$( "#limpiar" ).click(function() {
    $('#data').html("");
});

$( "#recetas" ).click(function() {
    //Obtener categorias
    $.ajax({
        url: url_categorias,
        type: "get",
        dataType: "html",
        success: function (data) {
        
            for(var i=1; i<27; i++){
                var categoria = $('a.CategoryTreeLabel.CategoryTreeLabelNs14.CategoryTreeLabelCategory',data.responseText)[i].innerHTML;
                categorias.push(categoria);
                categoria = categoria.replace(/\s+/g, "_");
                categorias_links.push(categoria);

            }
                categoriasObtained();
        }
    });
});

$( "#ingredientes" ).click(function() {
    $('#data').html("<img src='img/pizza-loading.gif'/>")
  $.ajax({
        url: url_categorias,
        type: "get",
        dataType: "html",
        success: function (data) {

            var result = "";
            var a_list = $('.mw-content-ltr ul li a',data.responseText).get();
            for (var i = 0; i < a_list.length; i++) {
                var ingrediente = a_list[i].title.split('/')[2];

                if (ingrediente != undefined && ingrediente.length > 1)
                    result += "'"+ingrediente+"'</br>";
   
            }
           $('#data').html(result);
        }
    });
});



/*Reemplazar espacios por _*/
/*
var string = "Hierbas aromáticas";
string = string.replace(/\s+/g, "_");
console.log(string);
*/

/*Sacar ingredientes*/

function obtenerIngredientes(){
    var result;

    


}



})