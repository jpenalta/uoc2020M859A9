
// set the dimensions and margins of the graph
//var margin = {top: 10, right: 30, bottom: 30, left: 30},
//    width = 460 - margin.left - margin.right,
//    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
//var svg = d3.select("#my_dataviz")
//  .append("svg")
//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom)
//  .append("g")
//    .attr("transform",
//          "translate(" + margin.left + "," + margin.top + ")");

function loadRecursostic(area){
    var margin = {top: 10, right: 100, bottom: 30, left: 160}
    var width   = area.offsetWidth - margin.left - margin.right;
    var height  = area.offsetHeight - margin.top - margin.bottom;
    var color = d3.scaleOrdinal()
  		.domain([0, 1])
  		.range(["#e41a1c", "#4daf4a"]) 
  		     
   // width = Math.max(  width, 460); 
    height = Math.max(  height, 400);         
// set the dimensions and margins of the graph
//var margin = {top: 10, right: 30, bottom: 30, left: 30},
//    width = 460 - margin.left - margin.right,
//    height = 500 - margin.top - margin.bottom;

    const svg = d3.select(area).append("svg")
      .attr("width",width + margin.left + margin.right)
      .attr("height",height + margin.top + margin.bottom)
      .attr('id','svg-recursostic')
    .append('g')
      .attr('transform',
      		"translate(" + margin.left + "," + margin.top + ")");


function transposeData(data) {

  
  var transposedData = [];

  data.forEach(function(d) {
  for (var key in d) {
    var obj = {};
    if (key !== "name" && key !== "code"&& key !== "Profesorado" && key !== "Alumnado" ) {
      obj.group = key;
      obj.value1 = d[key]
      obj.name1 = d.name;
      transposedData.push(obj)
    } 
  }
});

  var mitadLong = transposedData.length/2;
  for (i = 0; i < transposedData.length/2; i++) {
   transposedData[i].value2 = transposedData[mitadLong+i].value1;
   transposedData[i].name2 = transposedData[mitadLong+i].name1;
 }  
 
 transposedData.splice(mitadLong,transposedData.length)
 transposedData.columns = ["group",  "value1", "value2","name1","name2"];

  return transposedData
};

// Parse the Data
d3.csv("data/recursostic.csv", function(data1) {

  data = transposeData( data1.filter(function(d) { 
  	return d.code ==selectedCountry2 || d.code == selectedCountry1 })
  	);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1.5])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.group; }))
    .padding(1);
  svg.append("g")
    .call(d3.axisLeft(y))
    
  // Lines
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.value1); })
      .attr("x2", function(d) { return x(d.value2); })
      .attr("y1", function(d) { return y(d.group); })
      .attr("y2", function(d) { return y(d.group); })
      .attr("stroke", "grey")
      .attr("stroke-width", "1px")

  // Circles of variable 1
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.value1); })
      .attr("cy", function(d) { return y(d.group); })
      .attr("r", "6")
      .style("fill", color(0))

  // Circles of variable 2
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.value2); })
      .attr("cy", function(d) { return y(d.group); })
      .attr("r", "6")
      .style("fill", color(1))
      
console.log(data);
var subgroups = [data[0].name1, data[0].name2];	

svg.selectAll("mydots")
  .data(subgroups)
  .enter()
  .append("circle")
    .attr("cx", width)
    .attr("cy", function(d,i){ return 20 + i*24}) 
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

// Add one dot in the legend for each name.
svg.selectAll("mylabels")
  .data(subgroups)
  .enter()
  .append("text")
    .attr("x",  width + 20)
    .attr("y", function(d,i){ return 20 + i*25}) 
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
})

}
