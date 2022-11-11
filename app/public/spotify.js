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
        console.log(spotifyTopArtists);
        console.log(spotifyTopGenres);
    })

})