let tmGetGenreButton = document.getElementById('buttonTicketMasterGenres');
let tmGetEventsButton = document.getElementById('buttonTicketMasterEvents');

let eventTable = document.getElementById('eventsTable');
let eventTableBody = document.getElementById('eventsTableBody');
// (eventTable).scrollTableBody();

// 
// function showHideEventRow(row) {
//     $("#" + row).toggle();
// }

let row1 = document.getElementById("row1")

row1.addEventListener("click", () => {
    $("#" + 'hidden_row1').toggle();
});


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
            let eventVenue ='';
            if(event["_embedded"].venues !=undefined){
                eventVenue = event["_embedded"].venues[0].name;
            }else{
                eventVenue = "N/A"
            }
            let eventLat ='' ;
            let eventLog='';
            if(event["_embedded"].venues !=undefined){
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
			let rowData5 = document.createElement('a');
            
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
            
            rowData5.textContent = "L";
            rowData5.target = "_blank";
            rowData5.href = eventLink;
            
            rowData6.textContent = eventLat;
            rowData7.textContent = eventLog;
            rowData8.textContent = banner;

			row.append(rowData1);
			row.append(rowData2);
			row.append(rowData3);
			row.append(rowData4);
			row.append(rowData5);
			row.append(rowData6);
			row.append(rowData7);
			row.append(rowData8);
	
			eventTableBody.append(row);	

            // Dropdown Row
            let infoRow = document.createElement('tr');
            infoRow.id = `inforow${i}`;
            infoRow.className='hidden_row';

            let infoRowData1 = document.createElement('td');
            infoRowData1.textContent = "example";
            infoRow.append(infoRowData1);
            eventTableBody.append(infoRow);	

		}


    })
})