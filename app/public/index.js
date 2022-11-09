import * as cookies from "./cookies.js";

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.95228, lng: -75.16245 },
        zoom: 8,
    });
}

window.initMap = initMap;

let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let genreInput = document.getElementById("genre");
let locationInput = document.getElementById("location");
let artist = "";
let genre = "";
let location = "";

function init() {
    submitSearchButton.addEventListener("click", submitSearch);
    if (cookies.cookieConsent !== "") {
        artistInput.value = cookies.getCookie("artist_search").substring(1);
        genreInput.value = cookies.getCookie("genre_search").substring(1);
        locationInput.value = cookies.getCookie("location_search").substring(1);
    }
}

function submitSearch() {
    artist = artistInput.value;
    genre = genreInput.value;
    location = locationInput.value;

    if (cookies.cookieConsent !== "") {
        cookies.deleteCookie("artist_search");
        cookies.deleteCookie("genre_search");
        cookies.deleteCookie("location_search");
        cookies.setCookie("artist_search", artist, 30);
        cookies.setCookie("genre_search", genre, 30);
        cookies.setCookie("location_search", location, 30);
    }
}

init();