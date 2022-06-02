
const width = 900;
const height = 600;
const margin = {"top":10,"bottom":20,"left":40,"right":10}

//svg
const svg = d3.select("body")
  .append("svg")
  .attr("width",width)
  .attr("height",height)
  
//projection
const projection = d3.geoMercator()
  .center([150,35]) //緯度経度の中心
  .translate([width/2,height/2]) //svgの中心
  .scale(1000); //地図の縮尺

//path
const path = d3.geoPath(projection);

//geojson
d3.json("assets/japan.geo.geojson").then(function(json) {
    svg.append("g")
       .selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("d",path)
       .attr("stroke","dimgray")
       .attr("stroke-width",0.5)
       .attr("fill","lightgray");
});