import * as cookies from "./cookies.js";
import * as artistSearch from "./artistSearch.js";

let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let locationInput = document.getElementById("location");
let artist = "";
let listOfSelectedArtists = [];
let selectedGenres = [];
let location = "";

// let getConcertHotels = document.getElementById("concertRes");

$('input[name="daterange"]').daterangepicker({
    autoUpdateInput: false,
    locale: {
        cancelLabel: 'Clear'
    }
});

$('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    console.log(picker.startDate.format('MM/DD/YYYY'), picker.endDate.format('MM/DD/YYYY'));
});

$('input[name="daterange"]').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
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
export const TMsubGenreMap = new Map(); //TMsubGenreMap exists so that subGenre ID's can be easily recalled later for event search functionality

$(document).ready(function() {
    fetch('/tmGenres').then((response) => {
        return response.json();
    }).then((body)=>{
        console.log(body);
        let a = "a"
        body.forEach(genre => {
            genre._embedded.subgenres.forEach(subGenre => {
                // console.log(subGenre);
                if (!createData.includes(subGenre.name)) {
                    createData.push(subGenre.name);
                }
                TMsubGenreMap.set(subGenre.name, subGenre.id)
            });
            // createData.push(genre.name)
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
    if (cookies.cookieConsent !== "" && cookies.getCookie("current_artist_search") !== "") {
        artistInput.value = cookies.getCookie("current_artist_search").substring(1);
        listOfSelectedArtists = JSON.parse(cookies.getCookie("selected_artists").substring(1));
        showSelectedArtists(listOfSelectedArtists);
        locationInput.value = cookies.getCookie("location_search").substring(1);
    }
    locationInput.addEventListener("keyup", (event) => {
        if (cookies.cookieConsent !== "") {
            cookies.deleteCookie("location_search");
            cookies.setCookie("location_search", locationInput.value, 30);
        }
    });
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

// getConcertHotels.addEventListener("click", () => {
//     console.log(getConcertHotels.value);
// });

init();
