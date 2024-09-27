// create a map object
let myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5
  });

// Adding the base map 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// create the URL for the geojson
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// retrieve the data using  D3
d3.json(geoData).then(function(data){
    
    for (let i = 0; i < data.features.length; i++){

        // retrive the coordinates for markers
        coords = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]
        
        //retrieve the color used for each marker
        let color = '';
        let depth = data.features[i].geometry.coordinates[2];
        switch(true){
            case (depth > -10 && depth < 10):
                color = 'rgb(19, 235, 45)'
                break;
            case (depth >= 10 && depth < 30):
                color = 'rgb(138, 206, 0)'
                break;
            case (depth >= 30 && depth < 50):
                color = 'rgb(186, 174, 0)'
                break;
            case (depth >= 50 && depth < 70):
                color = 'rgb(218, 136, 0)'
                break;
            case ( depth >= 70 && depth < 90):
                color = 'rgb(237, 91, 0)'
                break;
            case (depth >= 90):
                color = 'rgb(242, 24, 31)'
                break;
        }

        // create the variables for popup
        let date = moment(data.features[i].properties.time).format('MMMM Do YYYY')
        let time =  moment(data.features[i].properties.time).format('h:mm:ss a')
        let loc = data.features[i].properties.place
        let mag = data.features[i].properties.mag

        L.circle(coords, {
            opacity: .5,
            fillOpacity: 0.75,
            weight: .5,
            color: 'black',
            fillColor: color,
            radius: 7000 * data.features[i].properties.mag
            
    }).bindPopup(`<p align = "left"> <strong>Date:</strong> ${date} <br> <strong>Time:</strong>${time} <br>
     <strong>Location:</strong> ${loc} <br> <strong>Magnitude:</strong> ${mag} </p>`).addTo(myMap)

    newMarker = L.layer
}});

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (){
    let div = L.DomUtil.create('div', 'info legend');
    let grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    let colors = [
        'rgb(19, 235, 45)',
        'rgb(138, 206, 0)',
        'rgb(186, 174, 0)',
        'rgb(218, 136, 0)',
        'rgb(237, 91, 0)',
        'rgb(242, 24, 31)'
        ];
    let labels = [];

    grades.forEach(function(grade, index){
        labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 20px"+ "; height: 15px" + "\"></li>" + "<li>" + grade + "</li></div>");
    })
  
    div.innerHTML += "<ul>" + labels.join("") +"</ul>";
    return div;
};

legend.addTo(myMap);