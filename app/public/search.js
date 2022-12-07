import {getTicketmasterEvents} from "./ticketmaster.js";
import {listOfSelectedArtists} from "./artistSearch.js";
import {getSelectedGenres} from "./index.js";
import {displayConcertSearchResults, clearEventsTable} from "./tableDisplay.js";

let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let genreInput = document.getElementById("genre");
let stateInput = document.getElementById("state");
let cityInput = document.getElementById("city");

var drp = $('input[name="daterange"]').data('daterangepicker');

function submitSearch(){
    let selectedArtists = listOfSelectedArtists;
    let genre = genreInput.value;
    let selectedGenres = getSelectedGenres(); 
    let state = stateInput.value;
    let city = cityInput.value;
    
    console.log("selectedArtists:", selectedArtists)
    console.log("genre:", genre)
    console.log("selectedGenres:", selectedGenres)
    console.log("city:", city)
    console.log("state:", state)
    startDate = drp.startDate.format('YYYY-MM-DD');
    console.log(startDate);
    endDate = drp.endDate.format('YYYY-MM-DD');
    console.log(endDate);    
    
    let eventSearchPromise = getTicketmasterEvents(selectedArtists, selectedGenres, city, state);
    // clearEventsTable()
    // let displayConcertSearchPromise = displayConcertSearchResults(eventSearchPromise)

    //we get the search results as var here
    //submit to populate table
    //submit to populate map
}

submitSearchButton.addEventListener("click", submitSearch);