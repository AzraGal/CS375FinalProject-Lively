// venue concert pins are red
// hotel pins are purple 

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
        "name": "Test Hotel Location 1",
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
            "longitude": "-75.2",
            "latitude": "41"
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
        "name": "Test Hotel Location 2",
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
            "latitude": "37"
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


let searchButton = document.getElementById("submitSearchButton")

function initMap() {
    
    let map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.95228, lng: -75.16245 },
        zoom: 8,
        mapId: '3c124c6fbfda6d51'
    });

    searchButton.addEventListener("click", showVenueMarkers);
    searchButton.addEventListener("click", showHotelMarkers);

    let infowindow = null;
    function showVenueMarkers() {
        let venueMarkers = [];
        for (let i = 0; i < dummy_venue_data.length; i++) {
            let lat = dummy_venue_data[i].location.latitude;
            let long = dummy_venue_data[i].location.longitude;

            let markerOptions = {
                position: new google.maps.LatLng(lat, long),
                map: map
                

            }
            let contentString = `<b>Name: </b> ${dummy_venue_data[i].name} <br>  
                              <b>Address: </b> ${dummy_venue_data[i].address.line1}, ${dummy_venue_data[i].address.line2}`;

            infowindow = new google.maps.InfoWindow({
                content: contentString,
                ariaLabel: "Uluru",
            });

            let marker = new google.maps.Marker(markerOptions);
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(contentString);
                infowindow.open(map, this);
            });
            venueMarkers.push(marker)
        };

    };

    function showHotelMarkers() {
        let hotelMarkers = [];
        for (let i = 0; i < dummy_hotel_data.length; i++) {
            let lat = dummy_hotel_data[i].location.latitude;
            let long = dummy_hotel_data[i].location.longitude;

            let pinViewBackground = new google.maps.marker.PinView({
                glyphColor: "#000000",
                background: "#d400ff",
                borderColor: "#b5d1c8",
                
            });

            let markerOptions = new google.maps.marker.AdvancedMarkerView({
                map:map,
                position: new google.maps.LatLng(lat, long),
                content: pinViewBackground.element
            });

            let contentString = `<b>Name: </b> ${dummy_hotel_data[i].name} <br>  
                              <b>Address: </b> ${dummy_hotel_data[i].address.line1}, ${dummy_hotel_data[i].address.line2}`;

            infowindow = new google.maps.InfoWindow({
                content: contentString,
                ariaLabel: "Uluru",
            });
            let marker = new google.maps.Marker(markerOptions);
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(contentString);
                infowindow.open(map, this);
            });
            hotelMarkers.push(marker)
        };

    };

};


window.initMap = initMap;