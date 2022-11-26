import {displayConcertSearchResults} from "./tableDisplay.js";

let tmGetGenreButton = document.getElementById('buttonTicketMasterGenres');
let tmGetEventsButton = document.getElementById('buttonTicketMasterEvents');

let eventTable = document.getElementById('eventsTable');
let eventTableBody = document.getElementById('eventsTableBody');
// (eventTable).scrollTableBody();

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
    let promise = fetch('/tmEvents').then((response) => {
        return response.json();
    })
    let displayPromise = displayConcertSearchResults(promise)
    console.log(promise);
})