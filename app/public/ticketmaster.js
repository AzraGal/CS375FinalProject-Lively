let tmGetGenreButton = document.getElementById('buttonTicketMasterGenres');
let tmGetEventsButton = document.getElementById('buttonTicketMasterEvents');

let eventTable = document.getElementById('eventsTable');
let eventTableBody = document.getElementById('eventsTableBody');
// (eventTable).scrollTableBody();

tmGetGenreButton.addEventListener("click", () => {
    console.log("fetching Genres from TicketMaster");
    fetch('/tmGenres').then((response) => {
        return response.json();
    }).then((body)=>{
        console.log(body);
    })
})

tmGetEventsButton.addEventListener("click", () => {
    console.log("fetching Events from TicketMaster");
    fetch('/tmEvents').then((response) => {
        return response.json();
    }).then((body)=>{
        // console.log(body);

        let events = body['_embedded'].events;

        console.log(events);

        for (let i = 0; i < events.length; i++) {
            let event = events[i];

            let eventName = event.name;
            let eventDate = event.dates.start.localDate;
            let eventVenue = event.dates.start.localDate;
            // let eventPriceRangeCurrency = event.priceRanges[0].currency;
            // let eventPriceRangeMin = event.priceRanges[0].min;
            // let eventPriceRangeMax = event.priceRanges[0].max;

            // let eventPriceRange = eventPriceRangeCurrency +eventPriceRangeMin+"-"+eventPriceRangeMax;

            let eventLink = event.url;
	
			let row = document.createElement('tr');

			let rowData1 = document.createElement('td');
			let rowData2 = document.createElement('td');
			let rowData3 = document.createElement('td');
			let rowData4 = document.createElement('td');
			let rowData5 = document.createElement('a');

            rowData1.textContent = eventName;
            rowData2.textContent = eventDate;
            rowData3.textContent = 'eventVenue';
            rowData4.textContent = 'eventPriceRange';
            
            rowData5.textContent = "L";
            rowData5.target = "_blank";
            rowData5.href = eventLink;
	
			row.append(rowData1);
			row.append(rowData2);
			row.append(rowData3);
			row.append(rowData4);
			row.append(rowData5);
	
			eventTableBody.append(row);	
		}


    })
})