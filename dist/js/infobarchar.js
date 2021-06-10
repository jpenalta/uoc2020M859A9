     var tooltip = d3.select("#info")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");


function loadInfo(area){

    var mouseover = function(d) {
    	tooltip.html("subgroup: ").style("opacity", 1)
  	};
  	
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise 		the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

    var margin  = {y : 40, x : 100},
     width   = area.offsetWidth - (2 * margin.x),
     height  = area.offsetHeight - (2 * margin.y);
    
    width = Math.max(  width, 200) 
    height = Math.max(  height, 200)
    
    width = 300
    height = 300
                
    const svg = d3.select(area).append("svg")
    svg.attr("width",width + (2 * margin.x))
    .attr("height",height + (2 * margin.y))
    .attr('id','svg-info')
    const chart = svg.append('g')
    .attr('transform',`translate(${margin.x},${margin.y})`)


// Parse the Data
d3.csv("data/ranking_paises_pisa_2018.csv", function(data) {

 // data = data.filter(function(d) { return d.cod =='ESP' || d.cod == selectedCountry });
  

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(3)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data.filter(function(d) { 
  	return d.code ==selectedCountry2 || d.code == selectedCountry1 }), function(d){return(d.name)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class','axis')
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([300, 600])
    .range([ height, 40 ]);   
  svg.append("g")
    .attr("transform", "translate("+width+"," + 0 + ")")
    .call(d3.axisRight(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeOranges[3])
 //   .range(['#e41a1c','#377eb8','#4daf4a'])

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .filter(function(d) { return d.code ==selectedCountry2 || d.code == selectedCountry1 })
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); })
  

svg.selectAll("mydots")
  .data(subgroups)
  .enter()
  .append("circle")
    .attr("cx", function(d,i){ return 50 + i*120})
    .attr("cy", 15) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

// Add one dot in the legend for each name.
svg.selectAll("mylabels")
  .data(subgroups)
  .enter()
  .append("text")
    .attr("x",  function(d,i){ return 60 + i*120})
    .attr("y", 20) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

})



}


