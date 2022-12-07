let search = document.getElementById("submitSearchButton");
let searchCity = document.getElementById("city");
let searchState = document.getElementById("state");
let hotelLocations = document.getElementById("hotelLocations");
let hotelTableBody = document.getElementById("hotelBody");
let locations = {}; 
let populated = false; 
let maxHotelResults = 20; 
let visibleHotelDetails = false; 
let selectedHotelRow, selectedHotelRowId;

const states = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois", 
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts", 
    MI: "Michigan", 
    MN: "Minnesota",
    MS: "Mississippi", 
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NK: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming"
};

//commented out for the Search-functionality branch to save our API requests
search.addEventListener("click", () => {
    let searchCityVal = searchCity.value;
    let searchStateVal = searchState.value;

    fetch("/hotelsCoordinates?searchCity=" + searchCityVal).then((response) => {
        return response.json(); 
    }).then((body) => {
        console.log(body);
        let cities = body.data;

        for (let i = 0; i < cities.length; i ++) {
            if (cities[i].type === "CITY" && cities[i].regionNames.displayName.includes(states[searchStateVal])) {
                console.log("neato");
                fetchHotels(cities[i].gaiaId);
            }
        }
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

        while (hotelTableBody.rows.length > 0) {
            hotelTableBody.deleteRow(0);
        }

        for (let i = 0; i < maxHotelResults; i++) {
            let row = document.createElement("tr");
            let hiddenRow = document.createElement("tr");
            hotelTableBody.append(row);
            hotelTableBody.append(hiddenRow);

            let hotelName = document.createElement("td");
            let hotelDistance = document.createElement("td");
            let hotelPrice = document.createElement("td");
            row.append(hotelName);
            row.append(hotelDistance);
            row.append(hotelPrice);

            row.setAttribute("id", searchResults[i].id);
            hotelName.textContent = searchResults[i].name;
            hotelDistance.textContent = searchResults[i].destinationInfo.distanceFromDestination.value + " miles";
            hotelPrice.textContent = searchResults[i].price.options[0].formattedDisplayPrice;

            hiddenRow.setAttribute("id", searchResults[i].id + "hidden");
            hiddenRow.setAttribute("hidden", true);
        }

        populated = true; 
    });
}

hotelTableBody.addEventListener("click", (e) => {
    const hotelCell = e.target.closest('td');

    if (!hotelCell || populated === false) { return}
    
    let hotelRow = hotelCell.parentElement;
    let row = document.getElementById(hotelRow.id + "hidden");
    
    if (selectedHotelRow) {
        $("#" + selectedHotelRowId + "hidden").toggle();
    }

    $("#" + hotelRow.id + "hidden").toggle();
    selectedHotelRow = row;
    selectedHotelRowId = hotelRow.id;
    
    console.log("clicked!", hotelRow.id);

    
    fetch("/hotelDetails?hotelId=" + hotelRow.id).then((response) => {
        return response.json();
    }).then((body) => {
        console.log(body);

        let details = body.summary; 
        
        let tagline = document.createElement("ul");
        let detailCell = document.createElement("td");
        let detailList = document.createElement("ul"); 
        row.append(tagline);
        row.append(detailCell);
        detailCell.append(detailList);

        tagline.textContent = details.tagline;

        detailList.textContent = "Address";
        let address = document.createElement("li");
        detailList.append(address);
        address.textContent = details.location.address.addressLine; 

        let lat = document.createElement("p");
        let long = document.createElement("p");
        row.append(lat);
        row.append(long);

        lat.textContent = details.location.coordinates.latitude;
        long.textContent = details.location.coordinates.longitude;
        lat.setAttribute("hidden", true);
        long.setAttribute("hidden", true);
    });
});