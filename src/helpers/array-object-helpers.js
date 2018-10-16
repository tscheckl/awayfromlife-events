		
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
		band.label = band.name + ' - ' + band.origin.country;
	});
}

export {removeEmptyObjectFields, addBandLabels};