<!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="en"> <!--<![endif]-->
<head>

	<!-- Basic Page Needs
  ================================================== -->
	<meta charset="utf-8">
	<title>Simon Bergström</title>
	<meta name="description" content="portfolio">
	<meta name="author" content="Simon Bergström">

	<!-- Mobile Specific Metas
  ================================================== -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

	<!-- CSS
  ================================================== -->

	<link rel="stylesheet" href="stylesheets/base.css">
	<link rel="stylesheet" href="stylesheets/skeleton.css">
	<link rel="stylesheet" href="stylesheets/layout.css">


	<!--[if lt IE 9]>
		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

	<!-- Favicons
	================================================== -->
	<link rel="shortcut icon" href="images/icons/apple-touch-icon.png">
	<link rel="apple-touch-icon" href="images/icons/apple-touch-icon.png">
	<link rel="apple-touch-icon" sizes="72x72" href="images/icons/apple-touch-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="114x114" href="images/icons/apple-touch-icon-114x114.png">

	<script src = "http://code.jquery.com/jquery-latest.min.js"></script>

</head>
<body>



	<!-- Primary Page Layout
	================================================== -->
	<!-- Delete everything in this .container and get started on your own site! -->

	<div class="container">
	<header>
		 <div class="sixteen columns">
			<h1 class="remove-bottom" style="margin-top: 40px">Simon Bergström</h1>
			<h5 style = "display: inline;">Min portfolio</h5>

			
			<nav id="navigation">
				
				<ul>
					<li> <a href ="index.html">Hem </a> </li>
					<li> <a href ="projects.html">Projekt </a> </li>
					<li> <a href ="reports/CV/Simon_Bergstrom_CV.pdf">CV </a> </li>
					<li> <a href='others.html'> Övrigt </a></li> 
					<li class="selected"> <a href ="#">Kontakt </a> </li>
				</ul>
			</nav>
			<hr />

			
			<div id="mobile-menu">
			<!-- MOBIL MENYN -->
			<button class="burger"></button>

			</div>
			<div id='box'>
				<ul>
					<li> <a href='index.html'> Hem </a></li> 
					<li> <a href='projects.html'> Projekt </a></li> 
					<li> <a href ="reports/CV/Simon_Bergstrom_CV.pdf">CV </a> </li>
					<li> <a href='others.html'> Övrigt </a></li> 
					<li class="selected"> <a href='#'> Kontakt </a></li> 
				</ul>
			</div>			
		</div>
	</header>

	<div class="two-thirds column">

	<h3>Kontakt</h3>
	

<?php
// display form if user has not clicked submit

	if (!isset($_POST["submitbtn"]))
	  { 
?>			
		<form method="post">
			  <!-- Label and text input -->
			  <label>Namn:</label>
			  <input type="text" name="name"/>

			  <label>Din E-mail</label>
			  <input type="email" name="email"/>
			 
			  <!-- Label and textarea -->
			  <label>Meddelande:</label>
			  <textarea name="txtArea"></textarea>
			
			  <input type="submit" name="submitbtn"/>
	 
		</form>

		<?php 

		  }

		else
		  // the user has submitted the form
		  {

		  	error_reporting(E_ALL);
		  	require_once 'vendor/Swift/lib/swift_required.php';

		// Create the Transport
		$transport = Swift_SmtpTransport::newInstance('smtp.gmail.com',465,'ssl')
		  ->setUsername('simbe109@gmail.com')
		  ->setPassword('Simbe673.')
		  ;

		  // Check if the "from" input field is filled out
		  if (isset($_POST["email"],$_POST["name"],$_POST["txtArea"]) )
		    {

		    	$mail = $_POST["email"]; $name = $_POST["name"]; $txt = $_POST["txtArea"];
			    /*
				You could alternatively use a different transport such as Sendmail or Mail:

				// Sendmail */
				$transport = Swift_SendmailTransport::newInstance('/usr/sbin/sendmail -t -i');

				// Mail		
				//$transport = Swift_MailTransport::newInstance(); 
				
				// Create the Mailer using your created Transport
				$mailer = Swift_Mailer::newInstance($transport);

				// Create a message
				$message = Swift_Message::newInstance('Någon kontaktar dig från din hemsida!')
				  ->setFrom(array($mail => $name))
				  ->setTo(array('simbe109@student.liu.se' => 'Simon'))
				  ->setBody($txt)
				  ;

				// Send the message
				if (!$mailer->send($message, $failures)) {
				  echo "<p class='msg'>Felmeddelande: </p>";
				  print_r($failures);
				} else {
				    echo "<p class='msg'>Mail skickat!</p>";
				}
		    }	
		  }
		?>

		</div>

		<div class="one-third column">
			<div id="contactinfo">
				<h3> Annars kontakta mig på:</h3>
					<ul> <li> simbe109@gmail.com </li>
						 <li> 076-1422187 </li>
					</ul>	 
			</div>
		</div>

		<script type = "text/javascript">

			$(document).ready(function()
			{

				var container = $("#box");
				container.hide();

				$("button").click( function(){
					container.toggle();
				});
			});

		</script>

		<div id="footer"> 
			<ul>	
				<li><a href="http://www.facebook.com/simbe109"><img src="images/icons/fbicon.jpg" alt="Smiley face" height="42" width="42"></a> </li>
				<li><a href="http://www.twitter.com/simbe109"><img src="images/icons/twicon.png" alt="Smiley face" height="42" width="42"></a> </li>
				<li><a href="http://www.linkedin.com/profile/view?id=191431903&amp;trk=nav_responsive_tab_profile"><img src="images/icons/lkicon.png" alt="Smiley face" height="42" width="42"></a> </li>
			</ul>
		</div>

	</div><!-- container -->

<!-- End Document
================================================== -->
</body>
</html>