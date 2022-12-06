let axios = require("axios");
let express = require("express");
let app = express();
let port = 8888;
let hostname = "localhost";

//Middleware
var request = require('request'); // "Request" library
var cors = require('cors');
const querystring = require('querystring');
var cookieParser = require('cookie-parser');
const env = require("../env.json");
const { log } = require("console");
app.use(express.static("public"));
app.use(express.json());
app.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

// Spotify Test
/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var musicID = "" 

var client_id = env.client_id; // Your client id
var client_secret = env.client_secret; // Your secret
var redirect_uri = env.redirect_uri; // Your redirect uri
var ticketmasterAPIkey = env.ticketmaster_api_key //project ticketmaster API key

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
var user_access_token = null;

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
})

app.get("/artistSearchTicketMaster", async (req, res) => {
  var config = {
    method: 'get',
    url: `https://app.ticketmaster.com/discovery/v2/attractions.json?classificationName=music&apikey=${ticketmasterAPIkey}&keyword=${req.query.artist}&size=10`,
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
	// let musicID = "KZFzniwnSyZfZ7v7nJ" //TODO: implement a classification getter so we always have the most up-to-date ID. use the below comment code outside of any function in this file to accomlish this on a time-based methodology:
	// console.log(Date.now());
	// setInterval(function() {
	// 	console.log(Date.now());
	// }, 1800000); //1800000 is every 30 min
	let url = `https://app.ticketmaster.com/discovery/v2/classifications/${musicID}.json?apikey=${ticketmasterAPIkey}`
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

const delay = (delayInms) => {
	return new Promise(resolve => setTimeout(resolve, delayInms));
}

// app.post("/tmEvents", async (req, res) => {//find query parameters here: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
app.post('/tmEvents', async (req, res) => {//find query parameters here: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
	console.log(req.body, req.body.selectedArtists.length);
	let selectedArtists = req.body.selectedArtists;
	let selectedGenres = req.body.selectedGenres;
	let selectedLocation = req.body.location;
	let locale = "en-us";

	let pageSize = 200

	if ( (selectedArtists == undefined) ||
	(selectedGenres == undefined) || //TODO: add location filtering 
	(selectedLocation == undefined) //TODO: Benedict, add checking if any of the arrays contain invalid entries, like numbers for genres. Check your old homeworks for thats
	){ //TODO: test this checking for invalid requests before deployment
		res.status(400).json({error: "Not all post request fields were populated!"});
	}

	let combinedGenres = ""
	if ( !(selectedGenres.length <= 0) ){
		combinedGenres = selectedGenres[0]
		for (let index = 1; index < selectedGenres.length; index++) {
			const element = selectedGenres[index];
			combinedGenres = combinedGenres + ',' + element;
		}
	}
	// console.log(combinedGenres);

	let city = ''
	let state = ''

	let splitLocation = selectedLocation.split(",")
	if (splitLocation.length == 2){ //
		city = splitLocation[0]
		state = splitLocation[1]
	}

	let allRequestPromises = []
	let allRequestResults = {_embedded:{events:[]}}

	if ( !(selectedArtists.length <= 0) ){
		// selectedArtists.forEach(element => {
		for (let index = 0; index < selectedArtists.length; index++) {
			const element = selectedArtists[index];
			// let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${pageSize}&subGenreId=${heavyMetalSubGenreId + ',' + indieRockSubGenreId}&apikey=${ticketmasterAPIkey}`
			let urlBase = `https://app.ticketmaster.com/discovery/v2/events.json?&apikey=${ticketmasterAPIkey}&locale=${locale}`
			let classificationNameQueryParam = `&classificationName=${combinedGenres}`
			let keywordQueryParam = `&keyword=${element}`;
			let cityQueryParam = `&city=${city}`
			let stateQueryParam = `&stateCode=${state}`
			pageSize = 20
			let pageSizeQueryParam = `&size=${pageSize}`;
			let url = urlBase + 
					keywordQueryParam + 
					classificationNameQueryParam + 
					cityQueryParam + 
					stateQueryParam + 
					pageSizeQueryParam;
			console.log(url);
			// while(TMtimeoutCounter==0){console.log(TMtimeoutCounter);};
			// TMtimeoutCounter--;

			let delayres = await delay(250);

			let requestPromise = axios(url)
			.then(response => {
				// console.log(response.data);
				//response.data.segment._embedded.genres contains all genres with subgenres within each at: response.data.segment._embedded.genres[#]._embedded
				// console.log(Object.getOwnPropertyNames(response.headers));
				// console.log(response);
				console.log("TM response events.length", response.data._embedded.events.length);
				return response.data._embedded.events
				// let requestedEvents = response.data._embedded.events;
			})
			.catch(function (error) {
				// console.log(Object.getOwnPropertyNames(error.response.headers));
				console.log(error);
				// if (error.response.header)
			});
			// console.log(requestPromise);
			allRequestPromises.push(requestPromise)
		// });
		}
		Promise.all(allRequestPromises).then((arrayOfRequestedEvents) => {
			// console.log(arrayOfRequestedEvents[2].length);
			// allRequestResults.push(...arrayOfRequestedEvents);
			arrayOfRequestedEvents.forEach(requestedEventSet => {
				requestedEventSet.forEach(event => {
					allRequestResults["_embedded"].events.push(event)
				});
				
			});
		}).then( () => {
			// console.log("allRequestResults length", allRequestResults);
			res.json(allRequestResults)
			console.log(allRequestResults);
		})
	} else {
		console.log("TODO!!!");
		//TODO: write this functionality
	}
})

// app.post("/tmEvents", async (req, res) => {//find query parameters here: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
// app.post('/tmEvents', (req, res) => {//find query parameters here: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
// 	console.log(req.body, req.body.selectedArtists.length);
// 	let city = "Philadelphia"
// 	let heavyMetalSubGenreId = "KZazBEonSMnZfZ7vkFd"
// 	let indieRockSubGenreId = "KZazBEonSMnZfZ7vAde"
// 	let artistName = "Wage War"
// 	let pageSize = 200
	
// 	let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${pageSize}&subGenreId=${heavyMetalSubGenreId + ',' + indieRockSubGenreId}&apikey=${ticketmasterAPIkey}`
// 	axios(url)
// 	.then(response => {
// 		// console.log(response.data);
// 		//response.data.segment._embedded.genres contains all genres with subgenres within each at: response.data.segment._embedded.genres[#]._embedded
// 		console.log(response.data["_embedded"].events);
// 		res.json(response.data)
// 	})
// 	.catch(function (error) {
// 		console.log(error);
// 	});
// })

app.get("/spotifyArtistEvents", async (req, res) => {
	let artist = req.query.artist;
	let size = 200;
	let baseURL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=${size}&keyword=${artist}&apikey=${ticketmasterAPIkey}`;
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
	baseURL += `&apikey=${ticketmasterAPIkey}`;
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
            "X-RapidAPI-Key": env["hotels_api_key"],
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
            "X-RapidAPI-Key": env["hotels_api_key"],
            "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
        }
    }

    axios.get('https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby', hotelConfig)
        .then((response) => { res.json(response.data); })
        .catch((error) => { console.log(error); });
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});

//backgrounded worker periodic information fetching services
setInterval(function() {
	getMusicClassificationId();
}, 1800000); //1800000 is every 30 min
getMusicClassificationId()

function getMusicClassificationId() {
	let url = `https://app.ticketmaster.com/discovery/v2/classifications.json?apikey=${ticketmasterAPIkey}`
	axios(url)
	.then(response => {
		musicID = response.data._embedded.classifications[2].segment.id;
		// console.log(musicID)
	})
	.catch(function (error) {
		console.log(error);
	});
}