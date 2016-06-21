$(function(){

var base_url_receta = "https://es.wikibooks.org/wiki/Artes_culinarias/Recetas/";
var url_recetas = "https://es.wikibooks.org/wiki/Categoría:Recetas";
var url_ingredientes = "https://es.wikibooks.org/wiki/Categor%C3%ADa:Ingredientes";
var url_ingrediente = "https://es.wikibooks.org/wiki/Artes_culinarias/Ingredientes/";
var urls_recetas = [];
var letras_recetas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var ingredientes = [];
var map_ingr_cat = [];
var m_recetas = [];
var m_recetas_links = [];
var recetas_query = "INSERT INTO 'recetas' (_id, nombre, dificultad, duracion, personas)VALUES('";
var rec_pasos_query = "INSERT INTO 'receta_pasos' (id_receta, paso, descripcion)VALUES('";
var rec_ingr_query = "INSERT INTO 'receta_ingredientes' (id_receta, id_ingrediente, descripcion)VALUES('";
var ingredientes_query = "INSERT INTO 'ingredientes' (_id, nombre, categoria)VALUES('";
var map_ingr_index = [];
var _id_rec = 0;
cargarIngredientes(); //carga una colección con el id de cada ingrediente de la BD para luego enlazar con recetas

function imprimirCategorias(){
    var queries = "";
    console.log(map_ingr_cat["Aceite"]);

    for (var i = 0; i < ingredientes.length; i++) {
        if(ingredientes[i]!= undefined)
            queries += ingredientes_query + map_ingr_index[ingredientes[i]] + "','"+ ingredientes[i] + "','"+ map_ingr_cat[ingredientes[i]] + "');<br>";
    }

    $('#data').html(queries);
}

function getCategorias(){
    
    for (var i = 0; i < ingredientes.length; i++) {
        if(ingredientes[i] != undefined){
            var link = ingredientes[i].replace(/\s+/g, "_");        
            $.ajax({
                url: url_ingrediente + link,
                type: "get",
                dataType: "html",
                ingrediente: ingredientes[i],
                success: function (data) {                
                    map_ingr_cat[this.ingrediente] = $('#mw-normal-catlinks ul li:last-child', data.responseText)[0].textContent;
                    if(this.ingrediente == "Ñora")
                       imprimirCategorias();

                }
            });
        }
        
    }
}



$( "#limpiar" ).click(function() {
    $('#data').html("");
});

$( "#recetas" ).click(function() {
    $('#data').html("<img id='pizza' src='img/pizza-loading.gif'/>")

    //Obtener recetas
    for (var i = 0; i < letras_recetas.length; i++) {
        $.ajax({
            url: base_url_receta + letras_recetas[i],
            type: "get",
            dataType: "html",
            indice: i,
            success: function (data) {
                var receta;
                var recetas_links = [];
                var recetas = [];
                var a_list = $("#mw-content-text ul li a",data.responseText);
                
                for(var i = 0; i < a_list.length; i++){
                    receta = a_list[i].textContent;
                    if( receta != undefined){
                        recetas.push(receta);
                        receta = receta.replace(/\s+/g, "_");
                        recetas_links.push(receta);
                    }   
                }

                m_recetas.push(recetas);
                m_recetas_links.push(recetas_links);

                obtenerInformacionRecetas(this.indice);

            }
        });
    }
});


//Obtener ingredientes de una receta
//Necesitas haber recibido la respuesta(success) antes de usar resultados que ella obtiene
function obtenerInformacionRecetas(indice){
    if(indice == 0){
        $('#pizza').remove();
    }    

    if(m_recetas[indice] != undefined){
        for (var i = 0; i < m_recetas[indice].length; i++) {
                $.ajax({
                url: base_url_receta+m_recetas_links[indice][i],
                type: "get",
                receta: m_recetas[indice][i],
                dataType: "html",
                success: function (data) {
                    
                    var query_receta = "";
                    var queries_pasos = "";
                    var queries_ingredientes = "";
                    var tiempo= "";
                    var td_tiempo = $('td[align="center"]',data.responseText);

                    if (typeof td_tiempo[3] != 'undefined'){
                        tiempo = td_tiempo[3].textContent.split("\n")[1];
                    }else if(typeof td_tiempo[2] != 'undefined'){
                        tiempo = td_tiempo[2].textContent.split("\n")[1];
                    }/*else //Hay páginas que no siguen el formato de dar Ingredientes y Pasos. Las ignoraremos.
                        return;*/

                    var personas = $('td[align="center"] b', data.responseText)[0].textContent;
                    /*if($('td[align="left"] a.image img[src$=".svg.png"]', data.responseText)[0] == undefined)
                        return;*/
                    var dificultad = $('td[align="left"] a.image img[src$=".svg.png"]', data.responseText)[0].alt;
                    var html_ingreds = $("td[width='35%'] li",data.responseText);
                    var html_refs = $("td[width='35%'] li a",data.responseText);
                    var texto_ingredientes = [];
                    var refs_ingredientes = [];
                    var html_pasos = $("td div ol li",data.responseText);
                    var pasos = []; 
                    
                    query_receta += recetas_query + _id_rec + "','" + this.receta+ "','" + dificultad + "','"+ tiempo + "','"+ personas + "');<br>";

                    for (var k = 0; k < html_refs.length; k++) {
                        //refs_ingredientes.push(html_refs[k].textContent);
                        queries_ingredientes += rec_ingr_query + _id_rec + "','" + map_ingr_index[html_refs[k].textContent]+"'," + "NULL" + ");<br>";
                    }
                    for (var j = 0; j < html_ingreds.length; j++) {
                        //texto_ingredientes.push(html_ingreds[j].textContent);
                        queries_ingredientes += rec_ingr_query + _id_rec + "'," + "NULL" + ",'" + html_ingreds[j].textContent +  "');<br>";
                    }

                    for (var z = 0; z < html_pasos.length; z++) {
                        //pasos.push(html_pasos[z].textContent);
                        //result += html_pasos[z].textContent+"<br>";
                        queries_pasos += rec_pasos_query + _id_rec + "','" + z +"','" + html_pasos[z].textContent + "');<br>";
                    }

                    $('#queries-recetas').append(query_receta);
                    $('#queries-pasos').append(queries_pasos);
                    $('#queries-ingredientes').append(queries_ingredientes);
                    _id_rec++;
                }
            });       
        }
    }
}

function cargarIngredientes(){
    $('#data').html("<img id='pizza' src='img/pizza-loading.gif'/>")
    $.ajax({
        url: url_ingredientes,
        type: "get",
        dataType: "html",
        success: function (data) {
            var ingrediente;
            var html_refs = $('.mw-content-ltr ul li a',data.responseText).get();
            var index = 0;

            for (var i = 0; i < html_refs.length; i++) {
                ingrediente = html_refs[i].title.split('/')[2];
                if (ingrediente != undefined && ingrediente.length > 1){
                    ingredientes[index]=ingrediente;
                    map_ingr_index[ingrediente]=index;
                    index++;
                }
            }
            getCategorias();            
        }
    });
}
$( "#ingredientes" ).click(function() {
    result = "";
    for (var ingrediente in ingredientes) {
        result += ingredientes[ingrediente]+"<br>";
    }
    $('#data').html(result);
});


})