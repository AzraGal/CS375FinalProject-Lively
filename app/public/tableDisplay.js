// import * as tm from "./ticketmaster.js";

export { displayConcertSearchResults }
export { clearEventsTable }

let eventTable = document.getElementById('eventsTable');
// (eventTable).scrollTableBody();
let eventTableBody = document.getElementById('eventsTableBody');

function displayConcertSearchResults(promise) {
    promise.then((body)=>{
        // console.log(body);

        let events = body['_embedded'].events;

        console.log(events);

        for (let i = 0; i < events.length; i++) {
            let event = events[i];

            let eventName = event.name;
            let eventDate = event.dates.start.localDate;
            let eventVenue ='';
            if(event["_embedded"].venues !=undefined){
                eventVenue = event["_embedded"].venues[0].name;
            }else{
                eventVenue = "N/A"
            }

            let eventPriceRange = '';
            if(event.priceRanges != undefined){
                let eventPriceRangeCurrency = event.priceRanges[0].currency;
                let eventPriceRangeMin = event.priceRanges[0].min;
                let eventPriceRangeMax = event.priceRanges[0].max;
    
                eventPriceRange = eventPriceRangeCurrency +eventPriceRangeMin+"-"+eventPriceRangeMax;
            }else{
                eventPriceRange = "N/A"
            }


            let eventLink = event.url;
	
			let row = document.createElement('tr');

			let rowData1 = document.createElement('td');
			let rowData2 = document.createElement('td');
			let rowData3 = document.createElement('td');
			let rowData4 = document.createElement('td');
			let rowData5 = document.createElement('a');

            rowData1.textContent = eventName;
            rowData2.textContent = eventDate;
            rowData3.textContent = eventVenue;
            rowData4.textContent = eventPriceRange;
            
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
}

function clearEventsTable() {
    while (eventTableBody.childElementCount > 0) {
        eventTableBody.firstElementChild.remove();
    }
}