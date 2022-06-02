d3.csv("https://takashimonno.github.io/JS2022//Final_Task/pre_data.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value;});

        var config = {
            parent: '#drawing_region',
            width: 400,
            height: 550,
            margin: {top:10, right:10, bottom:20, left:60},
        };

        const barchart = new Barchart( config, data );
        barchart.update();
    })
    .catch( error => {
        console.log( error );
    });

class Barchart {

        constructor( config, data ) {
            this.config = {
                parent: config.parent,
                width: config.width || 256,
                height: config.height || 128,
                margin: config.margin || {top:10, right:10, bottom:20, left:60}
            }
            this.data = data;
            this.init();
        }

        init() {

            let self = this;

            self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
            self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

            //svgのサイズ設定
            self.svg = d3.select( self.config.parent )
                .attr('width', self.config.width)
                .attr('height', self.config.height);
    
            self.chart = self.svg.append('g')
                .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

            // スケールの調整
            self.xscale = d3.scaleLinear()
                            .domain( [0, d3.max(self.data, d => d.value)] )
                            .range([0, self.inner_width]);
            self.yscale = d3.scaleBand()
                            .domain(self.data.map(d => d.label))
                            .range([0, self.inner_height])
                            .paddingInner(0.1);
            
            self.xaxis = d3.axisBottom( self.xscale )
                            .ticks(5)
                            .tickSizeOuter(0);
            self.yaxis = d3.axisLeft( self.yscale )
                            .tickSizeOuter(0);

            self.xaxis_group = self.chart.append('g')
                                .attr('transform', `translate(0, ${self.inner_height})`)
                                .call(self.xaxis);
            self.yaxis_group = self.chart.append('g')
                                .call(self.yaxis);
            
            const mapwidth = 900;
            const mapheight = 600;
                    
            const svg = d3.select("body")
                            .append("svg")
                            .attr("width",mapwidth)
                            .attr("height",mapheight);
                    
            const projection = d3.geoMercator()
                                  .center([146,37])       
                                  .translate([mapwidth/2,mapheight/2])
                                  .scale(1200);             
                    
            const path = d3.geoPath(projection);
                    
            d3.json("https://takashimonno.github.io/JS2022//Final_Task/japan.geo.geojson").then(function (jpn) {
                        for (var i = 0; i < 47; i++) {
                            for (var j = 0; j < jpn.features.length; j++) {
                                 if (self.data[i].label == jpn.features[j].properties.name_local) {
                                         jpn.features[j].properties.value = self.data[i].value;
                                          break;
                                }
                             }
                        } 
                    
                        var colorScale = d3.scaleSequential(d3.interpolateBlues()).domain([0, d3.max(self.data, d => d.value)]);
                    
                    
                        var jpMap = svg.append("g").selectAll("path").data(jpn.features);
                    
                        jpMap
                            .enter() // enterセレクションに保管
                            .append("path") // PATH要素の不足分を作成
                            .attr("d",path)
                            .attr("stroke","dimgray")
                            .attr("stroke-width",0.5)
                            .style("fill", function(d){
                                var jpnValue =d.properties.value;
                                    if(jpnValue > 6000)
                                         var c = "#191970";
                                    else if(jpnValue > 5500)
                                        var c = "#000080";
                                    else if(jpnValue > 5000)
                                        var c = "#00008b";
                                    else if(jpnValue > 4500)
                                        var c = "#0000cd";
                                    else if(jpnValue > 4000)
                                        var c = "#0000ff";
                                    else if(jpnValue > 3500)
                                        var c = "#4169e1";
                                    else if(jpnValue > 3000)
                                        var c = "1e90ff";
                                    else if(jpnValue > 2500)
                                        var c = "#4682b4";
                                    else if(jpnValue > 2000)
                                        var c = "#708090";
                                    else if(jpnValue > 1500)
                                        var c = "#778899";
                                    else if(jpnValue > 1000)
                                        var c = "#b0c4de";
                                     else if(jpnValue > 500)
                                        var c = "#e6e6fa";
                                    else if(jpnValue > 1)
                                        var c = "#f0f8ff";
                                    else
                                        var c = "#ffffff";
                                                    
                                    return c;
                            })
                            .on("mouseover", function (e,d) {
                                d3.select('#tooltip')
                                .style('opacity', 1)
                                .text(d.properties.name_local+"の出荷量は約"+d.properties.value+"トン");
                                    
                                d3.select(this).style("fill","red");
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
                                            
                            d3.select(this).style("fill",function(d){
                                var jpnValue =d.properties.value;
                                if(jpnValue > 6000)
                                    var c = "#191970";
                                else if(jpnValue > 5500)
                                    var c = "#000080";
                                else if(jpnValue > 5000)
                                    var c = "#00008b";
                                else if(jpnValue > 4500)
                                    var c = "#0000cd";
                                else if(jpnValue > 4000)
                                    var c = "#0000ff";
                                else if(jpnValue > 3500)
                                    var c = "#4169e1";
                                else if(jpnValue > 3000)
                                    var c = "1e90ff";
                                else if(jpnValue > 2500)
                                    var c = "#4682b4";
                                else if(jpnValue > 2000)
                                    var c = "#708090";
                                else if(jpnValue > 1500)
                                    var c = "#778899";
                                else if(jpnValue > 1000)
                                    var c = "#b0c4de";
                                else if(jpnValue > 500)
                                    var c = "#e6e6fa";
                                else if(jpnValue > 1)
                                    var c = "#f0f8ff";
                                else
                                    var c = "#ffffff";
                                                    
                                return c;
                            });
                        });

                        self.svg.append("text")
                                .attr("x", (self.inner_width+self.config.margin.right)/2 - 40)
                                .attr("y", self.config.margin.top)
                                .attr("font-size", "12px")
                                .attr("text-anchor", "top")
                                .attr("font-weight", 700)
                                .text("都道府県別みかん出荷量グラフとコロプレス地図");
                                    
                    });                

        }
    
        update() {

            let self = this;

            self.xscale.domain( [0, d3.max(self.data, d => d.value)] );

            self.yscale.domain(self.data.map(d => d.label));

            self.render();
        }
    
        render() {
            let self = this;

            console.log(self.data.id);
            self.chart.selectAll("rect").data(self.data)
                .join("rect")
                .transition().duration(1000)
                .attr("x", 0)
                .attr("y", d => self.yscale(d.label))
                .attr("width", d => self.xscale(d.value))
                .attr("height", self.yscale.bandwidth())
                .style("fill", function(d){
                    var jpnValue =d.value;
                        if(jpnValue > 6000)
                             var c = "#191970";
                        else if(jpnValue > 5500)
                            var c = "#000080";
                        else if(jpnValue > 5000)
                            var c = "#00008b";
                        else if(jpnValue > 4500)
                            var c = "#0000cd";
                        else if(jpnValue > 4000)
                            var c = "#0000ff";
                        else if(jpnValue > 3500)
                            var c = "#4169e1";
                        else if(jpnValue > 3000)
                            var c = "1e90ff";
                        else if(jpnValue > 2500)
                            var c = "#4682b4";
                        else if(jpnValue > 2000)
                            var c = "#708090";
                        else if(jpnValue > 1500)
                            var c = "#778899";
                        else if(jpnValue > 1000)
                            var c = "#b0c4de";
                         else if(jpnValue > 500)
                            var c = "#e6e6fa";
                        else if(jpnValue > 1)
                            var c = "#f0f8ff";
                        else
                            var c = "#ffffff";
                                        
                        return c;
                })
                
                
            self.xaxis_group
                .call( self.xaxis );
            self.yaxis_group
                .call( self.yaxis );
            
            d3.select('#ascend')
                .on('click', d => {
                    self.data.sort((a,b) => a.value - b.value);
                    self.update();
                });   
            
            d3.select('#descend')
                .on('click', d => {
                    self.data.sort((a,b) => b.value-a.value);
                    self.update();
                });   
                

        }
    }