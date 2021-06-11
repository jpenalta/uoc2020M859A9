function loadFinanciacion(area){

console.log("cargando financiacion");
// set the dimensions and margins of the graph
var margin = {top: 10, right: 120, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#financiacion")
  .append("svg")
    .attr('id','svg-financiacion')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("data/financiacion.csv", function(data) {
 

 datafiltered = data.filter(function(d) { 
  	return d.code ==selectedCountry2 || d.code == selectedCountry1 });
  	
 // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip
        .html("Origen finación: " + subgroupName + "<br>" + "Value: " + subgroupValue)
        .style("opacity", 1)
  }
  var mousemove = function(d) {
  var matrix = this.getScreenCTM()
        .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));
    tooltip
      .style("left", (window.pageXOffset + matrix.e + d3.mouse(this)[0] )+ "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (window.pageYOffset + matrix.f  + d3.mouse(this)[1])+ "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(2)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(datafiltered, function(d){return(d.group)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeOranges[4])
//    .range(['#e41a1c','#377eb8','#4daf4a'])

  // Normalize the data -> sum of each group must be 100!
  dataNormalized = []
  datafiltered.forEach(function(d){
    // Compute the total
    tot = 0
    for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
    // Now normalize
    for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
  })

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (datafiltered)

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.group); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
      .on("mousemove", mousemove)
        
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

svg.selectAll("footer")
	.enter()
	.append("text")
	.attr("x", 20)
    	.attr("y", 100) 
    	.text("Figura 1: Financiación de las escuelas")
    	.style("alignment-baseline", "middle")


var tooltip = d3.select("#financiacion")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
})
}
