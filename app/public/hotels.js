let search = document.getElementById("search");
let searchLocation = document.getElementById("location");
let destinationID; 

search.addEventListener("click", () => {
    let searchLocationVal = searchLocation.value;

    fetch("/hotels?searchLocation=" + searchLocationVal).then((response) => {
        return response.json(); 
    }).then((body) => {
        console.log(body);
    }); 
});