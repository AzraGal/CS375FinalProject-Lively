import * as cookies from "./cookies.js";

let suggestedArtists = document.getElementById("suggestedArtists");
let artistInput = document.getElementById("artist");
let selectedArtists = document.getElementById("selectedArtists");

export let listOfSelectedArtists = [];

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
        let artistName = body[i].name;
        if (!artistOptionsData.includes(artistName)) {
            artistOptionsData.push(artistName);
            let div = document.createElement("div");
            div.textContent = artistName;
            div.className = "suggestedArtist";
            div.addEventListener("click", () => {   
                artistInput.value = artistName;
                addToSelectedArtists(artistName);
                if (cookies.cookieConsent !== "") {
                    cookies.deleteCookie("selected_artists");
                    cookies.setCookie("selected_artists", JSON.stringify(artistOptionsData), 30);
                }
            });
            suggestedArtists.append(div);
        }
    }
    suggestedArtists.style = "block"; 
}

export function addToSelectedArtists(artistName) {
    if (!listOfSelectedArtists.includes(artistName)) {
        listOfSelectedArtists.push(artistName);
        let div = document.createElement("div");
        div.className = "selectedArtist";
        div.textContent = "X   " + artistName;
        selectedArtists.append(div);
        div.addEventListener("click", () => {   
            div.remove();
            listOfSelectedArtists = listOfSelectedArtists.filter(function(artist) {return artist !== artistName;});
            if (cookies.cookieConsent !== "") {
                cookies.deleteCookie("selected_artists");
                cookies.setCookie("selected_artists", JSON.stringify(listOfSelectedArtists), 30);
            }
        });
    }
}

function initArtistSearch() {
    artistInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            addToSelectedArtists(artistInput.value);
        }
        else {
            artistSearch(event.key);
        }
    });
    artistInput.addEventListener("click", (event) => {artistSearch("click");});
}

initArtistSearch();
// export {listOfSelectedArtists}