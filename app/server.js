let axios = require("axios");
let express = require("express");
let app = express();
let port = process.env.PORT || 8888;
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
		client_id: process.env.CLIENT_ID,
		scope: scope,
		redirect_uri: process.env.REDIRECT_URI,
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
		redirect_uri: process.env.REDIRECT_URI,
		grant_type: 'authorization_code'
		},
		headers: {
		'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
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
	headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) },
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
})

app.get("/artistSearchTicketMaster", async (req, res) => {
  var config = {
    method: 'get',
    url: `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${process.env.TICKETMASTERAPIKEY}&keyword=${req.query.artist}&size=10`,
    headers: { 
      'Content-Type': 'application/json'
    }
  };

  axios(config).then(function (response) {
    return res.json(response.data._embedded.attractions);
  }).catch(function (error) {
    console.log(error);
    return res.sendStatus(400);
  });
});

app.get("/artistSearchSpotify", async (req, res) => {
  var config = {
    method: 'get',
    url: `https://api.spotify.com/v1/search?q=artist:${req.query.artist}&type=artist&limit=10`,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${user_access_token}`
    }
  };

  axios(config).then(function (response) {
    return res.json(response.data.artists.items);
  }).catch(function (error) {
    console.log(error);
    return res.sendStatus(400);
  });
});

app.get("/tmGenres", async (req, res) => {
	let musicID = "KZFzniwnSyZfZ7v7nJ" //TODO: implement a classification getter so we always have the most up-to-date ID
	let url = `https://app.ticketmaster.com/discovery/v2/classifications/${musicID}.json?apikey=${process.env.TICKETMASTERAPIKEY}`
	axios(url)
	.then(response => {
		// console.log(response.data);
		//response.data.segment._embedded.genres contains all genres with subgenres within each at: response.data.segment._embedded.genres[#]._embedded
		console.log(response.data.segment._embedded.genres); 
		res.json(response.data.segment._embedded.genres)
	})
	.catch(function (error) {
		console.log(error);
	});
})

app.get("/tmEvents", async (req, res) => {//find query parameters here: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
	let city = "Philadelphia"
	let heavyMetalSubGenreId = "KZazBEonSMnZfZ7vkFd"
	let indieRockSubGenreId = "KZazBEonSMnZfZ7vAde"
	let pageSize = 200
	
	let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${pageSize}&subGenreId=${heavyMetalSubGenreId + ',' + indieRockSubGenreId}&apikey=${process.env.TICKETMASTERAPIKEY}`
	axios(url)
	.then(response => {
		console.log(response.data);
		//response.data.segment._embedded.genres contains all genres with subgenres within each at: response.data.segment._embedded.genres[#]._embedded
		res.json(response.data)
	})
	.catch(function (error) {
		console.log(error);
	});
})

app.get("/spotifyArtistEvents", async (req, res) => {
	let artist = req.query.artist;
	let size = 200;
	let baseURL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=${size}&keyword=${artist}&apikey=${process.env.TICKETMASTERAPIKEY}`;
	axios(baseURL).then(response => {
		res.json(response.data)
	})
	.catch(function (error) {
		console.log(error);
	});
});

app.get("/spotifyGenreEvents", async (req, res) => {
	let genreIDs = req.query.genreIDs.split(",");
	let size = 200;
	let baseURL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=${size}&subGenreId=`;
	for (let id of genreIDs) {
		baseURL += `${id},`;
	}
	baseURL = baseURL.substring(0, baseURL.length - 1);
	baseURL += `&apikey=${process.env.TICKETMASTERAPIKEY}`;
	axios(baseURL).then(response => {
		res.json(response.data)
	})
	.catch(function (error) {
		console.log(error);
	});
});

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("public/index.html"); 
});

app.get("/hotelsCoordinates", (req, res) => {
    const hotelDestConfig = {
        params: {
            query: req.query.searchLocation,
            currency: "USD",
            locale: "en_US"
        }, 
        headers: {
            "X-RapidAPI-Key": process.env.HOTELS_API_KEY,
            "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
        }
    }

    axios.get('https://hotels-com-provider.p.rapidapi.com/v1/destinations/search', hotelDestConfig)
        .then((response) => { res.json(response.data); })
        .catch((error) => { console.log(error); });
});

app.get("/hotels", (req, res) => {
    const hotelConfig = {
        params: {
            latitude: req.query.latitude,
            longitude: req.query.longitude,
            currency: "USD",
            locale: "en_US",
            checkin_date: "2022-11-25",
            checkout_date: "2022-11-27",
            sort_order: "PRICE",
            adults_number: "2"
        },
        headers: {
            "X-RapidAPI-Key": process.env.HOTELS_API_KEY,
            "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
        }
    }

    axios.get('https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby', hotelConfig)
        .then((response) => { res.json(response.data); })
        .catch((error) => { console.log(error); });
});

// app.listen(port, hostname, () => {
//     console.log(`http://${hostname}:${port}`);
// });

app.listen(port, () => {
    console.log(`Server is listening on: ${port}`);
});