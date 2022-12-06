let search = document.getElementById("submitSearchButton");
let searchLocation = document.getElementById("location");
let hotelLocations = document.getElementById("hotelLocations");
let hotelTableBody = document.getElementById("hotelBody");
let locations = {}; 
let populated = false; 
let maxHotelResults = 20; 
let visibleHotelDetails = false; 
let selectedHotelRow, selectedHotelRowId;

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

//commented out for the Search-functionality branch to save our API requests
// search.addEventListener("click", () => {
//     let searchLocationVal = searchLocation.value;

//     fetch("/hotelsCoordinates?searchLocation=" + searchLocationVal).then((response) => {
//         return response.json(); 
//     }).then((body) => {
//         let cities = body.suggestions[0].entities;

//         for (let i = 0; i < cities.length; i ++) {
//             let city = [cities[i].caption, cities[i].latitude, cities[i].longitude];
//             locations[cities[i].geoId] = city; 
//         }

//         generateLocations();
//     }); 
// });

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
            console.log("delete");
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
    });
});