import * as index from "./index.js";

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

vicbutton.addEventListener("click", () => {
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
        console.log("spotifyTopArtists", spotifyTopArtists);
        console.log("spotifyTopGenres", spotifyTopGenres);
        convertSpotifyToTicketMasterGenre();
        fetch(`/spotifyGenreEvents?genreIDs=${convertedGenreIDs.toString()}`).then((response) => {
            return response.json();
        });
    });
})

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
let convertedGenreIDs = [];

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
        //convertedGenreIDs.push(subGenreMap.get("Other"));
      }
    }
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