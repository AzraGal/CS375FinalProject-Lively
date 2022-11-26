import {displayConcertSearchResults} from "./tableDisplay.js";
import {getTicketmasterEvents} from "./ticketmaster.js";
import {getSelectedGenres} from "./index.js";

let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let genreInput = document.getElementById("genre");
let locationInput = document.getElementById("location");

function submitSearch(){
    let selectedArtists = artistInput.value;
    let genre = genreInput.value;
    let selectedGenres = getSelectedGenres();
    let location = locationInput.value;
    
    console.log("getSelectedGenres:", getSelectedGenres())
    console.log("genre:", genre)
    console.log("selectedGenres:", selectedGenres)
    console.log("location:", location)
    

}

submitSearchButton.addEventListener("click", submitSearch);