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
    if (cookies.cookieConsent !== "") {
        cookies.deleteCookie("date_range");
        cookies.setCookie("date_range", `${picker.startDate.format('MM/DD/YYYY')} - ${picker.endDate.format('MM/DD/YYYY')}`, 30);
    }
    console.log(picker.startDate.format('MM/DD/YYYY'), picker.endDate.format('MM/DD/YYYY'));
});

$('input[name="daterange"]').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
    if (cookies.cookieConsent !== "") {
        cookies.deleteCookie("date_range");
        cookies.setCookie("date_range", ``, 30);
    }
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
                createData.push(subGenre.name)
            });
            // createData.push(genre.name)

            TMgenreMap.set(genre.name, genre.id)
        });
        // console.log(TMgenreMap);
        // console.log(TMsubGenreMap);
        createSelectOptions(createData);
        $(".js-example-basic-multiple").select2({data: optionsData, multiple: true, MultipleSelection: true});
        if (cookies.cookieConsent !== "") {
            $(".js-example-basic-multiple").val(select2GenresIDs);
            $(".js-example-basic-multiple").trigger("change");
        }
	}).catch(error => {
		console.error(error);
        throw error;
	});	
});

let select2GenresIDs = [];

function init() {
    submitSearchButton.addEventListener("click", submitSearch);
    if (cookies.cookieConsent !== "") {
        if (cookies.getCookie("current_artist_search") !== "") {
            artistInput.value = cookies.getCookie("current_artist_search").substring(1);
            listOfSelectedArtists = JSON.parse(cookies.getCookie("selected_artists").substring(1));
            showSelectedArtists(listOfSelectedArtists);
        }
        if (cookies.getCookie("selected_genres") !== "") {
            select2GenresIDs = JSON.parse(cookies.getCookie("selected_genres").substring(1));
            locationInput.value = cookies.getCookie("location_search").substring(1);
        }
        locationInput.value = cookies.getCookie("location_search").substring(1);
        locationInput.addEventListener("keyup", (event) => {
            cookies.deleteCookie("location_search");
            cookies.setCookie("location_search", locationInput.value, 30);
        });
        $(".js-example-basic-multiple").on("select2:select", function (sel) {
            select2GenresIDs.push(sel.params.data.id);
            cookies.deleteCookie("selected_genres");
            cookies.setCookie("selected_genres", JSON.stringify(select2GenresIDs), 30);
        });
        $(".js-example-basic-multiple").on("select2:unselect", function (sel) {
            select2GenresIDs = select2GenresIDs.filter(function(id) {return id !== sel.params.data.id;});
            cookies.deleteCookie("selected_genres");
            cookies.setCookie("selected_genres", JSON.stringify(select2GenresIDs), 30);
        });
        if (cookies.getCookie("date_range") !== "") {
            $('input[name="daterange"]').val(cookies.getCookie("date_range").substring(1));
        }
    }
}

export { getSelectedGenres }

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
        cookies.deleteCookie("location_search");
        cookies.setCookie("current_artist_search", artist, 30);
        cookies.setCookie("selected_artists", JSON.stringify(listOfSelectedArtists), 30);
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
// console.log(artistOptionsData);