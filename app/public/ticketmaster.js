let tmGetGenreButton = document.getElementById('buttonTicketMasterGenres');
let tmGetEventsButton = document.getElementById('buttonTicketMasterEvents');

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
    fetch('/tmEvents').then((response) => {
        return response.json();
    }).then((body)=>{
        console.log(body);
    })
})