let express = require("express");
let app = express();
let port = 3000;
let hostname = "localhost";

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("public/index.html"); 
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});