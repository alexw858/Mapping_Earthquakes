// Full week data makes page unresponsive; too much data to handle
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);
// Testing speed using downloaded geoJson file
// d3.json("data/all_week.geojson", createMarkers);
// d3.json("data/all_day.geojson", createMarkers);


function createMarkers(response) {
    console.log("response = ", response);
    function onEachFeature(feature, layer) {
        var title = feature.properties.title;
        var magnitude = feature.properties.mag;
        layer.bindPopup("<h3>" + title + "</h3><hr><p> Magnitude: " + magnitude + "</p>");
    }

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag), 
            color: "#000000", 
            radius: getRadius(feature.properties.mag), 
            stroke: true, 
            weight: 0.5
        };
    }

    function getColor(magnitude) {
        // var magnitude = feature.properties.mag;
        if (magnitude > 5) {
            return "red";
        }
        else if (magnitude > 4) {
            return "orange";
        }
        else if (magnitude > 3) {
            return "yellow";
        }
        else if (magnitude > 2) {
            return "green";
        }
        else if (magnitude > 1) {
            return "blue";
        }
        else {
            return "white";
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

    var earthquakes = L.geoJSON(response, {
        style: styleInfo, 
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng)
        },
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
}

function createMap(locations) {
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
        "Earthquake Locations": locations
    };
    var map = L.map("mapid", {
        center:[37.09, -95.71], 
        zoom: 4, 
        layers: [streetMap, locations]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}