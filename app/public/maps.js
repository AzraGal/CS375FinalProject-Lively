// venue concert pins are red
// hotel pins are purple 
import * as spotify from "./spotify.js";
import * as cookies from "./cookies.js";

// ---- dummy data ----


let searchButton = document.getElementById("submitSearchButton");
let allConcerts = document.getElementById("allConcerts");
let spotifyButton = document.getElementById("buttontopartist");

function initMap() {

    //global variables 

    let markers = [];
    let selectedMarker = [];
    let infowindow = null;
    let table = document.getElementById("eventsTable")


    searchButton.click();

    searchButton.addEventListener("click", () => {
        deleteMarkers();
        deleteSelectedMarker();
    });

    allConcerts.addEventListener("click", function () {
        for (let i = 0; i < table.rows.length; i++) {
            eventClicked(i);
        };
        showTableData(table);
    });

    spotifyButton.addEventListener("click", () => {
        let data = spotify.spotifyEvents._embedded.events;
        if (cookies.cookieConsent !== "" && window.localStorage.getItem("spotifyEvents")) {
            let spotifyEvents = JSON.parse(window.localStorage.getItem("spotifyEvents"));
            data = spotifyEvents._embedded.events;
        }
        allConcerts.click();
    });

  // --------------- marker creation functions -----------------

    function eventClicked(i) {
        deleteMarkers();
        deleteSelectedMarker();
        table.rows[i].addEventListener("click", () => {
            deleteMarkers();
            deleteSelectedMarker();
            if (infowindow) {
                infowindow.close();
            }
            let cellLat = table.rows[i].cells[4].textContent;
            let cellLong = table.rows[i].cells[5].textContent;
            let cellBanner = table.rows[i].cells[6].textContent;
            let contentString = `
                      <center><img src = ${cellBanner} width = "300" height = "150"> </center> <br>
                      <b>Name: </b> ${table.rows[i].cells[0].textContent} <br>
                      <b>Address: </b> ${table.rows[i].cells[2].textContent} `;
            let currentMarker = createVenueMarker(cellLat, cellLong, contentString);
            currentMap.panTo(new google.maps.LatLng(cellLat, cellLong));
            infowindow.open(currentMap, currentMarker);
        });
    }

    function showVenueMarkers(data) {
        for (let i = 0; i < data.length; i++) {
            try {
                let lat = data[i]._embedded.venues[0].location.latitude;
                let long = data[i]._embedded.venues[0].location.longitude;
                let banner = null;
                for (let j = 0; j < data[i].images.length; j++) {
                    if (data[i].images[j].ratio == "16_9" && data[i].images[j].width == 2048) {
                        banner = data[i].images[j].url;
                        break
                    }
                }
                let contentString = `
                              <center><img src = ${banner} width = "300" height = "150"> </center> <br>
                              <b>Name: </b> ${data[i].name} <br>
                              <b>Address: </b> ${data[i]._embedded.venues[0].address.line1}, ${data[i]._embedded.venues[0].city.name},<br> ${data[i]._embedded.venues[0].country.name} `;
                createVenueMarker(lat, long, contentString)
                
            }

            catch {
                continue
            }
                
        }
    };

    function showTableData(table) {
        for (let i = 1; i < table.rows.length; i += 2) {
            let cellLat = table.rows[i].cells[4].textContent;
            let cellLong = table.rows[i].cells[5].textContent;
            let cellBanner = table.rows[i].cells[6].textContent;
            let contentString = `
                            <center><img src = ${cellBanner} width = "300" height = "150"> </center> <br>
                            <b>Name: </b> ${table.rows[i].cells[0].textContent} <br>
                            <b>Address: </b> ${table.rows[i].cells[2].textContent} `;

            createVenueMarker(cellLat, cellLong, contentString);

        };

    }

    function showHotelMarkers(data) {
        for (let i = 0; i < dummy_hotel_data.length; i++) {
                let lat = dummy_hotel_data[i].coordinate.lat;
                let long = dummy_hotel_data[i].coordinate.lon;
            let contentString = `<b>Name: </b> ${dummy_hotel_data[i].name} <br>
                                  <b>Address: </b> ${dummy_hotel_data[i].address.streetAddress}, 
    ${dummy_hotel_data[i].address.locality},${dummy_hotel_data[i].address.region}, 
    ${dummy_hotel_data[i].address.countryName}, 
    ${dummy_hotel_data[i].address.postalCode}. <br>
    <b>Price:</b> ${dummy_hotel_data[i].ratePlan.price.current}/night, <br> 
    <b>Rating:</b> ${dummy_hotel_data[i].guestReviews.unformattedRating}/5`;

                createHotelMarker(lat, long, contentString)
            }; 
        };

    function createVenueMarker(lat, long, contentString) {
        let markerOptions = {
            position: new google.maps.LatLng(lat, long),
            map: currentMap
        };

        infowindow = new google.maps.InfoWindow({
            content: contentString,
            ariaLabel: "Uluru",
        });

        let marker = new google.maps.Marker(markerOptions);
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(contentString);
            infowindow.open(currentMap, this);
        });

        google.maps.event.addListener(marker, 'dblclick', function () {
            deleteSelectedMarker()
            selectedMarker.push(marker);
            deleteMarkers();
            showSelectedMarker(currentMap);
        })
        markers.push(marker);
        return marker

    };

    function createHotelMarker(lat, long, contentString) {
        let pinViewBackground = new google.maps.marker.PinView({
            glyphColor: "#8f48a3",
            background: "#d400ff",
            borderColor: "#b5d1c8",

        });

        let markerOptions = new google.maps.marker.AdvancedMarkerView({
            position: new google.maps.LatLng(lat, long),
            content: pinViewBackground.element,
            map: currentMap
        });


        infowindow = new google.maps.InfoWindow({
            content: contentString,
            ariaLabel: "Uluru",
        });

        let marker = new google.maps.Marker(markerOptions);
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, this);
        })
        markers.push(marker);
    };


    // ------------- marker behaviour functions --------------


    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }
    function showSelectedMarker(map) {
        for (let i = 0; i < selectedMarker.length; i++) {
            selectedMarker[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }

    function deleteSelectedMarker() {
        showSelectedMarker(null);
        selectedMarker = [];
    }
    // -----main-----

    let currentMap = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.95228, lng: -75.16245 },
        zoom: 8,
        mapId: '3c124c6fbfda6d51'
    });

    let legend = document.getElementById("legend");
    let icons = {
        parking: {
            name: "Venue",
            icon: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Google_Maps_pin.svg",
        },
        library: {
            name: "Hotel",
            icon: "https://prccharlotte.com/wp-content/uploads/maps-pin-purple.png",
        }

    };

    for (let key in icons) {
        let type = icons[key];
        let name = type.name;
        let icon = type.icon;
        let div = document.createElement("div");

        div.innerHTML = '<img src="' + icon + '" width="30" height="30"> ' + name;
        legend.appendChild(div);
    }

    currentMap.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);

};



//Calling the map
window.initMap = initMap;