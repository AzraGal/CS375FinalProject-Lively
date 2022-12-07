import {displayConcertSearchResults} from "./tableDisplay.js"; //be sure to delete this after development and before deployment

export { getTicketmasterEvents }

let tmGetGenreButton = document.getElementById('buttonTicketMasterGenres');
let tmGetEventsButton = document.getElementById('buttonTicketMasterEvents');

let submitSearchButton = document.getElementById("submitSearchButton");
let artistInput = document.getElementById("artist");
let genreInput = document.getElementById("genre");
let locationInput = document.getElementById("location");

let eventTable = document.getElementById("eventsTable")
let eventTableBody = document.getElementById("eventsTableBody")

// 
// function showHideEventRow(row) {
//     $("#" + row).toggle();
// }


eventTable.addEventListener("click", function(event) {
    let rowid = 'info' + event.target.parentNode.id;
    let inforow = document.getElementById(rowid);

    if (inforow.className == 'show_row'){
        inforow.className='hidden_row';
    }else if (inforow.className == 'hidden_row'){
        inforow.className='show_row';
    }

//   while (target && target.tagName !== "TR") {
//     target = target.parentNode;
//   }
//   if (target) {
//     // target is the clicked row
//     console.log(target);
//   }
});



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
    let promise = getTicketmasterEvents(["Wage War", "We Came As Romans"], ["Metal"], "Philadelphia,PA");
    let displayPromise = displayConcertSearchResults(promise)
    console.log(promise);
})

function getTicketmasterEvents(selectedArtists, selectedGenres, city, state, startDate, endDate) {
// function getTicketmasterEvents() {
    //returns a promise of fetch call to server 
    console.log("fetching Events from TicketMaster with search parameters:");//TODO: add search parameter logging printing here
    // console.log(selectedArtists);
    return fetch(`/tmEvents`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({selectedArtists: selectedArtists, 
                                selectedGenres: selectedGenres,
                                city: city,
                                state: state,
                                startDate: startDate,
                                endDate: endDate,
        }),
    }).then((response) => {
        return response.json();
    }).then((body)=>{
        // console.log(body);
        // populateEventsTable(body);
        return body;
    })
};

export function populateEventsTable(body) {
    
    clearEventsTable();
    
    if (body['_embedded'] == undefined ||
        (body['_embedded'].events == undefined)
    ){
        console.error("Server reply contains no _embedded object or no _embedded.events object")
        return;
    } 
    
    let events = body['_embedded'].events;
    console.log(events);

    for (let i = 0; i < events.length; i++) {
        let event = events[i];

        let eventName = event.name;
        
        let otherEvents = document.createElement('div');
        otherEvents.className = 'col2container';
        // console.log(event);
        // console.log(event["_embedded"]);
        let otherEventsheader = document.createElement('h5');     
        if (event["_embedded"] != undefined && event["_embedded"]["attractions"] != undefined) {
        // if (event["_embedded"].hasOwnProperty("attractions")) {
            let attractions = event["_embedded"].attractions;   
            if (attractions != undefined && 
                attractions.length  > 1){
                otherEventsheader.textContent = "Other Attractions:";
                for (let i = 1; i < attractions.length; i++) {
                    const event = attractions[i];
                    let eventLine = document.createElement('p');
                    eventLine.textContent = event.name;
                    otherEvents.append(eventLine)
                }
            }
        }

        let eventDate = event.dates.start.localDate;
        let eventStatus = event.dates.status.code;
        let eventVenue ='';
        if(event["_embedded"] != undefined && event["_embedded"]["venues"] != undefined){
            if (event["_embedded"]["venues"][0]["name"] != undefined) {
                eventVenue = event["_embedded"].venues[0].name;
            }
            else if (event["_embedded"]["venues"][0]["address"] != undefined && event["_embedded"]["venues"][0]["address"]["line1"] != undefined) {
                eventVenue = event["_embedded"]["venues"][0]["address"]["line1"];
            }
            else {
                eventVenue = "N/A";
            }
        }
        else {
            eventVenue = "N/A"
        }
        let eventLat ='' ;
        let eventLog='';
        if(event["_embedded"] != undefined && event["_embedded"]["venues"] != undefined && event["_embedded"]["venues"][0].location != undefined){
            eventLat  = event["_embedded"].venues[0].location.latitude;
            eventLog  = event["_embedded"].venues[0].location.longitude;
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

        let banner = null;
        for (let j = 0; j < event.images.length; j++) {
            if (event.images[j].ratio == "16_9" && event.images[j].width == 2048) {
                banner = event.images[j].url;
                break
            }
        }


        let eventLink = event.url;

        let row = document.createElement('tr');
        row.id = `row${i}`;

        let rowData1 = document.createElement('td');
        let rowData2 = document.createElement('td');
        let rowData3 = document.createElement('td');
        let rowData4 = document.createElement('td');
        let rowData5 = document.createElement('td');
        
        let rowData6 = document.createElement('td');
        rowData6.style.cssText = 'display:none;';
        let rowData7 = document.createElement('td');
        rowData7.style.cssText = 'display:none;';
        let rowData8 = document.createElement('td');
        rowData8.style.cssText = 'display:none;';

        rowData1.textContent = eventName;
        rowData2.textContent = eventDate;
        rowData3.textContent = eventVenue;
        rowData4.textContent = eventPriceRange;
        
        let link = document.createElement('a')
        link.textContent = "Link to Purchase Ticket";
        link.target = "_blank";
        link.href = eventLink;
        
        let info = document.createElement('h5');
        info.textContent = eventStatus + ":";
        info.append(link);
        
        rowData5.append(info);
        rowData5.append(otherEventsheader);
        rowData5.append(otherEvents);
        
        rowData6.textContent = eventLat;
        rowData7.textContent = eventLog;
        rowData8.textContent = banner;

        row.append(rowData1);
        row.append(rowData2);
        row.append(rowData3);
        row.append(rowData4);
        row.append(rowData6);
        row.append(rowData7);
        row.append(rowData8);

        eventTableBody.append(row);	
        
        // Dropdown Row
        let infoRow = document.createElement('tr');
        infoRow.id = `inforow${i}`;
        infoRow.className='hidden_row';

        rowData5.colSpan = "4";
        infoRow.append(rowData5);

        eventTableBody.append(infoRow);	
            
    }
} 

function clearEventsTable() {
    while (eventTableBody.childElementCount > 0) {
        eventTableBody.firstElementChild.remove();   
    }
}