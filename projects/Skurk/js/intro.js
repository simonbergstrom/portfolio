$( document ).ready(function() {
  	
	//$("#intro").hide();

  	//Commented only for developing mode
  	var x = getCookie("showed");

  	if (x == "yes") {
  		$("#intro").css("display", "none");
  	}
  	else {
  		// Application initalization
		$("#main, #footer").css("visibility", "hidden");
  	}

	$( "#startButton" ).click(function() {
	  
		$( "#intro" ).fadeOut( "slow", function() {
			$("#main, #footer").css({
				opacity: 0.0, 
				visibility: "visible"
			})
			.animate({
				opacity: 1.0
			}, 1000);

			document.cookie="showed=yes";
		});
	});


  	$('#aboutLink').click( function() {
  		$("#main, #footer").css({
			opacity: 1.0, 
		})
		.animate({
			opacity: 0.0
		}, 1000, function() {
			$("#main, #footer").css({
				visibility: "hidden"
			});
			$( "#intro" ).fadeIn( "slow");
		});
  	});

	
	function getCookie(cname)
	{
		var name = cname + "=";
		var ca = document.cookie.split(';');

		for(var i=0; i<ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name)==0)
				return c.substring(name.length,c.length);
		}
		return "";
	}
	
});

