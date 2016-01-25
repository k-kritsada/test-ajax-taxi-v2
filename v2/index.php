<!DOCTYPE html>
<html>
	<head>
	  <meta charset="utf-8">
	  <title>TAXIMAIL AJAX V2</title>
	  <link rel="stylesheet" href="../v2/js/qunit-1.20.0.css">
	</head>
	<body>
		<?php 
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
		header('Access-Control-Max-Age: 1000');
		?>
		<div id="qunit"></div>
		<div id="qunit-fixture"></div>
		<script src="../v2/js/qunit-1.20.0.js"></script>
		<script src="../v2/js/jquery-1.11.3.js"></script>
		<script src="tests_v2.js"></script>
	</body>
</html>