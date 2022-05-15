d3.csv("https://takashimonno.github.io/JS2022//W08/W08_Task1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value;});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius: 128,
        };

        const piechart = new Piechart( config, data );
        piechart.update();
    })
    .catch( error => {
        console.log( error );
    });

class Piechart {

        constructor( config, data ) {
            this.config = {
                parent: config.parent,
                width: config.width || 256,
                height: config.height || 256,
                radius: config.radius,
            }
            this.data = data;
            this.init();
        }

        init() {
            let self = this;

            self.inner_width = self.config.width;
            self.inner_height = self.config.height;

            //svgのサイズ設定
            self.svg = d3.select(self.config.parent )
                        .attr('width', self.inner_width)
                        .attr('height', self.inner_height)
                        .append('g')
                        .attr('transform', `translate(${self.inner_width/2}, ${self.inner_height/2})`);    
            
            self.color = d3.scaleOrdinal()
                        .range(["#4169e1", "#66cdaa", "#40e0d0", "#9370db", "#ff6347"]);

        }
    
        update() {
            let self = this;

            self.render();
        }
    
        render() {
            let self = this;

            self.pie =  d3.pie()
                        .value(d => d.value)
                        .sort(null);

            self.arc = d3.arc()
                        .innerRadius(self.config.radius/2)
                        .outerRadius(self.config.radius);
            
            self.pieGroup = self.svg.selectAll('.pie')
                                .data(self.pie(self.data))
                                .enter()
                                .append('g') 
                                .attr('class', 'pie');
            self.pieGroup
                .append('path')
                .attr('d', self.arc)
                .attr('fill', function(d){return self.color(d.index)})
                .attr('stroke', 'white')
                .style('stroke-width', '2px');
            
            self.text = d3.arc()
                .innerRadius(self.config.radius-30)
                .outerRadius(self.config.radius-30);
            
            self.pieGroup.append("text")
                .attr("fill", "black")
                .attr("transform", function(d) { return "translate(" + self.text.centroid(d) + ")"; })
                .attr("dy", "5px")
                .attr("font", "10px")
                .attr("text-anchor", "middle")
                .text(function(d) { return d.data.label; });

        }
    }