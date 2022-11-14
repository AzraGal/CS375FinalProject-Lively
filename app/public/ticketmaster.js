let tmGetGenreButton = document.getElementById('buttonTicketMasterGenres');

tmGetGenreButton.addEventListener("click", () => {
    console.log("fetching Genres from TicketMaster");
    fetch('/tmGenres').then((response) => {
        return response.json();
    }).then((body)=>{
        console.log(body);
    })
})