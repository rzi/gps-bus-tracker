<?php

//Access-Control-Allow-Origin header with wildcard.
header('Access-Control-Allow-Origin: *');

function connection() {
global $link;
$link = mysqli_connect("pi.cba.pl", "Bazapi2019", "Bazapi2019", "elunch_1");
    if (!mysqli_set_charset($link, "utf8")) {
        printf("Error loading character set utf8: %s\n", mysqli_error($link));
        exit();
    } else {
       // printf("Current character set: %s\n",
        mysqli_character_set_name($link);
    }
    if (!$link) {
        echo "Error: Unable to connect to MySQL." . PHP_EOL;
        echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
        echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit; echo '<br><BR>Poprawne połączenie z bazą danych<BR>';
    }
// echo "Host information: " . mysqli_get_host_info($link) . PHP_EOL;
}

connection();
$my_date = date("Y-m-d");  
$my_time = $_GET["time"];
$lat = $_GET["lat"];
$longitude = $_GET["longitude"];
$s = $_GET["s"];
$idName =$_GET["idName"];
$idIndex =$_GET["idIndex"];

if ($my_time){
	mysqli_query($link,"INSERT INTO maps_records (time, lat,longitude, s,idName, idIndex)
		VALUES ('$my_time','$lat','$longitude','$s','$idName','$idIndex')");

	// Print auto-generated id
	//echo "Nowy rekord ma id: " . mysqli_insert_id($link);
	echo 'ok';
}
//$success = success
// Encoding array in JSON format
//header('Content-Type: application/json');
//echo json_encode($success);

?>
