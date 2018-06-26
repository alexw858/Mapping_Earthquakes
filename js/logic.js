d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);

function createMarkers(response) {
    console.log(response);
    // console.log(response.features[0].geometry.coordinates)
    var features = response.features;
    var quakeMarkers = [];
    for (var i = 0; i < features.length; i++) {
        // coord contains [lat, lon, elevation]
        var coord = features[i].geometry.coordinates;
        var title = features[i].properties.title
        // console.log("coord = ", coord);
        var quakeMarker = L.marker([coord[0], coord[1]])
        .bindPopup("<h3>" + title + "/h3");
        // console.log("quakeMarker = ", quakeMarker);
        quakeMarkers.push(quakeMarker);
    }
    console.log("quakeMarkers = ", quakeMarkers);
    createMap(L.layerGroup(quakeMarkers));
}

function createMap(locations) {
    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        accessToken: 'pk.eyJ1IjoiYWxleHc4NTgiLCJhIjoiY2ppZHY5Y3k3MDJ3MjNrbXc3c3g5Z2dzeSJ9.8I2wrPN9T9Otrtj92m6kbg',
        id: 'mapbox.streets',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    });

    var baseMaps = {
        "Light Map": streetMap
    };
    var overlayMaps = {
        "Earthquake Locations": locations
    };
    var map = L.map("mapid", {
        center:[37.09, -95.71], 
        zoom: 6, 
        layers: [streetMap, locations]
    });

    console.log(map)

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}