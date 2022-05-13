d3.csv("https://takashimonno.github.io/JS2022//W08/W08_Task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
        };

        const linechart = new Linechart( config, data );
        linechart.update();
    })
    .catch( error => {
        console.log( error );
    });

class Linechart {

        constructor( config, data ) {
            this.config = {
                parent: config.parent,
                width: config.width || 256,
                height: config.height || 128,
            }
            this.data = data;
            this.init();
        }

        init() {
            let self = this;

            self.inner_width = self.config.width
            self.inner_height = self.config.height

            //svgのサイズ設定
            self.svg = d3.select('#drawing_region')
                        .attr('width', self.inner_width)
                        .attr('height', self.inner_height);

            // スケールの調整
            self.xscale = d3.scaleLinear()
                            .domain( [0, d3.max(self.data, d => d.x)] )
                            .range([0, self.inner_width]);
            self.yscale = d3.scaleBand()
                            .range([0, self.inner_height]);

            self.xaxis = d3.axisBottom( self.xscale );
            self.yaxis = d3.axisLeft( self.yscale );

            self.xaxis_group = self.svg.append('g')
                                .attr('transform', `translate(0, ${self.inner_height})`)
                                .call(self.xaxis);
            self.yaxis_group = self.svg.append('g')
                                .call(self.yaxis);
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

            self.area =  d3.area()
                .x(d => d.x )
                .y1(d => d.y )
                .y0(self.config.height);

            self.svg.append('path')
                .attr('d', self.area(self.data))
                .attr('stroke', 'blue')
                .attr('fill', 'red');

            
            self.svg.append('g').selectAll("circle")
                .data(self.data)
                .enter()
                .append("circle")
                .attr("cx", d =>  d.x  )
                .attr("cy", d =>  d.y  )
                .attr("r", d => d.r )
                .style("fill", 'yellow');

        }
    }