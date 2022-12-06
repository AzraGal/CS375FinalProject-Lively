// venue concert pins are red
// hotel pins are purple 
import * as spotify from "./spotify.js";
import * as cookies from "./cookies.js";

// ---- dummy data ----

let dummy_hotel_data = [
    {
        "id": 105991,
        "name": "Royal Garden Hotel",
        "starRating": 5,
        "urls": {},
        "address": {
            "streetAddress": "2-24 Kensington High Street",
            "extendedAddress": "",
            "locality": "London",
            "postalCode": "W8 4PT",
            "region": "England",
            "countryName": "United Kingdom",
            "countryCode": "gb",
            "obfuscate": false
        },
        "welcomeRewards": {
            "collect": true
        },
        "guestReviews": {
            "unformattedRating": 4.4,
            "rating": "4.4",
            "total": 1197,
            "scale": 5,
            "badge": "fabulous",
            "badgeText": "Fabulous"
        },
        "landmarks": [
            {
                "label": "8 Victoria Embankment, London WC2R 2AB, UK",
                "distance": "3.1 miles"
            },
            {
                "label": "London",
                "distance": "2.6 miles"
            }
        ],
        "geoBullets": [],
        "ratePlan": {
            "price": {
                "current": "$391",
                "exactCurrent": 391.28,
                "old": "$435",
                "fullyBundledPricePerStay": "total $470"
            },
            "features": {
                "freeCancellation": false,
                "paymentPreference": false,
                "noCCRequired": false
            },
            "type": "EC"
        },
        "neighbourhood": "Royal Borough of Kensington and Chelsea",
        "deals": {
            "secretPrice": {
                "dealText": "Save more with Secret Prices"
            },
            "priceReasoning": "DRR-443"
        },
        "messaging": {
            "scarcity": "1 left on our app"
        },
        "badging": {},
        "pimmsAttributes": "DoubleStamps|D13|TESCO",
        "coordinate": {
            "lat": 51.502392,
            "lon": -0.188608
        },
        "roomsLeft": 1,
        "providerType": "LOCAL",
        "supplierHotelId": 54987,
        "isAlternative": false,
        "optimizedThumbUrls": {
            "srpDesktop": "https://exp.cdn-hotels.com/hotels/1000000/60000/55000/54987/08dd57c0_z.jpg?impolicy=fcrop&w=250&h=140&q=high"
        }
    },
    {
        "id": 360456,
        "name": "St. Pancras Renaissance Hotel London",
        "starRating": 5,
        "urls": {},
        "address": {
            "streetAddress": "Euston Road",
            "extendedAddress": "",
            "locality": "London",
            "postalCode": "NW1 2AR",
            "region": "England",
            "countryName": "United Kingdom",
            "countryCode": "gb",
            "obfuscate": false
        },
        "welcomeRewards": {
            "collect": true
        },
        "guestReviews": {
            "unformattedRating": 4.3,
            "rating": "4.3",
            "total": 1084,
            "scale": 5,
            "badge": "fabulous",
            "badgeText": "Fabulous"
        },
        "landmarks": [
            {
                "label": "8 Victoria Embankment, London WC2R 2AB, UK",
                "distance": "1.4 miles"
            },
            {
                "label": "London",
                "distance": "1.5 miles"
            }
        ],
        "geoBullets": [],
        "ratePlan": {
            "price": {
                "current": "$431",
                "exactCurrent": 430.7,
                "fullyBundledPricePerStay": "total $517"
            },
            "features": {
                "freeCancellation": false,
                "paymentPreference": false,
                "noCCRequired": false
            },
            "type": "EC"
        },
        "neighbourhood": "Kings Cross St. Pancras",
        "deals": {},
        "messaging": {},
        "badging": {},
        "pimmsAttributes": "DoubleStamps|MESOTESTUK|TESCO",
        "coordinate": {
            "lat": 51.529412,
            "lon": -0.125847
        },
        "providerType": "LOCAL",
        "supplierHotelId": 3907784,
        "isAlternative": false,
        "optimizedThumbUrls": {
            "srpDesktop": "https://exp.cdn-hotels.com/hotels/4000000/3910000/3907800/3907784/5fc0845f_z.jpg?impolicy=fcrop&w=250&h=140&q=high"
        }
    }
]; 

let searchButton = document.getElementById("buttonTicketMasterEvents");
let allConcerts = document.getElementById("allConcerts");
let spotifyButton = document.getElementById("buttontopartist");

function initMap() {

    //global variables 

    let markers = [];
    let selectedMarker = [];
    let infowindow = null;

    

    searchButton.addEventListener("click", () => {
        fetch('/tmEvents').then((response) => {
            return response.json();
        }).then((body) => {
            let data = body['_embedded'].events;
            deleteMarkers();
            showVenueMarkers(data)
            allConcerts.addEventListener("click", function () {
                deleteMarkers();
                deleteSelectedMarker()
                showVenueMarkers(data)
            })

            let table = document.getElementById("eventsTable")
            for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].addEventListener("click", () => {
                    let cellLat = table.rows[i].cells[4].textContent;
                    let cellLong = table.rows[i].cells[5].textContent;
                    let cellBanner = table.rows[i].cells[6].textContent;
                    let contentString = `
                              <center><img src = ${cellBanner} width = "300" height = "150"> </center> <br>
                              <b>Name: </b> ${table.rows[i].cells[0].textContent} <br>
                              <b>Address: </b> ${table.rows[i].cells[2].textContent} `;

                    deleteMarkers();
                    deleteSelectedMarker();
                    console.log(selectedMarker)
                    createVenueMarker(cellLat, cellLong, contentString);
                })
            };

        });
    });

    spotifyButton.addEventListener("click", () => {
        deleteMarkers();
        let data = spotify.spotifyEvents._embedded.events;
        if (cookies.cookieConsent !== "" && window.localStorage.getItem("spotifyEvents")) {
            let spotifyEvents = JSON.parse(window.localStorage.getItem("spotifyEvents"));
            data = spotifyEvents._embedded.events;
        }
        showVenueMarkers(data);
        allConcerts.addEventListener("click", function () {
            deleteMarkers()
            deleteSelectedMarker()
            showVenueMarkers(data)
        })
        let table = document.getElementById("eventsTable")
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].addEventListener("click", () => {
                let cellLat = table.rows[i].cells[4].textContent;
                let cellLong = table.rows[i].cells[5].textContent;
                let cellBanner = table.rows[i].cells[6].textContent;
                let contentString = `
                          <center><img src = ${cellBanner} width = "300" height = "150"> </center> <br>
                          <b>Name: </b> ${table.rows[i].cells[0].textContent} <br>
                          <b>Address: </b> ${table.rows[i].cells[2].textContent} `;

                deleteMarkers();
                deleteSelectedMarker();
                console.log(selectedMarker)
                createVenueMarker(cellLat, cellLong, contentString);
            });
        };
    });

  // --------------- marker creation functions -----------------

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