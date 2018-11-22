//TODO: Getter functions from the backend that only return data. e.g. get location/band options for v-select components.
import {frontEndSecret, backendUrl} from '@/secrets.js';

function getBandOptions(object, getUnverified = true) {	
	return new Promise((resolve, reject) => {
		fetch(`${backendUrl}/api/bands${getUnverified ? '/all' :''}`)
			.then(response => response.json())
			.then(data => {				
				for(let band of data.data) {
					band.label = `${band.name} - ${band.origin.country} ${!band.isValidated ?'(unverified)' :''}`;
				}
				resolve(data.data);
			})
			.catch(err => reject(err));
	})
}

function getLocationOptions(getUnverified = true) {
	return new Promise((resolve, reject) => {
		fetch(`${backendUrl}/api/locations${getUnverified ? '/all' :''}`)
			.then(response => response.json())
			.then(data => {
				for(let location of data.data) {
					location.label = `${location.name} - ${location.address.city} ${!location.isValidated ?'(unverified)' :''}`;
				}
				resolve(data.data);
			})
			.catch(err => reject(err));
	})
}

export {getBandOptions, getLocationOptions};