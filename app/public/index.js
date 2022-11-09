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

vicbutton.addEventListener("click", () => {

    fetch('/artists').then((response) => {
        return response.json();
    }).then((body) => {
        let artists = [];
        let genres = [];

        for (let i = 0; i < body.items.length; i++) {
            const element = body.items[i];

            artists.push(element.name);

            for (let g = 0; g < element.genres.length; g++) {
                const genre = element.genres[g];

                if(!genres.includes(genre)){
                    genres.push(genre);
                }
                
            }
        }
        console.log(artists);
        console.log(genres);
    })

})