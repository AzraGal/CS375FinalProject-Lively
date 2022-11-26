import {displayConcertSearchResults} from "./tableDisplay.js"; //be sure to delete this after development and before deployment

export { getTicketmasterEvents }

let tmGetGenreButton = document.getElementById('buttonTicketMasterGenres');
let tmGetEventsButton = document.getElementById('buttonTicketMasterEvents');

let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let genreInput = document.getElementById("genre");
let locationInput = document.getElementById("location");

tmGetGenreButton.addEventListener("click", () => {
    console.log("fetching Genres from TicketMaster");
    fetch('/tmGenres').then((response) => {
        return response.json();
    }).then((body)=>{
        console.log(body);
    })
})

tmGetEventsButton.addEventListener("click", () => {
    console.log("fetching Events from TicketMaster");
    let promise = getTicketmasterEvents();
    let displayPromise = displayConcertSearchResults(promise)
    console.log(promise);
})

function getTicketmasterEvents() {
    //returns a promise of fetch call to server 
    console.log("fetching Events from TicketMaster with search parameters:");//TODO: add search parameter logging printing here
    return fetch('/tmEvents').then((response) => {
        return response.json();
    })
}