<?php
ini_set('memory_limit', '-1');  // we're going to use a lot!

// get the Postcode list
echo "Loading postcodes\r\n";
$postcodes = array_map( 'str_getcsv', file( 'au_postcodes.csv' ) );
// Internal format of this file is:
// Col 0: postcode
// Col 1: name
// Col 3: state
// Cols 4&5 : lat/long

// now get the GeoJSON
echo "Load GeoJSON\r\n";
$jsonfile = file_get_contents('POA_2021_AUST_GDA2020_15percent.json');
$geojson = json_decode($jsonfile, true);

// loop through, extracting the valid features (Polygon or MultiPolygon)
// clean properties (names, remove what we don't want, add data from PostCode CSV)
echo "Process GeoJSON - clean, and add postcodes\r\n";
$features = $geojson["features"];
$clean_features=[];
for ($i=0; $i < sizeof($features); $i++) {
    if (isset($features[$i]["geometry"]["type"]) && ($features[$i]["geometry"]["type"] == "Polygon" or $features[$i]["geometry"]["type"] == "MultiPolygon")) {
        $postname = "";
        $pi=0;
        while ( $pi < sizeof($postcodes)) {
            if ($postcodes[$pi][0] == $features[$i]["properties"]["POA_CODE21"]) {
                $postname .= $postcodes[$pi][1] . " (".$postcodes[$pi][3].")<br>";
            }
            $pi++;
        }
        if ($postname == "") {
            echo "Postcode not found " . $features[$i]["properties"]["POA_NAME21"] . "\r\n";
        }
        $prop = ["name"=>$postname, "postcode"=>$features[$i]["properties"]["POA_CODE21"]];
        $new = ["type"=>$features[$i]["type"],"geometry"=>$features[$i]["geometry"],"properties"=>$prop];
        array_push($clean_features,$new);
    }
}

$updated = [
    "type"=> "FeatureCollection",
    "features"=> $clean_features // note features has to be an array
];

  file_put_contents("map.json", json_encode($updated,true) );
?>