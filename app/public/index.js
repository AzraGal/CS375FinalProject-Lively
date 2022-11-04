let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.95228, lng: -75.16245 },
        zoom: 8,
    });
}

window.initMap = initMap;