var chosen_mun = null;

function StreamGraph(){

	var self = this; // for internal d3 functions

	var municipalities = new Array();

	d3.csv("data/crime_monthly_municipatalities_2013.csv", function(csv) {

	    for (var i = 0; i < csv.length; i+=10) 
	    {    
	        var crimeType = {};
	        for (var j = 0; j < 10; j++) 
	        {        
	            var kommun = csv[i+j]['kommun'];        
	        }
	        municipalities.push(kommun);   
	    }
	});	

	var x,y;

	var kommunToStack = "Hela landet";
	var kategori = ["Våldsbrott","Hot- kränknings- och frihetsbrott","Vårdslöshet- och vållandebrott","Stöldbrott","Bilbrott","Skadegörelsebrott","Vissa trafikbrott","Alkohol- och narkotikabrott","Vapenbrott"];
	var month = ["januari /100000","februari /100000","mars /100000","april /100000","maj /100000","juni /100000","juli /100000","augusti /100000","september /100000","oktober /100000","november /100000", "december /100000"];

	var colors = [ "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"];
	var stroke_colors = [ "#560000", "#750000", "#7E2F00", "#7F610C", "#808040", "#677619", "#2C5E25", "#004326", "#00093E"];

	var layers1,stack;

	var padding = 1100; // pad the plot on the Y-Axis... 

    var streamGraphDiv = $("#streamGraph");

    var margin = {top: 20, right: 20, bottom: 30, left: 33},
        width = streamGraphDiv.width() - margin.right - margin.left,
        height = streamGraphDiv.height() - margin.top - margin.bottom;

   	//Månader samt spridning 
    var months = ["Jan","Feb","Mars","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    var diverse = [0,1*width/11, 2*width/11,3*width/11,4*width/11,5*width/11,6*width/11,7*width/11,8*width/11,9*width/11,10*width/11,width];


    var area;
	var svg = d3.select("#streamGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height+ margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (-10) + ")");    
   
    /********* Ladda in data **********/
	d3.json("data/crime_monthly_municipatalities_2013.json", function(json) {

		self.data = json;

	    var crimeDataJson = [];

	    var crimeDataJsonStream = layering(json,kommunToStack);

	    stack = d3.layout.stack().offset("wiggle");
	    //stack = d3.layout.stack().offset("sillhouette");

    	layers1 = stack(crimeDataJsonStream);


	    draw();
	});
	

	function draw()
	{
		svg.selectAll("area").remove();
        svg.selectAll(".axis").remove();
        svg.selectAll("path").remove();
        d3.selectAll(".remove").remove();


    /********* Tooltip ***********/
	    var tooltip = d3.select("body").append("div").attr("class","tooltip").style("opacity",0);

	    //X-axel
		var x = d3.scale.ordinal()
		    .domain(months)
		    .range(diverse);    

		//Y-axel
		var y = d3.scale.linear()
		    .domain([0, d3.max(layers1, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y + Math.abs(padding) ; }); })])
		    .range([height, 0]);

		// Färg på plotten
		var color = d3.scale.category20b(); // Används ej

		// Create the axis..
		var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	    var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");
	  
	    var yAxisr = d3.svg.axis()
	    .scale(y)
	    .orient("right");

	      //Ta bort skala på Y-axel...
	    yAxisr.tickFormat("");
	    yAxis.tickFormat("");

	    // Definera arean på datan som ska representeras
		area = d3.svg.area()
			.interpolate("cardinal")
		    .x(function(d) { return x(d.x); })
		    .y0(function(d) { return y(d.y0); })
		    .y1(function(d) { return y(d.y0 + d.y); });
	 


		svg.selectAll("path")
		    .data(layers1)		  	
		  	.enter().append("path")
		    .attr("d", area)
		    .attr("transform", "translate(0,-30)")
		    .style("fill", function(p, i) { return colors[i]; })
		    .style("stroke", function(p, i) { return stroke_colors[i]; })
		    .style("stroke-opacity", 0.0 )
		    .style("stroke-width", 2.0 )

		/***** Tool tip *********/

	        .on("mousemove", function(d, i) {

	    		d3.select("#streamGraph").selectAll("path")
    				.transition().duration(100)
    				.style("fill-opacity", 0.4)
    				.style("stroke-opacity", function(d,i) {
    					if(i < 9) 
    						return 0.0;
    				});

    			d3.select(this)
    				.transition().duration(100)
    				.style("fill-opacity", 1.0)
    				.style("stroke-opacity", 1.0);

    			mousex = d3.mouse(this);
      			mousex = mousex[0];
      			var countX=0;

      			mousex=mousex+5; //Compensate for the vertline line is 5 px padded from mousepointer...

      			countX = Math.round(mousex/67);	

		    	tooltip.transition()
			        .duration(200)
			        .style("opacity", .9);
			    	tooltip.html(kategori[i] + ":" + d[countX].y + "st")
			        .style("left", (d3.event.pageX + 5) + "px")
			        .style("top", (d3.event.pageY - 28) + "px");

		    })
		    .on("mouseout", function(d) {

		        //d3.select(this).transition().duration(100)
    			//	.style({ 'fill-opacity':1.0,'stroke-opacity':0.0});

    			d3.select("#streamGraph").selectAll("path")
    				.transition().duration(100)
    				.style("fill-opacity", 1.0)
    				.style("stroke-opacity", function(d,i) {
    					if(i < 9)  
    						return 0.0;
    				});

		        tooltip.transition()
			       .duration(500)
			       .style("opacity", 0);  

		    })
		    .on("click",  function(d) {

	            //var dt = this;
	            //d3.select("#streamGraph").selectAll("path").style("opacity",function(z){ return this == dt ? null: 0.6;} );
	        });



	    // Add x axis and title.
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis)
	        .append("text")
	        .attr("class", "label")
	        .attr("x", width)
	        .attr("y", -6).text("Månad").attr("transform","translate(-50,0)");
	        
	    // Add y axis and title.
	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis)
	        .append("text")
	        .attr("class", "label")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 6)
	        .attr("dy", ".71em").text("Brottskategorier").attr("transform","translate(-25,190)rotate(-90)");  

	    // Other y axis
	    svg.append("g")
	        .attr("class", "y axis r")
	        .attr("transform","translate(" + width + ",0)")
	        .style("stroke-width", 1.0 )
	        .call(yAxisr)
	        .append("text")
	        .attr("class", "label")
	        .attr("transform", "rotate(-90)translate(10,-20)")
	        .attr("y", 6);




		/****Vertical axis tool *********/    
		var vertical = d3.select("#streamGraph")
		        .append("div")
		        .attr("class", "remove")
		        .style("position", "absolute")
		        .style("z-index", "19")
		        .style("width", "1px")
		        .style("height", "260px")
		        .style("top", "40px")
		        .style("bottom", "30px")
		        .style("left", "0px")
		        .style("visibility", "hidden")
		        .style("background", "#777");

		d3.select("#streamGraph")
		    .on("mousemove", function(){  
		        mousex = d3.mouse(this);
		        var mousey = mousex[1];
		        mousex = mousex[0] + 5;

		        vertical.style("left", mousex + "px" )
		        vertical.style("visibility", function() {
		    		if (mousex < margin.left || mousex > width+margin.left || mousey < 40 || mousey > 300)
		    			return "hidden";
		    		else
		    			return "visible"
		    	})

		    });
	}
	// Useful for transition? 
	function transition(layer2) {

		//X-axel
		var x = d3.scale.ordinal()
		    .domain(months)
		    .range(diverse);  

		var y = d3.scale.linear()
		    .domain([0, d3.max(layer2, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y + Math.abs(padding) ; }); })])
		    .range([height, 0]);

	    // Definera arean på datan som ska representeras
		area = d3.svg.area()
			.interpolate("cardinal")
		    .x(function(d) { return x(d.x); })
		    .y0(function(d) { return y(d.y0); })
		    .y1(function(d) { return y(d.y0 + d.y); });

		d3.selectAll("path")
			.data(function() {
				var d = layer2;
				layer2 = layers1;
				return layers1 = d;
			})
			.transition()
			.duration(1000)
			.attr("d", area);

	}

	// Form the data to fit to the stack operator to create a Stream... z=dataset, t=municipality
	function layering(z,t)
	{
		if(z[t] == undefined)
			return false;

		var result  = new Array();

		//x = position in x-direction, y0= baseposition i y-direction.(baseline), y = thickness of line
		var dataPoint = {};

		for(var i = 0; i < kategori.length; i++)
		{
			var tmp = [];
			for(var j=0; j< month.length; j++ )
			{
				tmp.push({"x" : j, "y" : +z[t][kategori[i]][month[j]]});
			}	
			result.push(tmp);
		}
		return result; 
	}


	//Marks the municipality in other views.
	function markOtherViews(value)
	{
		parallelCoords1.markLine(value);
		map.markMun(value);
	}

	//Load new data from search menu
    $(document).ready(function(){

		$("body").click (
			function(e) {
				if(e.target.id !== "searchResults" && e.target.id !== "searchBox") {
					$("#searchResults").hide();
				}
			}
		);

        $("#searchBox").on('input', function(){
   			var inputText = $(this).val();
   			
   			$("#errorMessage").fadeOut(300, function() {
				$(this).fadeOut(300);
			});

   			// Find municipality
   			$("#searchResults").html("");
   			
   			for(var i = 0; i < municipalities.length; i++)
   			{

   				var re = new RegExp(inputText, 'gi')
   				var test = municipalities[i].match(re);
   			
				if(test != null)
   				{
   					$("#searchResults").append("<div class='kommundiv'><a style='cursor:pointer;' class='kommun'>" + municipalities[i] + "</a></div>"); 
   				}	
   			}
   			$("#searchResults").fadeIn(300);

   			if(inputText == "")
   				$("#searchResults").fadeOut(300);


   			$(".kommun").click(function(){
   				$("#errorMessage").fadeOut(300, function() {
   					$(this).fadeOut(300);
   				});
	        	var text = $(this).text();
	        	$("#searchBox").val(text);
	        	$("#searchResults").fadeOut(300);
	        	$("#searchBox").focus();
			});
        });

        $("#searchBox").click( function() {
        	$("#searchBox").attr("placeholder", "");
        });

        $("#searchbtn").click( function() {

        	var searchtxt = $("#searchBox").val();

        	searchtxt = searchtxt.charAt(0).toUpperCase() + searchtxt.slice(1);

        	crimeDataJsonStream = layering(self.data, searchtxt);

        	if (!crimeDataJsonStream) {

        		$("#searchBox").val(searchtxt);
        		$("#errorMessage").hide().html("Kommunen finns ej!").fadeIn(300);
        	}
        	else {

        		$("#searchBox").val("");
        		$("#searchBox").attr("placeholder", searchtxt);
        		chosen_mun = searchtxt;

        		layers1 = stack(crimeDataJsonStream);

	        	markOtherViews(searchtxt); 

		        transition(layers1);

        	}
    	});

    	$('#searchBox').bind('keypress', function(e) {
    		if (e.keyCode == 13) {
    			$("#searchbtn").trigger("click");
    			$("#searchResults").fadeOut(300);
    			$("#searchBox").blur();
    		}
    	});

 	}); 

 	this.markMunicipality = function(value)
 	{
 		crimeDataJsonStream = layering(self.data, value);
 		layers1 = stack(crimeDataJsonStream);
 		$("#searchBox").attr("placeholder", value);
 		chosen_mun = value;
 		
 		transition(layers1);
 	}      

}
