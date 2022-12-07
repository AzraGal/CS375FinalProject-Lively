import {getTicketmasterEvents} from "./ticketmaster.js";
import {populateEventsTable} from "./ticketmaster.js";
import {listOfSelectedArtists} from "./artistSearch.js";
import {getSelectedGenres} from "./index.js";
import {displayConcertSearchResults, clearEventsTable} from "./tableDisplay.js";


let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let genreInput = document.getElementById("genre");
let stateInput = document.getElementById("state");
let cityInput = document.getElementById("city");

var drp = $('input[name="daterange"]').data('daterangepicker');
let daterange = document.getElementById("daterange");


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
    var startDate = drp.startDate.format('YYYY-MM-DD');
    var endDate = drp.endDate.format('YYYY-MM-DD');
    let dateRangeVal = daterange.value; 
    
    if (dateRangeVal == ""){
        startDate = ""
        endDate = ""
    } else {
        startDate = startDate + "T00:00:00Z";
        endDate = endDate + "T23:59:00Z";
    }

    let eventSearchPromise = getTicketmasterEvents(selectedArtists, selectedGenres, city, state, startDate, endDate);
    eventSearchPromise.then((body) => {
        console.log(body);
        populateEventsTable(body);
        document.getElementById("allConcerts").click();
    })

    // clearEventsTable()
    // let displayConcertSearchPromise = displayConcertSearchResults(eventSearchPromise)

    // eventSearchPromise.then({body} => {
    //     //submit to populate table
    //     //submit to populate map
    // })


}

submitSearchButton.addEventListener("click", submitSearch);