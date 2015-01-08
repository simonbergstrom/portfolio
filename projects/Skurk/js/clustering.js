

function pam(data, k) {

	var mediods = [];
	var clusters = [];
	var cost = [];
	var oldCost = null;
	var gogogo = true;

	// Step 1: Randomly select medoids centers of existing ugly data points
	for (var a = 0; a < k; ++a) {
		var randomPoint = Math.floor(Math.random() * (data.length - 1 - 0 + 1) + 0);
		
		var dataPoint = data[randomPoint];
		var mediodPoint = {};
		for (var key in dataPoint) {
			mediodPoint[key] = dataPoint[key];
		}

		mediods.push(mediodPoint);
	}


	do {

		gogogo = false;

		// Initialize cost, bring the ca$h
		cost = [];
		for (var e = 0; e < mediods.length; ++e)
			cost.push(0);

		// Step 2: Divide the god damn data points into awesome clusters depending on their eucledian distance
		for (var c = 0; c < data.length; ++c) {
			
			var closestPointPosition = 0;
			var closestPointValue = calculateDistance(data[c], mediods[0]);

			for (var d = 1; d < mediods.length; ++d) {
				var secondClosestPointValue = calculateDistance(data[c], mediods[d])
				if (closestPointValue > secondClosestPointValue) {
					closestPointValue = secondClosestPointValue;
					closestPointPosition = d;
				}
			}

			cost[closestPointPosition] += closestPointValue;
			clusters.push(closestPointPosition);
		}


		// Step 3: Find a new and better medoid for each cluster, if you find it, run motherfucking while-loop again.
		for (var f = 0; f < mediods.length; ++f) {
			var currentCost = cost[f];

			for (var g = 0; g < data.length; ++g) {
				if (f == clusters[g]) {
					var newCost = 0;
					var newMediodPoint = data[g];

					for (var h = 0; h < data.length; ++h) {
						var newDataPoint = data[h];
						if (newMediodPoint["kommun"] != newDataPoint["kommun"] && f == clusters[h]) {
							newCost += calculateDistance(newDataPoint, newMediodPoint)
						}
					}

					if (newCost < currentCost) {			
						mediods[f] = newMediodPoint;
						currentCost = newCost;
					}
				}
			}
		}

		var totalCost = 0;

		if (oldCost == null) {
			oldCost = cost;
			gogogo = true;
			for (var j = 0; j < cost.length; ++j)
				totalCost += cost[j];
		}
		else {
			for (var i = 0; i < cost.length; ++i) {
				totalCost += cost[i];
				if (oldCost[i] != cost[i]) {
					oldCost = cost;
					gogogo = true;
				}
			}
		}

		//console.log("OBS: DEN HÄR LOGGEN SKA VARA HÄR, INGEN FIKA FÖR GRABBARNA!");
		//console.log("PARALLEL COORDS CLUSTERING");
		//console.log("Total cost of clustering algorithm: " + totalCost);
		//console.log(" ");
		console.log("in first do while loop");
		
	} while(gogogo)

	return clusters;
}


function pam_2(data, k) {

	console.log("OBS: DE HÄR LOGGARNA SKA VARA HÄR, INGEN FIKA FÖR GRABBARNA!");

	var mediods = {};
	var clusters = {};
	var data_json = {};
	var gogogo = true;
	var oldCost = null;


	for (var v = 0; v < data.length/10; ++v) {
		var point = {};

		for (var key in data[v*10]) {
			var amount = key.substring(key.length-7,key.length);

			if (amount != " totalt" && amount != "i total" && key != "typ")
				point[key] = data[v*10][key];
		}

		data_json[data[v*10]["kommun"]] = point;
	}

	for (var a = 0; a < k; ++a) {
		var randomPoint = Math.floor(Math.random() * (data.length/10 - 1 - 0 + 1) + 0);
		
		var mediodPoint = {};
		var dataPoint = data[randomPoint*10];
		var kommun;

		for (var key in dataPoint) {
			var amount = key.substring(key.length-7,key.length);
			if (key == "kommun" && dataPoint[key] != "Hela landet")
				kommun = dataPoint[key];
			else if (amount != " totalt" && amount != "i total")
				mediodPoint[key] = dataPoint[key];

		}

		mediods[kommun] = mediodPoint;

	}

	do {

		gogogo = false;

		// Initialize cost, bring the ca$h
		cost = {};
		for (var key in mediods) {
			cost[key] = 0;
			clusters[key] = [];
		}
	
		for (var c = 0; c < data.length/10; ++c) {
			
			var closestPointPosition = "";
			var closestPointValue = 9999999;

			for (var key in mediods) {
				var secondClosestPointValue = calculateDistance_2(data[c*10], mediods[key])
				if (closestPointValue > secondClosestPointValue) {
					closestPointValue = secondClosestPointValue;
					closestPointPosition = key;
				}

			}

			cost[closestPointPosition] += closestPointValue;
			clusters[closestPointPosition].push(data[c*10]["kommun"]);
		}
		
		for (var key in mediods) {
			var currentCost = cost[key];
			var clusterPoint = clusters[key];
			var tempKey = key;

			for (var h = 0; h < clusterPoint.length; ++h) {
				var newCost = 0;
				var newMedPoint = data_json[clusterPoint[h]];

				for (var i = 0; i < clusterPoint.length; ++i) {
					var newDataPoint = data_json[clusterPoint[i]];
					if (clusterPoint[h] != clusterPoint[i]) {
						
						newCost += calculateDistance_2(newDataPoint, newMedPoint)
					}
				}

				if (newCost < currentCost) {
					mediods[clusterPoint[h]] = newMedPoint;
					delete mediods[tempKey];
					tempKey = clusterPoint[h];
					currentCost = newCost;
				}
			}

		}
		
		var totalCost = 0;

		if (oldCost == null) {
			oldCost = cost;
			gogogo = true;
			for (var key in cost)
				totalCost += cost[key];
		}
		else {
			for (var key in cost) {
				totalCost += cost[key];
				if (oldCost[key] != cost[key]) {
					oldCost = cost;
					gogogo = true;
				}
			}
		}
		
		//console.log("OBS: DEN HÄR LOGGEN SKA VARA HÄR, INGEN FIKA FÖR GRABBARNA!");
		//console.log("STREAM GRAPH CLUSTERING");
		//console.log("Total cost of clustering algorithm: " + totalCost);
		//console.log(" ");
		console.log("in second do while loop");

	} while(gogogo)

	var new_clusters = {};

	for (var key in clusters) {
		var cluster = clusters[key];

		for (var m = 0; m < cluster.length; ++m) {
			new_clusters[cluster[m]] = [];
			for (var n = 0; n < cluster.length; ++n) {
				new_clusters[cluster[m]].push(cluster[n]);
			}
		}
	}

	return new_clusters;

}


function calculateDistance(dataPoint, mediodPoint) {

	var distance = 0;
	for (var key in dataPoint) {
		if (key != "kommun") {
			//distance += Math.pow(calculateRelativeValue(key, mediodPoint[key]) - calculateRelativeValue(key, dataPoint[key]), 2);
			distance += Math.pow(mediodPoint[key] - dataPoint[key], 2);
		}
	}

	distance = parseInt(Math.sqrt(distance));
	
	return distance;
}

function calculateRelativeValue(key, value) {
	var difference = boundaries[key][1] - boundaries[key][0];
	var relativeValue = Math.round((value/difference) * 100);

	return relativeValue;
}

function calculateDistance_2(dataPoint, mediodPoint) {

	var distance = 0;
	for (var key in mediodPoint) {
		if (key != "typ" && key != "helår /100000" && key != "kommun") {
			distance += Math.pow(mediodPoint[key] - dataPoint[key], 2);
		}
	}

	distance = parseInt(Math.sqrt(distance));
	
	return distance;
}






