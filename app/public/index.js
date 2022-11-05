
let vicbutton = document.getElementById('buttontopartist');


vicbutton.addEventListener("click", () => {

    fetch('/artists').then((response) => {
        return response.json();
    }).then((body) => {
        console.log(body);

        let artists = [];

        for (let i = 0; i < body.items.length; i++) {
            const element = body.items[i];

            artists.push(element.name);

        }

        console.log(artists);
    })

})