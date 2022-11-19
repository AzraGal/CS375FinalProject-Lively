import * as cookies from "./cookies.js";
import * as artistSearch from "./artistSearch.js";

let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let locationInput = document.getElementById("location");
let artist = "";
let listOfSelectedArtists = [];
let selectedGenres = [];
let location = "";

let getConcertHotels = document.getElementById("concertRes");

// 
// function showHideEventRow(row) {
//     $("#" + row).toggle();
// }

let row1 = document.getElementById("row1")

row1.addEventListener("click", () => {
    $("#" + 'hidden_row1').toggle();
});

var optionsData = [];
// inset Ticket master genres here
var createData = ["traditional pop", "jazz", "blues", "country", "rock", "rock and roll", "R&B", "pop", "hip hop", "soul"];
function createSelectOptions(data){
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        optionsData.push({
            id: i,
            text: element
        })
    }
}
console.log(optionsData);


$(document).ready(function() {
    createSelectOptions(createData);
    $(".js-example-basic-multiple").select2({data: optionsData})
});

function init() {
    submitSearchButton.addEventListener("click", submitSearch);
    if (cookies.cookieConsent !== "" && cookies.getCookie("current_artist_search") !== "") {
        artistInput.value = cookies.getCookie("current_artist_search").substring(1);
        listOfSelectedArtists = JSON.parse(cookies.getCookie("selected_artists").substring(1));
        showSelectedArtists(listOfSelectedArtists);
        locationInput.value = cookies.getCookie("location_search").substring(1);
    }
}

function getSelectedGenres(){
    let data = $('.js-example-basic-multiple').select2('data');
    // console.log("genre data:",data);

    let selectedGenres = []
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        selectedGenres.push(element.text);
    }
    return selectedGenres;
}

function submitSearch() {

    artist = artistInput.value;
    listOfSelectedArtists = artistSearch.listOfSelectedArtists;
    selectedGenres = getSelectedGenres();
    location = locationInput.value;
    document.getElementById("suggestedArtists").style.display = "none";

    if (cookies.cookieConsent !== "") {
        cookies.deleteCookie("current_artist_search");
        cookies.deleteCookie("selected_artists");
        cookies.deleteCookie("selected_genres");
        cookies.deleteCookie("location_search");
        cookies.setCookie("current_artist_search", artist, 30);
        cookies.setCookie("selected_artists", JSON.stringify(listOfSelectedArtists), 30);
        cookies.setCookie("selected_genres", JSON.stringify(getSelectedGenres()), 30);
        cookies.setCookie("location_search", location, 30);
    }
}

function showSelectedArtists(selectedArtists) {
    for (let artist of selectedArtists) {
        artistSearch.addToSelectedArtists(artist);
    }
}

getConcertHotels.addEventListener("click", () => {
    console.log(getConcertHotels.value);
});

init();
