let search = document.getElementById("search");
let searchLocation = document.getElementById("location");
let hotelLocations = document.getElementById("hotelLocations");
let locations = {}; 

search.addEventListener("click", () => {
    let searchLocationVal = searchLocation.value;

    fetch("/hotelsCoordinates?searchLocation=" + searchLocationVal).then((response) => {
        return response.json(); 
    }).then((body) => {
        let cities = body.suggestions[0].entities;

        for (i = 0; i < cities.length; i ++) {
            let city = [cities[i].caption, cities[i].latitude, cities[i].longitude];
            locations[cities[i].geoId] = city; 
        }

        generateLocations();
    }); 
});

function generateLocations() {
    if (hotelLocations.firstChild) {
        hotelLocations.firstChild.remove();
    }

    let hotelLocationSelect = document.createElement("select");
    hotelLocations.append(hotelLocationSelect);

    let genericOption = document.createElement("option");
    hotelLocationSelect.append(genericOption); 

    genericOption.textContent = "-- Select Location --";
    genericOption.setAttribute("disabled", true); 

    for (loc in locations) {
        let locationOption = document.createElement("option");
        hotelLocationSelect.append(locationOption);

        locationOption.insertAdjacentHTML('beforeend', locations[loc][0]);
        locationOption.setAttribute("id", loc);
    }

    hotelLocationSelect.addEventListener("change", () => {
        let options = hotelLocationSelect.options;
        fetchHotels(options[options.selectedIndex].id); 
    });
}

function fetchHotels(locationId) {

    fetch("/hotels?latitude=" + locations[locationId][1] + "&longitude=" + locations[locationId][2]).then((response) => {
        return response.json();
    }).then((body) => {
        console.log(body.searchResults);
        let hotelTableHead = document.getElementById("hotelHead");
        let hotelTableBody = document.getElementById("hotelBody");
        let searchResults = body.searchResults.results;

        for (i = 0; i < searchResults.length; i++) {
            let row = document.createElement("tr");
            hotelTableBody.append(row);

            let hotelName = document.createElement("td");
            let hotelAddress = document.createElement("td");
            hotelTableBody.append(hotelName);
            hotelTableBody.append(hotelAddress);

            hotelName.textContent = searchResults[i].name;
            hotelAddress.textContent = searchResults[i].address.streetAddress + ", " + searchResults[i].address.locality + " " + searchResults[i].address.region; 
        }
    });
}