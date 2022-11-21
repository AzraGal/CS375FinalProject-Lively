import * as cookies from "./cookies.js";

let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let genreInput = document.getElementById("genre");
let locationInput = document.getElementById("location");
let artist = "";
let genre = "";
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

function createSelectOptions(data){
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        optionsData.push({
            id: i,
            text: element
        })
    }
    // console.log(optionsData);
}

var createData = [];

const TMgenreMap = new Map(); //TMgenreMap exists so that genre ID's can be easily recalled later for event search functionality

//TODO: use this map below to filter for against selection of a genre Category vs a subcategory of the same name; 
/*when TWO event searches are made and the corresponding name for genreId and subGenreId are the same (yet each with different Id), the search with the genreId ought to be given preference, as it returns more accurate results
*/
const TMsubGenreMap = new Map(); //TMsubGenreMap exists so that subGenre ID's can be easily recalled later for event search functionality

$(document).ready(function() {
    fetch('/tmGenres').then((response) => {
        return response.json();
    }).then((body)=>{
        console.log(body);
        let a = "a"
        body.forEach(genre => {
            genre._embedded.subgenres.forEach(subGenre => {
                // console.log(subGenre);
                TMsubGenreMap.set(subGenre.name, subGenre.id)
            });
            createData.push(genre.name)
            TMgenreMap.set(genre.name, genre.id)
        });
        // console.log(TMgenreMap);
        // console.log(TMsubGenreMap);
        createSelectOptions(createData);
        $(".js-example-basic-multiple").select2({data: optionsData, multiple: true, MultipleSelection: true})
	}).catch(error => {
		console.error(error);
        throw error;
	});	
});

function init() {
    submitSearchButton.addEventListener("click", submitSearch);
    if (cookies.cookieConsent !== "") {
        artistInput.value = cookies.getCookie("artist_search").substring(1);
        //genreInput.value = cookies.getCookie("genre_search").substring(1);
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
    genre = genreInput.value;
    selectedGenres = getSelectedGenres();
    location = locationInput.value;
    document.getElementById("suggestedArtists").style.display = "none";

    if (cookies.cookieConsent !== "") {
        cookies.deleteCookie("artist_search");
        cookies.deleteCookie("genre_search");
        cookies.deleteCookie("location_search");
        cookies.setCookie("artist_search", artist, 30);
        cookies.setCookie("genre_search", genre, 30);
        cookies.setCookie("location_search", location, 30);
    }
}

getConcertHotels.addEventListener("click", () => {
    console.log(getConcertHotels.value);
});

init();
