d3.csv("data/crime_monthly_municipatalities_2013.csv", function(csv) {
//crimeData = data;

var crimeDataJson = {};

for (var i = 0; i < csv.length; i+=10) 
{


	for (var j = 0; j < 10; j++) 
	{

		var crimeType = {}

		crimeType['helår totalt'] = csv[i+j]['helår totalt'];
		crimeType['helår /100000'] = csv[i+j]['helår /100000'];
		crimeType['januari totalt'] = csv[i+j]['januari totalt'];
		crimeType['januari /100000'] = csv[i+j]['januari /100000'];
		crimeType['februari totalt'] = csv[i+j]['februari totalt'];
		crimeType['februari /100000'] = csv[i+j]['februari /100000'];
		crimeType['mars totalt'] = csv[i+j]['mars totalt'];
		crimeType['mars /100000'] = csv[i+j]['mars /100000'];
		crimeType['april totalt'] = csv[i+j]['april totalt'];
		crimeType['april /100000'] = csv[i+j]['april /100000'];
		crimeType['maj totalt'] = csv[i+j]['maj totalt'];
		crimeType['maj /100000'] = csv[i+j]['maj /100000'];
		crimeType['juni totalt'] = csv[i+j]['juni totalt'];
		crimeType['juni /100000'] = csv[i+j]['juni /100000'];
		crimeType['juli totalt'] = csv[i+j]['juli totalt'];
		crimeType['juli /100000'] = csv[i+j]['juli /100000'];
		crimeType['augusti totalt'] = csv[i+j]['augusti totalt'];
		crimeType['augusti /100000'] = csv[i+j]['augusti /100000'];
		crimeType['september totalt'] = csv[i+j]['september totalt'];
		crimeType['september /100000'] = csv[i+j]['september /100000'];
		crimeType['oktober totalt'] = csv[i+j]['oktober totalt'];
		crimeType['oktober /100000'] = csv[i+j]['oktober /100000'];
		crimeType['november totalt'] = csv[i+j]['november totalt'];
		crimeType['november /100000'] = csv[i+j]['november /100000'];
		crimeType['december totalt'] = csv[i+j]['december totalt'];
		crimeType['december /100000'] = csv[i+j]['december /100000'];

		kommun[csv[i+j]['typ']] = crimeType;

	}

	crimeDataJson[csv[i]['kommun']] = kommun;

}

console.log(JSON.stringify(crimeDataJson));

});