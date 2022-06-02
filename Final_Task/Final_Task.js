
const mapwidth = 900;
const mapheight = 600;
const barwidth = 900;
const barheight = 1280;
const margin = {"top":10,"bottom":10,"left":10,"right":10}

const svg = d3.select("body")
  .append("svg")
  .attr("width",mapwidth)
  .attr("height",mapheight);

const projection = d3.geoMercator()
                    .center([130,35])       
                    .translate([mapwidth/2,mapheight/2])
                    .scale(1000)                  

const path = d3.geoPath(projection)


  d3.csv("Final_data.csv").then(function(data){
    d3.json("assets/japan.geo.geojson").then(function (jpn) {
/*       for (var i = 0; i < 47; i++) {
        var dataState = data.state[i];
        var dataValue = Number(data[i].value);
        for (var j = 0; j < jpn.features.length; j++) {
            var jsonState = jpn.features[j].properties.name_local;
            if (dataState == jsonState) {
                jpn.features[j].properties.value = dataValue;
                break;
            }
        }
      } */

      svg.append("g")
          .selectAll("path")
          .data(jpn.features)
          .enter() // enterセレクションに保管
          .append("path") // PATH要素の不足分を作成
          .attr("d",path)
          .attr("stroke","dimgray")
          .attr("stroke-width",0.5)
          .style("fill", "lightgray")
          .on("mouseover", function (e,d) {
            d3.select('#tooltip')
            .style('opacity', 1)
            .text(d.properties.name_local);

            d3.select(this).style("fill","blue");
          })
          .on("mousemove", (e) => {
            const padding = 10;
            d3.select('#tooltip')
                .style('left', (e.pageX + padding) + 'px')
                .style('top', (e.pageY + padding) + 'px');;
          })
          .on("mouseleave", function () {
            d3.select('#tooltip')
            .style('opacity', 0);
        
            d3.select(this).style("fill","lightgray");
          });
      
        /*      map.transition()
          .duration(400)
          .style("fill", function (d) {
              $loading.style('display', 'none');
              var value = d.properties.value;
              if (value) {
                  return color(value);
              } else {
                  return "#FFF4D5";
              }
          }) */


    });



  });

