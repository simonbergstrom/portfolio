
// Global variables
var boundaries = {
    "Totalt antal brott" : [100000,0],
    "Våldsbrott" : [100000,0],
    "Hot- kränknings- och frihetsbrott" : [100000,0],
    "Vårdslöshet- och vållandebrott" : [100000,0],
    "Stöldbrott" : [100000,0],
    "Bilbrott" : [100000,0],
    "Skadegörelsebrott" : [100000,0],
    "Vissa trafikbrott" : [100000,0],
    "Alkohol- och narkotikabrott" : [100000,0],
    "Vapenbrott" : [100000,0],
};

function Map(){

	// Initalization

	var crimeData;
    var colors = ["#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"];

	var mapDiv = $("#map");
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var width = mapDiv.width() - margin.right - margin.left + 40;
    var height = mapDiv.height() - margin.top - margin.bottom + 40;
    var ls_w = 15, ls_h = 15;
    var infoText;
    var geoData;

    var legendDomain = [];

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 12])
        .on("zoom", move);

    var svg = d3.select("#map").append("svg")
        .attr("id", "mapID")
        .attr("width", width)
        .attr("height", height)
        .style("margin-top", "0px")
        .call(zoom);

    var projection = d3.geo.mercator()
        .center([31, 64.5 ])
        .scale(1200);

    var path = d3.geo.path()
        .projection(projection);

	g = svg.append("g")
        .attr("id", "g_mapID");
	
	// Load crime data
    d3.json("data/crime_monthly_municipatalities_2013.json", function(data) {
        crimeData = data;

        // Load geographic data
        d3.json("data/swe_mun.json", function(error, sweden) {

            // Set boundary levels on each data set
            Object.keys(crimeData).forEach(function(a) {
                
                Object.keys(crimeData[a]).forEach(function(b) {

                    var value = parseInt(crimeData[a][b]['helår /100000']);

                    if (boundaries[b][1] < value)
                        boundaries[b][1] = value;

                    if (boundaries[b][0] > value)
                        boundaries[b][0] = value;

                });
                
            });

            geoData = topojson.feature(sweden, sweden.objects.swe_mun).features;
            draw(geoData); 

        });

	});



    // Draw map
    function draw(geoData) {

    	var kommuner = g.selectAll(".name").data(geoData);

    	kommuner.enter().insert("path")
            .attr("class", "kommuner")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            .style("fill", function(d) {
                return colors[quantize(d)]; 
            })
            .style({ 'stroke-opacity':0.0,'stroke':'#000000' })
            .on("mousemove", function(d) {
    
                d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':0.4,'stroke-opacity':1.0 });

                infoText.html(d.properties.name);
                    
            })
            .on("mouseout",  function(d) {
                
            	d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':1.0,'stroke-opacity':0.0 });

    			infoText.html("Kommun");

            })
            .on("click", function(d){

                d3.select()

                var clusterValMonth = $('#clusterbtn_stream').bootstrapSwitch('state');

                if (clusterValMonth) {

                    d3.select(this)
                        .style("fill", function(d,i) {
                            d3.select("#map").selectAll("path")
                                .style("fill", function(p,i) {
                                    var color = "#444";

                                    if (stream_clusters[d.properties.name] != undefined) {
                                        for (var i = 0; i < stream_clusters[d.properties.name].length; ++i) {
                                            if (stream_clusters[d.properties.name][i] == p.properties.name)
                                                color = "#66bd63";
                                        }
                                    }

                                    return color;
                                }); 

                            return "#006837";
                        });
                }
                else {
                    map.markMun(d.properties.name);
                }

                markOtherViews(d.properties.name);
            });

        drawOriginalLegend();
		
    }

    function drawOriginalLegend() {

        calcLegend();

        // Create legend labels
        var legend_labels = [];
        var legend_values = [];
        for (var i = 0; i < legendDomain.length; i++) {

            var label = "";

            label = parseInt(legendDomain[i]) + " - " + parseInt(legendDomain[i+1]);

            legend_labels.push(label);

            if (i != legendDomain.length-1)
                legend_values.push(legendDomain[i]);
        }

        svg.selectAll("g.legend").remove();
        
        var legend = svg.selectAll("g.legend")
            .data(legend_values)
            .enter().append("g")
            .attr("class", "legend");

        infoText = legend.append("text")
            .attr("x", 250)
            .attr("y", height - 170)
            .attr("class", "infoText")
            .style("fill", "#333333")
            .text("Kommun");

        legend.append("text")
            .attr("id", "crimeType")
            .attr("x", 250)
            .attr("y", height - 157)
            .style("fill", "#333333");

        $("#crimeType").html($("#chooseCategory").text().trim());

        legend.append("text")
            .attr("id", "info")
            .attr("x", 250)
            .attr("y", height - 145)
            .style("fill", "#333333");

        $("#info").html("Per 100 000 inv.");

        legend.append("rect")
            .attr("class", "legendRects")
            .attr("x", 250)
            .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h - 5;})
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function(d, i) { return colors[i]; })
            .style("opacity", 1.0);

        legend.append("text")
            .attr("class", "legendRectsText")
            .attr("x", 280)
            .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 9;})
            .style("fill", "#333333")
            .html(function(d, i){ return legend_labels[i]; })


    }

    function drawClusterLegend(clusterCount) {

        // Create legend labels
        var legend_labels = [];
        var legend_values = [];
        for (var i = 1; i <= clusterCount; i++) {

            var label = "";

            label = "Kluster " + i;

            legend_labels.push(label);
            legend_values.push(i);
        }

        svg.selectAll("g.legend").remove();

        var legend = svg.selectAll("g.legend")
            .data(legend_values)
            .enter().append("g")
            .attr("class", "legend");

        infoText = legend.append("text")
            .attr("x", 250)
            .attr("y", height - 183)
            .attr("class", "infoText")
            .style("fill", "#333333")
            .text("Kommun");

        legend.append("text")
            .attr("id", "info_1")
            .attr("x", 250)
            .attr("y", height - 169)
            .style("fill", "#333333");

        legend.append("text")
            .attr("id", "info_2")
            .attr("x", 250)
            .attr("y", height - 157)
            .style("fill", "#333333");
        
        legend.append("text")
            .attr("id", "info_3")
            .attr("x", 250)
            .attr("y", height - 145)
            .style("fill", "#333333");

        $("#info_1").html("Kommunerna med samma färg");
        $("#info_2").html("har liknande profiler baserat");
        $("#info_3").html("på brottskategori.");

        var col = parallelCoords1.getColors();

        legend.append("rect")
            .attr("class", "legendRects")
            .attr("x", 250)
            .attr("y", function(d, i){ return height - ((7-i)*ls_h) - 2*ls_h - 5;})
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function(d, i) { return col[i]; })
            .style("opacity", 1.0);

        legend.append("text")
            .attr("class", "legendRectsText")
            .attr("x", 280)
            .attr("y", function(d, i){ return height - ((7-i)*ls_h) - ls_h - 9;})
            .style("fill", "#333333")
            .html(function(d, i){ return legend_labels[i]; })
    }

    function drawClusterMonthLegend() {

        // Create legend labels
        var legend_labels = ["Vald kommun", "Liknande årsprofiler", "Övriga"];
        var legend_values = [1, 2, 3];
        var legend_colors = ["#006837", "#66bd63", "#444"];

        svg.selectAll("g.legend").remove();

        var legend = svg.selectAll("g.legend")
            .data(legend_values)
            .enter().append("g")
            .attr("class", "legend");

        infoText = legend.append("text")
            .attr("x", 250)
            .attr("y", height - 128)
            .attr("class", "infoText")
            .style("fill", "#333333")
            .text("Kommun");

        legend.append("text")
            .attr("id", "info_1")
            .attr("x", 250)
            .attr("y", height - 114)
            .style("fill", "#333333");

        legend.append("text")
            .attr("id", "info_2")
            .attr("x", 250)
            .attr("y", height - 102)
            .style("fill", "#333333");
        
        legend.append("text")
            .attr("id", "info_3")
            .attr("x", 250)
            .attr("y", height - 90)
            .style("fill", "#333333");

        $("#info_1").html("Kommunerna som visas i färg");
        $("#info_2").html("på kartan har liknande");
        $("#info_3").html("årsprofiler.");

        var col = parallelCoords1.getColors();

        legend.append("rect")
            .attr("class", "legendRects")
            .attr("x", 250)
            .attr("y", function(d, i){ return height - ((3-i)*ls_h) - 2*ls_h - 5;})
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function(d, i) { return legend_colors[i]; })
            .style("opacity", 1.0);

        legend.append("text")
            .attr("class", "legendRectsText")
            .attr("x", 280)
            .attr("y", function(d, i){ return height - ((3-i)*ls_h) - ls_h - 9;})
            .style("fill", "#333333")
            .html(function(d, i){ return legend_labels[i]; })

    }

    // Zoom and panning
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    function calcLegend() {

        legendDomain = [];

        var category = $("#chooseCategory").text().trim();
        
        var lowLevel = boundaries[category][0];
        var highLevel = boundaries[category][1];

        levelWidth = (highLevel - lowLevel)/colors.length;

        var value = lowLevel;
        while (value <= highLevel) {
            legendDomain.push(value);
            value += levelWidth;
        }

    }

    function quantize(d) {

        var category = $("#chooseCategory").text().trim();
        
        var lowLevel = boundaries[category][0];
        var highLevel = boundaries[category][1];

        levelWidth = (highLevel - lowLevel)/colors.length;

        var counter = 0;
        var value = crimeData[d.properties.name][category]['helår /100000'];

        while(lowLevel + (counter * levelWidth) < value && counter < colors.length - 1)
            ++counter;
        
        return counter;

	}

    this.markMun = function(value) {

        var clusterValMonth = $('#clusterbtn_stream').bootstrapSwitch('state');

        if (clusterValMonth) {
            var kommun = chosen_mun;//$("#searchBox").attr("placeholder");
            d3.select("#map").selectAll("path")
                .style("fill", function(d,i) {
                    var color = "#444";
        
                    if (stream_clusters[kommun] != undefined) {
                        for (var i = 0; i < stream_clusters[kommun].length; ++i) {
                            if (stream_clusters[kommun][i] == d.properties.name)
                                color = "#66bd63";
                        }
                    }

                    if (kommun == d.properties.name) {
                        color = "#006837";
                    } 

                    return color;
                });

            drawClusterMonthLegend();
        }
        else {
            d3.select("#map").selectAll("path").transition().duration(100)
                

                .style('fill', function(d) {
                    if (d.properties.name == value)
                        return "#f00";
                    else if (value == "Hela landet")
                        return "#f00";
                    else
                        return "#444";
                });
        }

        infoText.html(value);

    };

    this.reColor = function() {
        if ($('#clusterbtn').bootstrapSwitch('state')) {
            var col = parallelCoords1.getColors();
            d3.select("#map").selectAll("path")
                .transition().duration(500)
                .style("fill", function(d,i) {
                    return col[clusters[i]];
                });

            drawClusterLegend($("#chooseClusters").text());
        }
    }

    function markOtherViews(value)
    {
        streamGraph.markMunicipality(value);
        parallelCoords1.markLine(value);
    }

    $(document).ready(function(){

        $("#mapID").click(function(e) {

            if(e.target.parentElement.id !== "g_mapID") {

                var clusterVal = $('#clusterbtn').bootstrapSwitch('state');
                var clusterValMonth = $('#clusterbtn_stream').bootstrapSwitch('state');

                if (clusterVal) {
                    var col = parallelCoords1.getColors();
                    d3.select("#map").selectAll("path")
                        .style("fill", function(d,i) {
                            return col[clusters[i]];
                        });
                }
                else if (clusterValMonth) {
                    var kommun = chosen_mun;//$("#searchBox").attr("placeholder");
                    d3.select("#map").selectAll("path")
                        .style("fill", function(d,i) {
                            var color = "#444";
                            
                            if (stream_clusters[kommun] != undefined) {
                                for (var i = 0; i < stream_clusters[kommun].length; ++i) {
                                    if (stream_clusters[kommun][i] == d.properties.name)
                                        color = "#66bd63";
                                }
                            }

                            if (kommun == d.properties.name) {
                                color = "#006837";
                            } 

                            return color;
                        });
                }
                else {
                    d3.select("#map").selectAll("path")
                        .style("fill", function(d,i) {
                            return colors[quantize(d)];
                        });
                }
                
            }
        });

        $("#clusterbtn").bootstrapSwitch();
        $('#clusterbtn').bootstrapSwitch('state', false);
        $("#clusterbtn_stream").bootstrapSwitch();
        $('#clusterbtn_stream').bootstrapSwitch('state', false);

        $('#clusterbtn').on('switchChange', function (e, data) {
            var $element = $(data.el),
            value = data.value;

            var col = parallelCoords1.getColors();
            
            if (value) {
                d3.select("#map").selectAll("path")
                    .transition().duration(500)
                    .style("fill", function(d,i) {
                        return col[clusters[i]];
                    });

                drawClusterLegend($("#chooseClusters").text());
            }
            else {
                d3.select("#map").selectAll("path")
                    .transition().duration(500)
                    .style("fill", function(d,i) {
                        return colors[quantize(d)];
                    });

                drawOriginalLegend();
            }
        });

        $('#clusterbtn_stream').on('switchChange', function (e, data) {
            var $element = $(data.el),
            value = data.value;

            if (value) {
                var kommun = chosen_mun;//$("#searchBox").attr("placeholder");

                d3.select("#map").selectAll("path")
                    .transition().duration(500)
                    .style("fill", function(d,i) {
                        var color = "#444";
                        
                        if (stream_clusters[kommun] != undefined) {
                            for (var i = 0; i < stream_clusters[kommun].length; ++i) {
                                if (stream_clusters[kommun][i] == d.properties.name)
                                    color = "#66bd63";
                            }
                        }

                        if (kommun == d.properties.name) {
                            color = "#006837";
                        } 

                        return color;
                    });

                drawClusterMonthLegend();
            }
            else {
                d3.select("#map").selectAll("path")
                    .transition().duration(500)
                    .style("fill", function(d,i) {
                        return colors[quantize(d)];
                    });

                drawOriginalLegend();
            }
        });


        $(".crimeCategory").click(function(e){

            var category = $(this).text();
            $("#chooseCategory").text(category); 

            $("#crimeType").html(category);

            drawOriginalLegend();

            d3.select("#map").selectAll("path").transition().duration(300).style("fill", function(d,i) {
                return colors[quantize(d)];
            });

            $('#clusterbtn').bootstrapSwitch('state', false);
            $('#clusterbtn_stream').bootstrapSwitch('state', false);

        });


    });










}