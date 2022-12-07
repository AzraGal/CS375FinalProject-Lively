import {getTicketmasterEvents} from "./ticketmaster.js";
import {populateEventsTable} from "./ticketmaster.js";
import {listOfSelectedArtists} from "./artistSearch.js";
import {getSelectedGenres} from "./index.js";
import {displayConcertSearchResults, clearEventsTable} from "./tableDisplay.js";


let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let genreInput = document.getElementById("genre");
let locationInput = document.getElementById("location");

function submitSearch(){
    let selectedArtists = listOfSelectedArtists;
    let genre = genreInput.value;
    let selectedGenres = getSelectedGenres(); 
    let location = locationInput.value;
    
    console.log("selectedArtists:", selectedArtists)
    console.log("genre:", genre)
    console.log("selectedGenres:", selectedGenres)
    console.log("location:", location)
    
    let eventSearchPromise = getTicketmasterEvents(selectedArtists, selectedGenres, location);
    eventSearchPromise.then((body) => {
        console.log(body);
        populateEventsTable(body);
        document.getElementById("allConcerts").click();
    })
    // clearEventsTable()
    // let displayConcertSearchPromise = displayConcertSearchResults(eventSearchPromise)

    //we get the search results as var here
    //submit to populate table
    //submit to populate map
}

submitSearchButton.addEventListener("click", submitSearch);