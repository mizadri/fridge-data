$(function(){
var url_categoria = "https://es.wikibooks.org/wiki/Categoría:";
var url_ingrediente = "https://es.wikibooks.org/wiki/Ingrediente:";
var url_categorias = "https://es.wikibooks.org/wiki/Categoría:Ingredientes"

var categorias_links = [];
var categorias = [];


$( "#limpiar" ).click(function() {
    $('#data').html("");
});

$( "#recetas" ).click(function() {
    $('#data').html("<img src='img/pizza-loading.gif'/>")
    //Obtener categorias

    $.ajax({
        url: url_categorias,
        type: "get",
        dataType: "html",
        success: function (data) {
            var categoria;
            var a_list = $('a.CategoryTreeLabel.CategoryTreeLabelNs14.CategoryTreeLabelCategory',data.responseText);

            for(var i = 0; i < a_list.length; i++){

                categoria = a_list[i].innerHTML;
                if( categoria != undefined && categoria.length >1){

                    categorias.push(categoria);
                    categoria = categoria.replace(/\s+/g, "_");
                    categorias_links.push(categoria);

                }
                

            }
                categoriasObtained();
        }
    });
});

//Obtener ingredientes de una categoria
//Necesitas haber recibido la respuesta(success) antes de usar resultados que ella obtiene
function categoriasObtained(){
   console.log(categorias);
   console.log(categorias_links);
   for (var i = 1; i < categorias.length; i++) {
       
       $.ajax({
            url: url_categoria+categorias_links[i],
            type: "get",
            dataType: "html",
            success: function (data) {
                var result = "<br>Categoria: " + categorias[i] +"'<br>";
                var a_list = $('.mw-content-ltr ul li a',data.responseText).get();
                var ingrediente;

                for (var i = 0; i < a_list.length; i++) {
                    ingrediente = a_list[i].title.split('/')[2];
                    if (ingrediente != undefined && ingrediente.length > 1)
                        result += "'"+ ingrediente +"'</br>";
                }
                $('#data').append(result);
            }
        });
   }
}

$( "#ingredientes" ).click(function() {
    $('#data').html("<img src='img/pizza-loading.gif'/>")
  $.ajax({
        url: url_categorias,
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