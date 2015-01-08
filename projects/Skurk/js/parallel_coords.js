
var clusters;
var stream_clusters;

function ParallelCoords()
{

    //var colors = ['rgb(228,26,28)','rgb(55,126,184)','rgb(77,175,74)','rgb(152,78,163)','rgb(255,127,0)','rgb(255,255,51)','rgb(166,86,40)','rgb(247,129,191)'];
    //var colors = ['rgb(27,158,119)','rgb(217,95,2)','rgb(117,112,179)','rgb(231,41,138)','rgb(102,166,30)','rgb(230,171,2)','rgb(166,118,29)','rgb(102,102,102)'];
    //var colors = ['#a50026', '#006837', '#313695', '#ffff33', '#542788', '#b35806', '#c51b7d', '#01665e'];
	var colors = ['#51a351', '#bd362f', '#0044cc', '#f89406', '#2f96b4', '#542788', '#b35806', '#c51b7d'];
    //Some initial stuff needed for parallel Coordinates.

	var self = this; // for internal d3 functions

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var pcDiv = $("#parallelCoords");

    var margin = [60, 0, 50, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {},
        dragAxis = {};
        

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#parallelCoords").append("svg:svg")
        .attr("id", "pcID")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    //Load the data
    var realData = "data/crime_monthly_municipatalities_2013.csv";
    var testData = "data/testdata.csv";
    var realData2 = "data/crime_monthly_municipatalities_2013.json";

    var dataToGet = "helår /100000";

    var color = d3.scale.category20();



    d3.csv("data/crime_monthly_municipatalities_2013.csv", function(csv) {

        stream_clusters = pam_2(csv, 50);

        var newData = [];

        for (var i = 0; i < csv.length; i+=10) 
        {    
            var crimeType = {};
            for (var j = 0; j < 10; j++) 
            {        
                crimeType['kommun'] = csv[i+j]['kommun'];        
                crimeType[csv[i+j]['typ']] = csv[i+j][dataToGet];
            }
            newData[(i/10)] = crimeType;
        }

        self.data = newData;
        clusters = pam(self.data, $("#chooseClusters").text());


        x.domain(dimensions = d3.keys(self.data[0]).filter(function(d) {
            return d != "kommun" && (y[d] = d3.scale.linear()
            .domain(d3.extent(self.data, function(p) { return +p[d]; }))
            .range([height, 0]));
        }));

        draw();
    });

    var insertLinebreaks = function (d) {
        var el = d3.select(this);
        var words = d.split(' ');
        el.text('');

        for (var i = 0; i < words.length; i++) {
            var tspan = el.append('tspan').text(words[i]);
            if (i > 0)
                tspan.attr('x', 0).attr('dy', '10');
        }
    };

    function draw(){
        svg.selectAll("path").remove();
        svg.selectAll(".dimension").remove();

        // Add grey background lines for context.
            background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            .data(self.data)
            .enter().append("svg:path")
            .on("mousemove", function(d) {
                //...
               tooltip.transition()
                   .duration(200)
                   .style("opacity", 1);
                    tooltip.html(d['kommun'])
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");


            })
            .on("mouseout", function(d) {
                //...
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
                 
            });
            
            // Add colored lines for focus
            foreground = svg.append("svg:g")
                .attr("class", "foreground")
                .selectAll("path")
                .data(self.data)
                .enter().append("svg:path")
                .attr("d", path)
                .style("stroke", function(d, i) {
                    
                    return colors[clusters[i]];
                    //return color(d['kommun']); 
                })
            
            .on("mousemove", function(d) {


                tooltip.transition()
                   .duration(200)
                   .style("opacity", 1);
                    tooltip.html(d['kommun'])
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");

            })
            .on("mouseout", function(d) {
                //...
                tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
                 
            })
            .on("click", function(d){
                parallelCoords1.markLine(d['kommun']);
                markOtherViews(d['kommun']);
            });   

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.behavior.drag()
            .on("dragstart", function(d) {
              dragAxis[d] = this.__origin__ = x(d);
              background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
              dragAxis[d] = Math.min(width, Math.max(0, this.__origin__ += d3.event.dx));
              foreground.attr("d", path);
              dimensions.sort(function(a, b) { return position(a) - position(b); });
              x.domain(dimensions);
              g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function(d) {
              delete this.__origin__;
              delete dragAxis[d];
              transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
              transition(foreground)
                  .attr("d", path);
              background
                  .attr("d", path)
                  .transition()
                  .delay(500)
                  .duration(0)
                  .attr("visibility", null);
            }));
            

        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -40)
            .text(String)
            .each(insertLinebreaks)
            .style("font-size", "7pt"); //Doesn't work, check later

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
        
    }

    //Handles the dragging
    function position(d) {
        var v = dragAxis[d];
        return v == null ? x(d) : v;
    }

    //The transition when dragging.
    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
      return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }

    function resetColors(){
        d3.select("#parallelCoords").selectAll(".foreground").selectAll("path").style("stroke", function(d, i){ 
            return colors[clusters[i]];
            //return color(d['kommun']); 
        })
        .style("stroke-opacity", "0.7").style("stroke-width", "1px");
    }
    
    

    //Load new data
    $(document).ready(function(){

        $("#viewBottomLeft").click(
            function(event) {
                if($(event.target.parentElement).attr('class') !== "foreground") {
                    resetColors();
                }
            }
        );

        $(".category").click(function(e){
            var category = $(this).text(); 
            $("#chooseData").text(category);
           
            d3.csv("data/crime_monthly_municipatalities_2013.csv", function(csv) {
                     
                var newData = [];

                for (var i = 0; i < csv.length; i+=10) 
                {    
                    var crimeType = {};
                    for (var j = 0; j < 10; j++) 
                    {        
                        crimeType['kommun'] = csv[i+j]['kommun'];        
                        crimeType[csv[i+j]['typ']] = csv[i+j][category + " /100000"];
                    }
                    newData[(i/10)] = crimeType;
                }

                self.data = newData;
                clusters = pam(self.data, $("#chooseClusters").text());
                
                x.domain(dimensions = d3.keys(self.data[0]).filter(function(d) {
                    return d != "kommun" && (y[d] = d3.scale.linear()
                    .domain(d3.extent(self.data, function(p) { return +p[d]; }))
                    .range([height, 0]));
                }));
                draw();                 
            });   
        });

        $(".clusters").click(function(e){
            var clusterCount = $(this).text(); 
            $("#chooseClusters").text(clusterCount); 

            d3.csv("data/crime_monthly_municipatalities_2013.csv", function(csv) {
                     
                var newData = [];

                for (var i = 0; i < csv.length; i+=10) 
                {    
                    var crimeType = {};
                    for (var j = 0; j < 10; j++) 
                    {        
                        crimeType['kommun'] = csv[i+j]['kommun'];        
                        crimeType[csv[i+j]['typ']] = csv[i+j][$("#chooseData").text() + " /100000"];
                    }
                    newData[(i/10)] = crimeType;
                }

                self.data = newData;
                clusters = pam(self.data, $("#chooseClusters").text());
                
                x.domain(dimensions = d3.keys(self.data[0]).filter(function(d) {
                    return d != "kommun" && (y[d] = d3.scale.linear()
                    .domain(d3.extent(self.data, function(p) { return +p[d]; }))
                    .range([height, 0]));
                }));
                draw();
                map.reColor();              
            });
        });
    });
    
    //Called by other views
    this.markLine = function(value){

        d3.select("#parallelCoords").selectAll(".foreground").selectAll("path").style("stroke-width", function(d){ return d["kommun"] != value ? null : "6px" })
        .transition().duration(200)
        .style("stroke-opacity", function(d){

            if(d['kommun'] == value)
            {
                return "1.0";
            }
            else
            {
                return "0.2";
            } 
            
        }).style("stroke", function(d){ 
            if(d['kommun'] == value)
            {
                return "#f00";
            }
            else
            {
                return "#444";
            }
        });

    
    };

    this.getColors = function() {
        return colors;
    };

    function markOtherViews(value)
    {
        streamGraph.markMunicipality(value);
        map.markMun(value);
    }
    

}

