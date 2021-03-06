import Vuex from "vuex";
import Vue from 'vue';
import moment from 'moment';
import {backendUrl} from '@/secrets.js';

import { addBandLabels, addLocationLabel } from '../helpers/array-object-helpers';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		searchBackgroundImage: '',
		currentEvent: {
			name: '',
			location: '',
			bands: [''],
			description: '',
			imageSource: {
				text: '',
				url: ''
			},
			date: ''
		},
		currentLocation: {
			name: '',
			address: {},
			website: '',
			facebookUrl: '',
			information: '',
			imageSource: {
				text: '',
				url: ''
			}
		},
		currentBand: {
			name: '',
			genre: [''],
			foundingDate: '',
			recordLabel: '',
			origin: {},
			history: '',
			releases: [{}],
			website: '',
			facebookUrl: '',
			bandcampUrl: '',
			soundcloudUrl: '',
			imageSource: {
				text: '',
				url: ''
			}
		},
		currentFestival: {
			name: '',
			url: '',
			description: '',
			genre: [''],
			events: [''],
			address: {},
			ticketLink: '',
			website: '',
			facebookUrl: '',
			imageSource: {
				text: '',
				url: ''
			}
		},
		animation: 'slide-in',
		previousRoute: ''
	},
	mutations: {
		setSearchBackgroundImage(state, imageUrl) {
			state.searchBackgroundImage = imageUrl;
		},
		setCurrentEvent(state, event) {
			event.formattedDate = moment(event.date).format('LL');
			event.formattedTime = moment(event.date).format('HH:mm');
			if (event.location.address) {
				addLocationLabel(event.location);
			}

			if(event.bands[0] != '') {
				addBandLabels(event);
			}
			event.ticketLink = fixUrl(event.ticketLink);
			state.currentEvent = JSON.parse(JSON.stringify(event));
			
		},
		setCurrentLocation(state, location) {
			if(!location.address.value) {
				if(location.address.street && location.address.city)
					location.address.value = `${location.name} - ${location.address.city} ${!location.isValidated ?'(unverified)' :''}`;
			}

			location.website = fixUrl(location.website);
			location.facebookUrl = fixUrl(location.facebookUrl);
			
			state.currentLocation = location;
		},
		setCurrentBand(state, band) {
			band.website = fixUrl(band.website);
			band.facebookUrl = fixUrl(band.facebookUrl);
			band.soundcloudUrl = fixUrl(band.soundcloudUrl);
			band.bandcampUrl = fixUrl(band.bandcampUrl);

			state.currentBand = band;
		},
		setCurrentFestival(state, festival) {
			festival.ticketLink = fixUrl(festival.ticketLink);
			state.currentFestival = festival;
		},
		setAnimation(state, animation) {
			state.animation = animation;
		},
		setPreviousRoute(state, route) {
			state.previousRoute = route;
		}
	},
	getters: {
		searchBackgroundImage: state => {
			return state.searchBackgroundImage;
		},
		currentEvent: state => {
			return state.currentEvent;
		},
		currentFestival: state => {
			return state.currentFestival;
		},
		currentLocation: state => {
			return state.currentLocation;
		},
		currentBand: state => {
			return state.currentBand;
		},
		animation: state => {
			return state.animation;
		},
		previousRoute: state => {
			return state.previousRoute;
		}
	}
});

function fixUrl(url) {
	if (url && !/^(f|ht)tps?:\/\//i.test(url)) {
		return 'http://' + url;
	}

	return url;
}