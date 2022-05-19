d3.csv("https://takashimonno.github.io/JS2022//W10/W10_data2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:30, right:30, bottom:30, left:30},
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

        constructor( config, data ) {
            this.config = {
                parent: config.parent,
                width: config.width || 256,
                height: config.height || 256,
                margin: config.margin || {top:10, right:10, bottom:10, left:10},
            }
            this.data = data;
            this.init();
        }

        init() {
            let self = this;

            //中
            self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
            self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

            //svgのサイズ設定
            self.svg = d3.select( self.config.parent )
                .attr('width', self.config.width)
                .attr('height', self.config.height);
    
            self.xchart = self.svg.append('g')
                .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.right})`);
            self.ychart = self.svg.append('g')
                .attr('transform', `translate(${self.config.margin.top}, -165)`);

            // スケールの調整
            self.xscale = d3.scaleLinear()
                .range( [self.config.margin.left, self.inner_width] );
            self.xaxis = d3.axisBottom( self.xscale )
                .ticks(6);
            self.xaxis_group = self.xchart.append('g')
                .attr('transform', `translate(0, ${self.inner_height})`);
            
            self.yscale = d3.scaleLinear()
                .range( [self.config.margin.bottom, self.inner_height] );
            self.yaxis = d3.axisLeft( self.yscale )
                .ticks(6);
            self.yaxis_group = self.ychart.append('g')
                .attr('transform', `translate(${self.config.margin.left},${self.inner_width})`);
        }
    
        update() {
            let self = this;
    
            const xmin = d3.min( self.data, d => d.x );
            const xmax = d3.max( self.data, d => d.x );
            self.xscale.domain( [0, xmax] );
    
            const ymin = d3.min( self.data, d => d.y );
            const ymax = d3.max( self.data, d => d.y );
            self.yscale.domain( [ymax, 0] );
    
            self.render();
        }
    
        render() {
            let self = this;

            self.circles = self.xchart.selectAll('circle')
                            .data(self.data)
                            .enter()
                            .append('circle');

            self.circles
                .attr("cx", d => self.xscale( d.x ) )
                .attr("cy", d => self.yscale( d.y ) )
                .attr("r", d => d.r )
                .on('mouseover', function(e,d){
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);

                    d3.select(this).style("fill","blue");
                    
                })
                .on('mousemove', (e) => {
                    const padding = 10;
                    d3.select('#tooltip')
                        .style('left', (e.pageX + padding) + 'px')
                        .style('top', (e.pageY + padding) + 'px');
                    
                            
                })
                .on('mouseleave', function(){
                    d3.select('#tooltip')
                        .style('opacity', 0);
                    
                        d3.select(this).style("fill","black");
                });
    
            self.xaxis_group
                .call( self.xaxis )
                .append("text")
                .attr("fill", "black")
                .attr("x", (self.inner_width+self.config.margin.right)/2)
                .attr("y", self.config.margin.top)
                .attr("text-anchor", "middle")
                .attr("font-size", "10pt")
                .attr("font-weight", "middle")
                .text("X-Label");

            
            self.yaxis_group
                .call( self.yaxis )
                .append("text")
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .attr("x", -self.inner_height/2)
                .attr("y", -self.config.margin.top)
                .attr("transform", "rotate(-90)")
                .attr("font-weight", "middle")
                .attr("font-size", "10pt")
                .text("Y-Label");

            self.svg.append("text")
                .attr("x", (self.inner_width+self.config.margin.right)/2)
                .attr("y", self.config.margin.top)
                .attr("font-size", "13px")
                .attr("text-anchor", "top")
                .attr("font-weight", 700)
                .text("Chart Title");

        }
    }