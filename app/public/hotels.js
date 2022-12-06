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
        console.log(body);
        let cities = body.data;

        for (let i = 0; i < cities.length; i ++) {
            if (cities[i].type === "CITY") {
                let city = [cities[i].regionNames.displayName, cities[i].coordinates.latitude, cities[i].coordinates.longitude];
                locations[cities[i].gaiaId] = city; 
            }
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

    fetch("/hotels?regionId=" + locationId).then((response) => {
        return response.json();
    }).then((body) => {
        console.log(body);

        let searchResults = body.properties;

        console.log(hotelTableBody.rows.length);

        while (hotelTableBody.rows.length > 0) {
            console.log("delete");
            hotelTableBody.deleteRow(0);
        }

        for (let i = 0; i < searchResults.length; i++) {
            let row = document.createElement("tr");
            hotelTableBody.append(row);

            let hotelName = document.createElement("td");
            let hotelDistance = document.createElement("td");
            row.append(hotelName);
            row.append(hotelDistance);

            row.setAttribute("id", searchResults[i].id);
            hotelName.textContent = searchResults[i].name;
            hotelDistance.textContent = searchResults[i].destinationInfo.distanceFromDestination.value + " miles";
        }
    });
}