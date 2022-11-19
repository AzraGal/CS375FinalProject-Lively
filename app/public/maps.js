// venue concert pins are red
// hotel pins are purple 

// ---- dummy data ----
let dummy_venue_data = [
    {
        "name": "Test Location 1",
        "type": "venue",
        "id": "ZFr9jZkevd",
        "test": false,
        "locale": "en-us",
        "postalCode": "19104",
        "timezone": "America/New_York",
        "city": {
            "name": "Philadelphia"
        },
        "state": {
            "name": "Pennsylvania",
            "stateCode": "PA"
        },
        "country": {
            "name": "United States Of America",
            "countryCode": "US"
        },
        "address": {
            "line1": "3025 Walnut St",
            "line2": "Philadelphia, PA"
        },
        "location": {
            "longitude": "-75.199501",
            "latitude": "39.961601"
        },
        "dmas": [
            {
                "id": 358
            }
        ],
        "upcomingEvents": {
            "_total": 14,
            "tmr": 14,
            "_filtered": 0
        },
        "_links": {
            "self": {
                "href": "/discovery/v2/venues/ZFr9jZkevd?locale=en-us"
            }
        }
    },
    {
        "name": "Test Location 2",
        "type": "venue",
        "id": "ZFr9jZkevd",
        "test": false,
        "locale": "en-us",
        "postalCode": "19104",
        "timezone": "America/New_York",
        "city": {
            "name": "Philadelphia"
        },
        "state": {
            "name": "Pennsylvania",
            "stateCode": "PA"
        },
        "country": {
            "name": "United States Of America",
            "countryCode": "US"
        },
        "address": {
            "line1": "3025 Walnut St",
            "line2": "Philadelphia, PA"
        },
        "location": {
            "longitude": "-75.199501",
            "latitude": "38.961601"
        },
        "dmas": [
            {
                "id": 358
            }
        ],
        "upcomingEvents": {
            "_total": 14,
            "tmr": 14,
            "_filtered": 0
        },
        "_links": {
            "self": {
                "href": "/discovery/v2/venues/ZFr9jZkevd?locale=en-us"
            }
        }
    }
];

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



let searchButton = document.getElementById("submitSearchButton")

function initMap() {

    //global variables 

    let venueMarkers = [];
    let hotelMarkers = [];
    let infowindow = null;

    // ----- all functions -----


    function showVenueMarkers() {
        for (let i = 0; i < dummy_venue_data.length; i++) {
            let lat = dummy_venue_data[i].location.latitude;
            let long = dummy_venue_data[i].location.longitude;
            let contentString = `<b>Name: </b> ${dummy_venue_data[i].name} <br>  
                              <b>Address: </b> ${dummy_venue_data[i].address.line1}, ${dummy_venue_data[i].address.line2}`;
            createVenueMarker(lat, long, contentString)

        }
    };


    function showHotelMarkers() {
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
        });

    };

    // -----main-----

    let currentMap = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.95228, lng: -75.16245 },
        zoom: 8,
        mapId: '3c124c6fbfda6d51'
    });

    

    searchButton.addEventListener("click", showVenueMarkers);
    searchButton.addEventListener("click", showHotelMarkers);


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
        const type = icons[key];
        const name = type.name;
        const icon = type.icon;
        const div = document.createElement("div");

        div.innerHTML = '<img src="' + icon + '" width="30" height="30"> ' + name;
        legend.appendChild(div);
    }

    currentMap.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
};

//Calling the map
window.initMap = initMap;