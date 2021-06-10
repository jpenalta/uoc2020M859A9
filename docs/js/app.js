
var overCountry = ""
var selectedCountry1 = "ESP"
var selectedCountry2 = "FRA"
var selectCountry = 1
colorSelectedCountry1 =''
colorSelectedCountry2 =''

const body = document.querySelector('body')

body.onresize = function(){
    redrawMapa()
    redrawInfo()
}

drawMapa()
drawInfo()
drawFinanciacion()
drawRecursostic()
drawCapacidadestic()
//drawLineChart()

function redraw(){
console.log("recargado visualizaciones");
	redrawInfo();
	redrawFinanciacion();
	redrawRecursostic();
	redrawCapacidadestic();
}

function drawMapa(){

    const area = document.querySelector("#mapa")

    console.log("recarga mapa");
   loadMap(area);
}


function drawInfo(){

    const area = document.querySelector("#info")
   
   loadInfo(area);
}

function drawFinanciacion(){
    const area = document.querySelector("#financiacion")
    loadFinanciacion(area)
}


function drawRecursostic(){

    const area = document.querySelector("#recursostic")
   
   loadRecursostic(area);
}

function drawCapacidadestic(){

    const area = document.querySelector("#capacidadestic")
   
   loadCapacidadestic(area);
}

function redrawInfo(){
    const infoSVG = document.querySelector("#svg-info")
    if(infoSVG != null){
        infoSVG.remove()
        drawInfo()
    }
}

	
function redrawMapa(){
    const mapaSVG = document.querySelector("#svg-mapa")
    if(mapaSVG != null){
        mapaSVG.remove()
        drawMapa()
    }
}

function redrawFinanciacion(){
    const financiacionSVG = document.querySelector("#svg-financiacion")
    if(financiacionSVG != null){
        financiacionSVG.remove()
        drawFinanciacion()
    }
}

function redrawRecursostic(){
    const recursosticSVG = document.querySelector("#svg-recursostic")
    if(recursosticSVG != null){
        recursosticSVG.remove()
        drawRecursostic()
    }
}

function redrawCapacidadestic(){
    const capacidades = document.querySelector("#svg-capacidadestic")
    if(capacidades != null){
        capacidades.remove()
        drawCapacidadestic()
    }
}
