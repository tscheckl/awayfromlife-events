import moment from 'moment';

//Function that removes empty strings from all array-attributes of a given object.
function removeEmptyObjectFields(object) {
	for(let attrib in object) {					
		if(Array.isArray(object[attrib])) {
			for(let element in object[attrib])
				if(object[attrib][element] == '') {
					object[attrib].splice(element, 1);
				}
		}
	}
}

function addBandLabels(object) {	
	object.bands.forEach(band => {
		band.label = `${band.name} - ${band.origin.country} ${!band.isValidated ?'(unverified)' :''}`;
	});
}

function addLocationLabel(location) {
	location.label = `${location.name} - ${location.address.city} ${location.isValidated == false ?'(unverified)' :''}`;
}

function sortEventsByMonth(events) {
	let sortedEvents = {};
	events.forEach(event => {
		let eventDateMonth = moment(event.date).format('MMMM YYYY');
		if(!sortedEvents[eventDateMonth])
			sortedEvents[eventDateMonth] = [event];
		else 
			sortedEvents[eventDateMonth].push(event);
	});

	return sortedEvents;
}

export {removeEmptyObjectFields, addBandLabels, addLocationLabel, sortEventsByMonth};