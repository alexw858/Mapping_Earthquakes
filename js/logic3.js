// Full week data makes page unresponsive; too much data to handle
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);
// Testing speed using downloaded geoJson file
// d3.json("data/all_week.geojson", createMarkers);
// d3.json("data/all_day.geojson", createMarkers);


function createMarkers(response) {
    console.log("response = ", response);
    // this part is created later, 
    // function onEachFeature(feature, layer) {
    //     var title = feature.properties.title;
    //     var magnitude = feature.properties.mag;
    //     layer.bindPopup("<h3>" + title + "</h3><hr><p> Magnitude: " + magnitude + "</p>");
    // }

// this magnitude is 
    function getColor(magnitude) {
        
        if (magnitude > 5) {
            return "red";
        }
        else if (magnitude > 4) {
            return "green"
        }
        else  if (magnitude >3) {
            return "white"
        }
        else {
            return "blue"
        }
    }

    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        else {
            return magnitude * 4;
        }
    }
// geoJSON auto-creates variables feature and latlng which can be accessed directly inside of my functions without referencing them myself (may be more)
    var earthquakes = L.geoJSON(response, {
        style: function(feature) {
            var magnitude = feature.properties.mag;
            return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: getColor(magnitude), 
                color: "#000000", 
                radius: getRadius(magnitude), 
                stroke: true, 
                weight: 0.5
            };
        }, 
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng);
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p> Magnitude: " + feature.properties.mag + "</p>");
        }
    }).addTo(earthquakes);
    earthquakes.addTo(map);
    // createMap(earthquakes);
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
      // Adding our geoJSON data, along with style information, to the tectonicplates
      // layer.
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);
  
      // Then add the tectonicplates layer to the map.
      tectonicplates.addTo(map);

    })
}

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        accessToken: 'pk.eyJ1IjoiYWxleHc4NTgiLCJhIjoiY2ppZHY5Y3k3MDJ3MjNrbXc3c3g5Z2dzeSJ9.8I2wrPN9T9Otrtj92m6kbg',
        id: 'mapbox.streets',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    });

    var baseMaps = {
        "Street Map": streetMap
    };
    var overlayMaps = {
        "Earthquake Locations": locations  //change locations to earthquakes
    };
    var map = L.map("mapid", {
        center:[37.09, -95.71], 
        zoom: 4, 
        layers: [streetMap, locations]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

     // Here we make an AJAX call to get our Tectonic Plate geoJSON data.



// Add CommentCollapse 