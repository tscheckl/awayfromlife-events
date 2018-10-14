//TODO: Getter functions from the backend that only return data. e.g. get location/band options for v-select components.
import {frontEndSecret, backendUrl} from '@/secrets.js';

function getBandOptions(object) {	
	fetch(backendUrl + "/api/bands")
		.then(response => {
			return response.json();
		})
		.then(data => {
			console.log(data);
			
			for(let band of data.data) {
				band.label = band.name + ' - ' + band.origin.country;
			}
			return data.data;
		});
}

function getLocationOptions() {
	fetch(backendUrl + "/api/locations")
		.then(response => {
			for(let location of response.body.data) {
				location.label = location.name + ' - ' + location.address.city;
			}
			return response.body.data;
		})
		.catch(err => {});
}

export {getBandOptions, getLocationOptions};