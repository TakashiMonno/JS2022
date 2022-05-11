d3.csv("https://takashimonno.github.io/JS2022/W08/W08_data.csv")
    .then( data => {
        data.forEach( d => { d.width = +d.value;});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:30, right:30, bottom:30, left:30},
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
                width: config.width || 256,
                height: config.height || 256,
                margin: config.margin || {top:10, right:10, bottom:10, left:10},
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
                .attr('height', self.config.height+self.config.margin.top);
    
            self.chart = self.svg.append('g')
                .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

            // スケールの調整
            self.xscale = d3.scaleLinear()
                            .range([0, self.inner_width]);
            self.xaxis = d3.axisBottom( self.xscale )
                            .ticks(5)
                            .tickSizeOuter(0);
            self.xaxis_group = self.chart.append('g')
                                .attr('transform', `translate(0, ${self.inner_height})`)
                                .call(self.xaxis)
            
            self.yscale = d3.scaleBand()
                            .range([0, self.inner_height])
                            .paddingInner(0.1);
            self.yaxis = d3.axisLeft( self.yscale )
                            .tickSizeOuter(0);
            self.yaxis_group = self.chart.append('g')
                                .call(self.yaxis);
        }
    
        update() {
            let self = this;
    
            const xmax = d3.max( self.data, d => d.value );
            self.xscale.domain( [0, xmax] );

            self.yscale.dmain(self.data.map(d => self.config.label));
    
            self.render();
        }
    
        render() {
            let self = this;

            chart.selectAll("rect").data(self.data).enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", d => yscale(d.label))
                .attr("width", d => xscale(d.value))
                .attr("height", d.yscale.bandwidth());

        }
    }