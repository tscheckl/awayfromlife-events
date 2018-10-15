//TODO: Getter functions from the backend that only return data. e.g. get location/band options for v-select components.
import {frontEndSecret, backendUrl} from '@/secrets.js';

function getBandOptions(object) {	
	return new Promise((resolve, reject) => {
		fetch(backendUrl + "/api/bands")
			.then(response => response.json())
			.then(data => {				
				for(let band of data.data) {
					band.label = band.name + ' - ' + band.origin.country;
				}
				resolve(data.data);
			})
			.catch(err => reject(err));
	})
}

function getLocationOptions() {
	return new Promise((resolve, reject) => {
		fetch(backendUrl + "/api/locations")
			.then(response => response.json())
			.then(data => {
				for(let location of data.data) {
					location.label = location.name + ' - ' + location.address.city;
				}
				resolve(data.data);
			})
			.catch(err => reject(err));
	})
}

export {getBandOptions, getLocationOptions};