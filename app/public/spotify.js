import * as index from "./index.js";
import * as ticketmaster from "./ticketmaster.js";
import * as cookies from "./cookies.js";

let newToken = document.getElementById('obtain-new-token');
newToken.addEventListener('click', function() {
    $.ajax({
      url: '/refresh_token',
      data: {
        'refresh_token': refresh_token
      }
    }).done(function(data) {
      access_token = data.access_token;
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });
    });
  }, false);

// let loginSpotify = document.getElementById('loginSpotify');

// loginSpotify.addEventListener('click', function() {
//     console.log('here');
//     fetch('/login').then((response) => {
//         return response.json();
//     })
// });

let vicbutton = document.getElementById('buttontopartist');

let spotifyTopArtists = []
let spotifyTopGenres = []
let spotifyEvents = {_embedded: {"events": []}};
let eventsTimer = null;

vicbutton.addEventListener("click", () => {
    if (cookies.cookieConsent !== "" && window.localStorage.getItem("spotifyEvents")) {
        ticketmaster.populateEventsTable(spotifyEvents);
    }
    else {
      fetch('/artists').then((response) => {
        return response.json();
      }).then((body) => {

        for (let i = 0; i < body.items.length; i++) {
            const element = body.items[i];
            spotifyTopArtists.push(element.name);

            for (let g = 0; g < element.genres.length; g++) {
                const genre = element.genres[g];

                if(!spotifyTopGenres.includes(genre)){
                    spotifyTopGenres.push(genre);
                }
            }
        }
        if (cookies.cookieConsent !== "") {
            cookies.deleteCookie("spotifyTopArtists");
            cookies.deleteCookie("spotifyTopGenres");
            cookies.setCookie("spotifyTopArtists", JSON.stringify(spotifyTopArtists), 30);
            cookies.setCookie("spotifyTopGenres", JSON.stringify(spotifyTopGenres), 30);
        }
        console.log("spotifyTopArtists", spotifyTopArtists);
        console.log("spotifyTopGenres", spotifyTopGenres);
        convertSpotifyToTicketMasterGenre();
        eventsTimer = setInterval(fetchEvents, 750);
      });
    }
});

let artistCount = 0;
let loadingContainer = document.getElementById("loadingContainer");

function fetchEvents() {
  loadingContainer.style.display = "";
  let artist = spotifyTopArtists[artistCount];
  fetch(`/spotifyArtistEvents?artist=${artist}`).then((response) => {
      return response.json();
    }).then((body)=> {
      addEventsToList(body);
  });
  artistCount++;
  if (artistCount === spotifyTopArtists.length) {
    clearInterval(eventsTimer);
    fetch(`/spotifyGenreEvents?genreIDs=${convertedGenreIDs.toString()}`).then((response) => {
      return response.json();
    }).then((body)=> {
      addEventsToList(body);
      if (cookies.cookieConsent !== "") {
          window.localStorage.setItem("spotifyEvents", JSON.stringify(spotifyEvents));
      }
      ticketmaster.populateEventsTable(spotifyEvents);
    });
  }
}

function addEventsToList(body) {
  if (body.hasOwnProperty('_embedded') && body['_embedded'].hasOwnProperty('events')) {
    let events = body['_embedded'].events;
    for (let event of events) {
      if (!spotifyEvents["_embedded"]["events"].includes(event) && spotifyEvents["_embedded"]["events"].length < 200) {
        spotifyEvents["_embedded"]["events"].push(event);
      }
    }
  }
}

let convertedGenres = [];
let specialGenres = [
  {"Acoustic": ["Acoustic Blues", "New Acoustic", "Electro-Acoustic"]},
  {"Afrobeat": ["Afro-Beat"]},
  {"Alt-rock": ["Alternative Rock"]},
  {"Black-metal": ["Death Metal/Black Metal", "Symphonic Black Metal", "Death Metal/ Black Metal"]},
  {"Bossanova": ["Bossa Nova"]},
  {"Breakbeat": ["Ambient Breakbeat"]},
  {"British": ["British Alternative", "British Ska", "British Blues", "2-Step/British Garage", "British Folk", "British Rap", "British Dance Bands", "New Wave Of British Heavy Metal", "British Pop", "British D416", "British Folk-Rock", "British Invasion", "British Metal", "British Psychedlia", "British Punk", "Early British Rock", "Celtic/ British Isles"]},
  {"Cantopop": ["Canto-Pop"]},
  {"Children": ["Children's Music"]},
  {"Classical": ["Classical/Vocal"]},
  {"Club": ["Club Dance"]},
  {"Dancehall": ["Dancehall Reggae"]},
  {"Death-metal": ["Death Metal/Black Metal", "Death Metal/ Black Metal"]},
  {"Detroit-techno": ["Detroit Techno"]},
  {"Drum-and-bass": ["Drum 'n' Bass"]},
  {"Edm": ["Dance/Electronic"]},
  {"French": ["French Rap", "French Pop", "French Rock"]},
  {"Garage": ["2-Step/British Garage", "U.K. Garage", "Garage Punk", "Garage Rock", "Garage Rock Revival"]},
  {"German": ["German Folk", "German Rock"]},
  {"Guitar": ["Electric Blues Guitar", "Finger-Picked Guitar", "Slide Guitar", "Guitar Gods", "Guitar Virtuoso", "Surf Guitar", "Slack Key Guitar"]},
  {"Hard-rock": ["Hard Rock"]},
  {"Hardcore": ["Happy Hardcore", "Hardcore Techno", "Hardcore Rap", "Hardcore Punk", "Post-Hardcore"]},
  {"Heavy-metal": ["Heavy Metal"]},
  {"Hip-hop": ["Hip-Hop/Rap"]},
  {"Holidays": ["Holiday"]},
  {"Honky-tonk": ["Honky Tonk"]},
  {"Idm": ["Intelligent Dance Music"]},
  {"Indian": ["India & Pakistan", "Indian Classical", "Indian Pop"]},
  {"Indie-pop": ["Indie Pop"]},
  {"Iranian": ["Iran"]},
  {"J-pop": ["Japanese Pop"]},
  {"J-rock": ["Japanese Rock"]},
  {"J Pop": ["Japanese Pop"]},
  {"J Rock": ["Japanese Rock"]},
  {"K-pop": ["K-Pop"]},
  {"Kids": ["Children's Music"]},
  {"Minimal-techno": ["Minimal Techno"]},
  {"Mpb": ["Música Popular Brasileira"]},
  {"New-age": ["New Age"]},
  {"Piano": ["Piano Blues", "Stride Piano"]},
  {"Power-pop": ["Power Pop"]},
  {"Progressive-house": ["Progressive House"]},
  {"R-n-b": ["R&B"]},
  {"Rock-n-roll": ["Rock & Roll"]},
  {"Romance": ["Ballads/Romantic"]},
  {"Sad": ["Sadcore"]},
  {"Singer-songwriter": ["Singer-Songwriter"]},
  {"Spanish": ["Rock en Español"]},
  {"Swedish": ["Swedish Rock", "Swedish Folk", "Swedish Pop/Rock"]},
  {"Synth-pop": ["Synth Pop"]},
  {"Trip-hop": ["Trip Hop"]},
  {"Turkish": ["Turkey"]},
  {"World-music": ["World"]}
];
export let convertedGenreIDs = [];

function convertSpotifyToTicketMasterGenre() {
  const subGenreMap = index.TMsubGenreMap;

  for (let genre of spotifyTopGenres) {
    let capGenre = capitalize(genre);
    if (subGenreMap.has(capGenre) && !convertedGenres.includes(capGenre)) {
      convertedGenres.push(capGenre);
      convertedGenreIDs.push(subGenreMap.get(capGenre));
    }
    else if (specialGenres.some(genre => genre[capGenre])) {
      for (let g of specialGenres) {
        if (g[capGenre]) {
          for (let sg of g[capGenre]) {
            if (!convertedGenres.includes(sg)) {
              convertedGenres.push(sg);
              convertedGenreIDs.push(subGenreMap.get(sg));
            }
          }
        }
        break;
      }
    }
    else {
      if (!convertedGenres.includes("Other")) {
        convertedGenres.push("Other");
        convertedGenreIDs.push(subGenreMap.get("Other"));
      }
    }
  }
  if (cookies.cookieConsent !== "") {
      cookies.deleteCookie("convertedGenreIDs");
      cookies.setCookie("convertedGenreIDs", JSON.stringify(convertedGenreIDs), 30);
  }
}

function capitalize(words) {
  let wordsArr = words.split(" ");
  let capitalized = "";
  for (let word of wordsArr) {
    capitalized += (" " + word.substring(0, 1).toUpperCase() + word.substring(1));
  }
  return capitalized.substring(1);
}

function init() {
  if (cookies.cookieConsent !== "" && window.localStorage.getItem("spotifyEvents")) {
      spotifyTopArtists = JSON.parse(cookies.getCookie("spotifyTopArtists").substring(1));
      spotifyTopGenres = JSON.parse(cookies.getCookie("spotifyTopGenres").substring(1));
      convertedGenreIDs = JSON.parse(cookies.getCookie("convertedGenreIDs").substring(1));
      spotifyEvents = JSON.parse(window.localStorage.getItem("spotifyEvents"));
  }
}

init();