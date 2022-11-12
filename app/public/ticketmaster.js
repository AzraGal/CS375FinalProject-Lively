let tmGetGenreButton = document.getElementById('buttonTicketMasterGenres');

tmGetGenreButton.addEventListener("click", () => {
    fetch('/tmGenres').then((response) => {
        return response.json();
    }).then((body)=>{
        console.log(body);
    })
})