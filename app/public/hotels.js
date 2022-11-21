let search = document.getElementById("submitSearchButton");
let searchLocation = document.getElementById("location");
let hotelLocations = document.getElementById("hotelLocations");
let hotelTableBody = document.getElementById("hotelBody");
let locations = {}; 

const states = {
    alabama: "AL",
    alaska: "AK",
    arizona: "AZ",
    arkansas: "AR",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL", 
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA", 
    michigan: "MI", 
    minnesota: "MN",
    mississippi: "MS", 
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    new_hampshire: "NH",
    new_jersey: "NJ",
    new_mexico: "NM",
    new_york: "NY",
    north_carolina: "NC",
    north_dakota: "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    rhode_island: "RI",
    south_carolina: "SC",
    south_dakota: "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    washington: "WA",
    west_virginia: "WV",
    wisconsin: "WI",
    wyoming: "WY"
};

search.addEventListener("click", () => {
    let searchLocationVal = searchLocation.value;

    fetch("/hotelsCoordinates?searchLocation=" + searchLocationVal).then((response) => {
        return response.json(); 
    }).then((body) => {
        let cities = body.suggestions[0].entities;

        for (let i = 0; i < cities.length; i ++) {
            let city = [cities[i].caption, cities[i].latitude, cities[i].longitude];
            locations[cities[i].geoId] = city; 
        }

        generateLocations();
    }); 
});

function formatStateName(name) {
    name = name.toLowerCase().replace(" ", "_");
    return name;
}

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

    for (let loc in locations) {
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

        let searchResults = body.searchResults.results;

        console.log(hotelTableBody.rows.length);

        while (hotelTableBody.rows.length > 0) {
            console.log("delete");
            hotelTableBody.deleteRow(0);
        }

        for (let i = 0; i < searchResults.length; i++) {
            let row = document.createElement("tr");
            hotelTableBody.append(row);

            let hotelName = document.createElement("td");
            let hotelAddress = document.createElement("td");
            let hotelPrice = document.createElement("td");
            row.append(hotelName);
            row.append(hotelAddress);
            row.append(hotelPrice);

            hotelName.textContent = searchResults[i].name;
            hotelAddress.textContent = searchResults[i].address.streetAddress + ", " + searchResults[i].address.locality + " " + searchResults[i].address.region; 
            hotelPrice.textContent = searchResults[i].ratePlan.price.current; 
        }
    });
}