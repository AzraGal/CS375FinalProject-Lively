let suggestedArtists = document.getElementById("suggestedArtists");
let artistInput = document.getElementById("artist");
var artistOptionsData = [];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const validKeys = ["click", "Backspace", "Delete", " "];

function artistSearch(key) {
    if (validKeys.includes(key) || letters.includes(key.toUpperCase())) {
        while (suggestedArtists.firstChild) {
            suggestedArtists.removeChild(suggestedArtists.firstChild);
        }
        if (document.getElementById("user-profile").childElementCount !== 0) {
            artistSearchSpotify();
        }
        else {
            artistSearchTicketMaster();
        }
    }
}

function artistSearchSpotify() {
    fetch(`/artistSearchSpotify?artist=${artistInput.value}`).then(response => {
        if (response.status === 200) {
            response.json().then(body => {
                populateSuggestedArtistsList(body);
            });
        }
    });
}

function artistSearchTicketMaster() {
    fetch(`/artistSearchTicketMaster?artist=${artistInput.value}`).then(response => {
        if (response.status === 200) {
            response.json().then(body => {
                populateSuggestedArtistsList(body);
            });
        }
    });
}

function populateSuggestedArtistsList(body) {
    artistOptionsData = [];
    suggestedArtists.textContent = "Searching for: " + artistInput.value;
    for (let i = 0; i < body.length; i++) {
        artistOptionsData.push({
            id: i,
            text: body[i].name
        });
        let div = document.createElement("div");
        div.textContent = artistOptionsData[i].text;
        div.className = "suggestedArtist";
        div.addEventListener("click", () => {   
            artistInput.value = artistOptionsData[i].text;
        });
        suggestedArtists.append(div);
    }
    suggestedArtists.style = "block"; 
}

function initArtistSearch() {
    artistInput.addEventListener("keyup", (event) => {artistSearch(event.key);});
    artistInput.addEventListener("click", (event) => {artistSearch("click");});
}

initArtistSearch();