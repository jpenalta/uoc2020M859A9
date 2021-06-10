// Load external data and boot
function loadMap(area){

// Map and projection
var path = d3.geoPath();

// Data and color scale
var data = d3.map();

var colorScale = d3.scaleThreshold()
  .domain([200, 300, 400, 450,475,500,525,550,575, 600])
  .range(d3.schemeBlues[7]);

    var margin  = {y : 40, x : 60};
    var width   = area.offsetWidth - (2 * margin.x);
    var height  = area.offsetHeight - (2 * margin.y);
    
    width = Math.max(  width, 600) 
    height = Math.max(  height, 400) 
            
    const svg = d3.select(area).append("svg")
    
    svg.attr("width",width + (2 * margin.x))
    .attr("height",height + (2 * margin.y))
    .attr('id','svg-mapa')
    
    
    const chart = svg.append('g')
    .attr('transform',`translate(${margin.x},${margin.y})`)

    var projection = d3.geoMercator()
      .scale(120)
      .center([0,50])
      .translate([width / 2, height / 2]);


    d3.queue()
      .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .defer(d3.csv, "data/ranking_paises_pisa_2018.csv", function(d) {
  	 data.set(d.code, d.rank);})
      .await(ready);

function ready(error, topo) {

  let mouseOver = function(d) {
     var total = d3.select(this).property("__data__").total
     if(total){
	    d3.selectAll(".Country")
	      .transition()
	      .duration(200)
	      .style("opacity", .5)
	      .style("stroke", "transparent")
	    d3.select(this)
	      .transition()
	      .duration(200)
	      .style("opacity", 1)
	      .style("stroke", "black")
	      
	    overCountry = d3.select(this).property("__data__").id
    }

  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8);
  }
  
  let click = function(d) {
      d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
      .style("stroke", "transparent")
  	
      
      
      var country = d3.select(this).property("__data__").id
      var total = d3.select(this).property("__data__").total
      var colorOriginal = d3.select(this).attr("fill")
      
      if(total && selectedCountry1 != country && selectedCountry2 != country ){      
        if(selectCountry==1 && selectedCountry1 != country) {
      	  selectedCountry1 = country
      	  selectCountry = 2
      	  
      	  d3.select(".Country1")
      	  	.attr("class","Country")	
      	 	.attr("fill", colorSelectedCountry1); 	  
      	 
      	  d3.select(this)
      	  	.attr("fill","#e41a1c")
      	  	.attr("class", "Country1")
      	  	
      	  colorSelectedCountry1 = colorOriginal
        }else{
      	  selectedCountry2 = country
      	  selectCountry = 1
      	  d3.select(".Country2")
      		.attr("class","Country")	
      	 	.attr("fill", colorSelectedCountry2);
      	       	 	
      	  d3.select(this)
      	  	.attr("fill","#4daf4a")
      	  	.attr("class", "Country2")
      	  colorSelectedCountry2 = colorOriginal
        }
        redraw();
      }
      
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("click", click )
    }
}
