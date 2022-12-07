let axios = require("axios");
let express = require("express");
let app = express();
let port = process.env.PORT || 8888;
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

var TMtimeoutCounter = 5;

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
    url: `https://app.ticketmaster.com/discovery/v2/attractions.json?classificationName=music&apikey=${process.env.TICKETMASTERAPIKEY}&keyword=${req.query.artist}&size=10`,
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

const delay = (delayInms) => {
	return new Promise(resolve => setTimeout(resolve, delayInms));
}

// app.post("/tmEvents", async (req, res) => {//find query parameters here: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
app.post('/tmEvents', async (req, res) => {//find query parameters here: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
	console.log(req.body, req.body.selectedArtists.length);
	let selectedArtists = req.body.selectedArtists;
	let selectedGenres = req.body.selectedGenres;
	let startDate = req.body.startDate;
	let endDate = req.body.endDate;
	let city = req.body.city;
	let state= req.body.state;
	let locale = "en-us";

	let pageSize = 200

	if ( (selectedArtists == undefined) ||
			(selectedGenres == undefined) || //TODO: Benedict, add checking if any of the arrays contain invalid entries, like numbers for genres. Check your old homeworks for thats
			(startDate == undefined) || 
			(endDate == undefined) || 
			(city == undefined) || 
			(state == undefined)
	){
		res.status(400).json({error: "Not all post request fields were populated!"});
	}

	let combinedGenres = "music,"
	if ( !(selectedGenres.length <= 0) ){
		combinedGenres = selectedGenres[0]
		for (let index = 1; index < selectedGenres.length; index++) {
			const element = selectedGenres[index];
			combinedGenres = combinedGenres + ',' + element;
		}
	}
	console.log(combinedGenres);

	let urlBase = `https://app.ticketmaster.com/discovery/v2/events.json?&apikey=${process.env.TICKETMASTERAPIKEY}&locale=${locale}`
	let countryCodeQueryParam = "&countryCode=US"
	let cityQueryParam = `&city=${city}`
	let stateQueryParam = `&stateCode=${state}`
	let keywordQueryParam = '&keyword=';
	let pageSizeQueryParam = `&size=${pageSize}`;
	let allRequestPromises = []
	let allRequestResults = {_embedded:{events:[]}}
	let classificationNameQueryParam = `&classificationName=${combinedGenres}`
	let startDateQueryParam = `&startDateTime=${startDate}`
	let endDateQueryParam = `&endDateTime=${endDate}`

	let url = urlBase + 
				countryCodeQueryParam + 
				keywordQueryParam + 
				classificationNameQueryParam + 
				cityQueryParam + 
				stateQueryParam + 
				startDateQueryParam +
				endDateQueryParam +
				pageSizeQueryParam;

	if ( !(selectedArtists.length <= 0) ){
		for (let index = 0; index < selectedArtists.length; index++) {
			const element = selectedArtists[index];
			keywordQueryParam = `&keyword=${element}`;
			pageSize = 20
			pageSizeQueryParam = `&size=${pageSize}`;
			url = urlBase + 
				countryCodeQueryParam + 
				keywordQueryParam + 
				classificationNameQueryParam + 
				cityQueryParam + 
				stateQueryParam + 
				startDateQueryParam +
				endDateQueryParam +
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
				console.log(response);
				if ( !(response.data._embedded == undefined) ){
					return response.data._embedded.events
				} else {
					return null
				}
			})
			.catch(function (error) {
				// console.log(Object.getOwnPropertyNames(error.response.headers));
				console.log(error);
			});
			// console.log(requestPromise);
			allRequestPromises.push(requestPromise)
		}
		Promise.all(allRequestPromises).then((arrayOfRequestedEvents) => {
			console.log("arrayOfRequestedEvents", arrayOfRequestedEvents);
			arrayOfRequestedEvents.forEach(requestedEventSet => {
				if ( !(requestedEventSet == undefined) ||
						!(requestedEventSet == null)
				){
					requestedEventSet.forEach(event => {
						allRequestResults["_embedded"].events.push(event)
					});
				}
			});
		}).then( () => {
			// console.log("allRequestResults length", allRequestResults);
			res.json(allRequestResults)
			// console.log(allRequestResults);
		})
	} else {
		let requestPromise = axios(url)
		.then(response => {
			res.json(response.data) 
		})
		.catch(function (error) {
			console.log(error);
		});
	}
})

app.get("/spotifyArtistEvents", async (req, res) => {
	let artist = req.query.artist;
	let size = 200;
	let baseURL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=US&size=${size}&keyword=${artist}&apikey=${process.env.TICKETMASTERAPIKEY}`;
	console.log(baseURL);
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
	let baseURL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=US&size=${size}&subGenreId=`;
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

app.get("/hotelCoordinates", (req, res) => {
	const hotelCoordConfig = {
		headers: {
			'X-Api-Key': process.env.GEOCODING_KEY
		}
	}

	axios.get('https://api.api-ninjas.com/v1/reversegeocoding?lat=' + req.query.lat + '&lon=' + req.query.long, hotelCoordConfig)
        .then((response) => { res.json(response.data); })
        .catch((error) => { console.log(error); });
});

app.get("/hotelRegion", (req, res) => {
    const hotelDestConfig = {
        params: {
            query: req.query.searchCity,
            domain: "US",
            locale: "en_US"
        }, 
        headers: {
            "X-RapidAPI-Key": process.env.HOTELS_API_KEY,
            "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
        }
    }

    axios.get('https://hotels-com-provider.p.rapidapi.com/v2/regions', hotelDestConfig)
        .then((response) => { res.json(response.data); })
        .catch((error) => { console.log(error); });
});

app.get("/hotels", (req, res) => {
    const hotelConfig = {
        params: {
			region_id: req.query.regionId,
            domain: "US",
            locale: "en_US",
            checkin_date: "2023-06-29",
            checkout_date: "2023-06-30",
            sort_order: "DISTANCE",
            adults_number: "2"
        },
        headers: {
            "X-RapidAPI-Key": process.env.HOTELS_API_KEY,
            "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
        }
    }

    axios.get('https://hotels-com-provider.p.rapidapi.com/v2/hotels/search', hotelConfig)
        .then((response) => { res.json(response.data); })
        .catch((error) => { console.log(error); });
});

app.listen(port, () => {
    console.log(`Server is listening on: ${port}`);
});

app.get("/hotelDetails", (req, res) => {
	const hotelDetailConfig = {
		params: {
			domain: "US",
			locale: "en_US",
			hotel_id: req.query.hotelId
		},
		headers: {
			"X-RapidAPI-Key": env["hotels_api_key"],
            "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
		}
	}

	axios.get('https://hotels-com-provider.p.rapidapi.com/v2/hotels/details', hotelDetailConfig)
        .then((response) => { res.json(response.data); })
        .catch((error) => { console.log(error); });
})

//backgrounded worker periodic information fetching services
setInterval(function() {
	getMusicClassificationId();
}, 1800000); //1800000 is every 30 min
getMusicClassificationId()


// setInterval(() => {
// 	console.log(TMtimeoutCounter = 5);
// }, 1000);

function getMusicClassificationId() {
	let url = `https://app.ticketmaster.com/discovery/v2/classifications.json?apikey=${process.env.TICKETMASTERAPIKEY}`
	axios(url)
	.then(response => {
		musicID = response.data._embedded.classifications[2].segment.id;
		// console.log(musicID)
	})
	.catch(function (error) {
		console.log(error);
	});
}
