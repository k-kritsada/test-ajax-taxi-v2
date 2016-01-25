<?php 
set_time_limit(0);
ini_set('max_execution_time', 0);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Max-Age: 1000');

$url = $_POST['url'];
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_POST['method']);
curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($_POST));

$response = curl_exec($ch);

echo $response;

?>
