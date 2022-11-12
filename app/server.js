let express = require("express");
let axios = require("axios");
let app = express();
let port = 8888;
let hostname = "localhost";

// Spotify Test
  /**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

   var request = require('request'); // "Request" library
   var cors = require('cors');
   const querystring = require('querystring');
   var cookieParser = require('cookie-parser');
  
   const env = require("../env.json");
   var client_id = env.client_id; // Your client id
   var client_secret = env.client_secret; // Your secret
   var redirect_uri = env.redirect_uri; // Your redirect uri
   
   /**
    * Generates a random string containing numbers and letters
    * @param  {number} length The length of the string
    * @return {string} The generated string
    */
   var generateRandomString = function(length) {
     var text = '';
     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   
     for (var i = 0; i < length; i++) {
       text += possible.charAt(Math.floor(Math.random() * possible.length));
     }
     return text;
   };
   
   var stateKey = 'spotify_auth_state';
   var  user_access_token = null;
   
   app.use(express.static(__dirname + '/public'))
      .use(cors())
      .use(cookieParser());
   
   app.get('/login', function(req, res) {
   
     var state = generateRandomString(16);
     res.cookie(stateKey, state);
   
     // your application requests authorization
     var scope = 'user-read-private user-read-email user-top-read';
    //  https://developer.spotify.com/documentation/general/guides/authorization/scopes/#user-top-read
     res.redirect('https://accounts.spotify.com/authorize?' +
       querystring.stringify({
         response_type: 'code',
         client_id: client_id,
         scope: scope,
         redirect_uri: redirect_uri,
         state: state
       }));
   });
   
   app.get('/callback', function(req, res) {
   
     // your application requests refresh and access tokens
     // after checking the state parameter
   
     var code = req.query.code || null;
     var state = req.query.state || null;
     var storedState = req.cookies ? req.cookies[stateKey] : null;
   
     if (state === null || state !== storedState) {
       res.redirect('/#' +
         querystring.stringify({
           error: 'state_mismatch'
         }));
     } else {
       res.clearCookie(stateKey);
       var authOptions = {
         url: 'https://accounts.spotify.com/api/token',
         form: {
           code: code,
           redirect_uri: redirect_uri,
           grant_type: 'authorization_code'
         },
         headers: {
           'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
         },
         json: true
       };
   
       request.post(authOptions, function(error, response, body) {
         if (!error && response.statusCode === 200) {

          console.log("accestoken",body.access_token);

          user_access_token = body.access_token;
   
           var access_token = body.access_token,
               refresh_token = body.refresh_token;
   
           var options = {
             url: 'https://api.spotify.com/v1/me',
             headers: { 'Authorization': 'Bearer ' + access_token },
             json: true
           };
   
           // use the access token to access the Spotify Web API
           request.get(options, function(error, response, body) {
             console.log(body);
           });
   
           // we can also pass the token to the browser to make requests from there
           res.redirect('/#' +
             querystring.stringify({
               access_token: access_token,
               refresh_token: refresh_token
             }));
         } else {
           res.redirect('/#' +
             querystring.stringify({
               error: 'invalid_token'
             }));
         }
       });
     }
   });
   
   app.get('/refresh_token', function(req, res) {
   
     // requesting access token from refresh token
     var refresh_token = req.query.refresh_token;
     var authOptions = {
       url: 'https://accounts.spotify.com/api/token',
       headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
       form: {
         grant_type: 'refresh_token',
         refresh_token: refresh_token
       },
       json: true
     };
   
     request.post(authOptions, function(error, response, body) {
       if (!error && response.statusCode === 200) {
         var access_token = body.access_token;
         res.send({
           'access_token': access_token
         });
       }
     });
   });

   app.get("/artists", async (req, res) => {
    let type = 'artists'
    let range = 'medium_term'
    var config = {
      method: 'get',
      url: `https://api.spotify.com/v1/me/top/${type}?time_range=${range}`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${user_access_token}`
      }
    };
    
    axios(config)
    .then(function (response) {
      res.json(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });

   });

   const dummyArtistData = require("../dummyArtistData.json");

   app.get("/artistSearch", async (req, res) => {
    // var config = {
    //   method: 'get',
    //   url: `https://api.spotify.com/v1/search?q=artist:${req.artist}&type=artist&limit=10`,
    //   headers: { 
    //     'Content-Type': 'application/json', 
    //     'Authorization': `Bearer ${user_access_token}`
    //   }
    // };
    
    // axios(config).then(function (response) {
    //   console.log(response.data.artists.items);
    //   res.json(response.data);
    // }).catch(function (error) {
    //   console.log(error);
    // });
    let artist = req.query.artist;
    console.log(artist);
    // The following code is temporarily here to simulate searching for an artist by entering the letters "a", "b", or "c"
    if (artist === "a") {
      console.log("a");
      res.json(dummyArtistData.a.artists.items);
    }
    else if (artist === "b") {
      console.log("b");
      res.json(dummyArtistData.b.artists.items);
    }
    else if (artist === "c") {
      console.log("c");
      res.json(dummyArtistData.c.artists.items);
    }
    else {
      console.log("d");
      res.json(dummyArtistData.other.artists.items);
    }
   });

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("public/index.html"); 
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});