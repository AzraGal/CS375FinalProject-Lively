let axios = require("axios");
let express = require("express");
let app = express();
let apiFile = require("../env.json");
let port = 3000;
let hostname = "localhost";

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("public/index.html"); 
});

app.get("/hotels", (req, res) => {
    const hotelDestConfig = {
        params: {
            query: req.query.searchLocation,
            currency: "USD",
            locale: "en_US"
        }, 
        headers: {
            "X-RapidAPI-Key": apiFile["hotels_api_key"],
            "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
        }
    }

    axios.get('https://hotels-com-provider.p.rapidapi.com/v1/destinations/search', hotelDestConfig)
        .then((response) => { res.json(response.data); })
        .catch((error) => { console.log(error); });
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});