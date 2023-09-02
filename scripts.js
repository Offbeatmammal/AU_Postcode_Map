
(function() {

  var map = L.map('map', {
    attributionControl: false,
    preferCanvas: false,
  });
  // add the pane to show the labels
  map.createPane('labels')
  map.getPane('labels').style.zIndex = 650;
  map.getPane('labels').style.pointerEvents = 'none';
  
/*
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
*/
/*
var mapBase = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
        attribution: ''
}).addTo(map);
*/
var mapLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        attribution: '',
        pane: 'labels'
}).addTo(map);

  //$.getJSON("SAL_2021_AUST_GDA2020-5percent.json", function(data) {
  $.getJSON("map.json", function(data) {

    var info = L.control();

    info.update = function (props) {
      // called when mouse is over/leaves a postcode
      this._div.innerHTML = (props ? '<b>' + props['name'] + "<br>" + props['postcode'] + '</b>' : 'Hover over a Suburb');
    };

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };

    info.addTo(map);

    var fc2 = null
    
    // this block of code demonstrates using Turf to extract and show a sub-set of postcodes
    // uncomment this block to see it in action
    /*
    mergeList = ["2095","2094","2096","2099","2097"];
    zips = data.features.filter(f => mergeList.includes(f.properties.postcode))
 
		// do the union over each feature
		let union = zips[0];
		for (let i=1; i<zips.length; i++) {
		  union = turf.union(union, zips[i]);
    }
    union.properties["name"]="Beaches"
    union.properties["postcode"]=mergeList.join()

    mergeList = ["2075","2085"];
    zips = data.features.filter(f => mergeList.includes(f.properties.postcode))
 
		// do the union over each feature
		let union2 = zips[0];
		for (let i=1; i<zips.length; i++) {
		  union2 = turf.union(union2, zips[i]);
    }
    union2.properties["name"]="Suburbs"
    union2.properties["postcode"]=mergeList.join()

    fc2 = {
      "type": "FeatureCollection",
      "features": [union,union2] // note features has to be an array
    }
    */

    // if fc2 is null (not demonstrating filter) show all data, else show fc2 subset
    var geojson = L.geoJson(fc2==null?data:fc2, {
      style: function (feature) {
        return {
          color: getRandomRgb(),
          weight: 0.2,
          fillOpacity: 0.2
        };
      },
      onEachFeature: function (feature, layer) {
        layer
          .on('mouseover', function(e) {
            layer.setStyle({
              weight: 4,
              fillOpacity: 0.8
            });
            info.update(layer.feature.properties);
          })
          .on('mouseout', function(e) {
            geojson.resetStyle(layer);
            info.update();
          })
      }
    })

    geojson.addTo(map);
    var bounds = geojson.getBounds();

    map.fitBounds(bounds);
    map.setMaxBounds(bounds)

    map.options.maxBounds = bounds;
    map.options.minZoom = map.getZoom();
  });

})();

function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = num >> 8 & 255;
  var b = num & 255;
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}
