import Vuex from "vuex";
import Vue from 'vue';
import moment from 'moment';
import {backendUrl} from '@/secrets.js';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		currentEvent: {
			title: '',
			location: '',
			bands: [''],
			description: '',
			startDate: ''
		},
		currentLocation: {
			name: '',
			address: {},
			website: '',
			facebook_page_url: '',
			information: ''
		},
		currentBand: {
			name: '',
			genre: '',
			foundingDate: '',
			recordLabel: '',
			origin: {},
			history: '',
			releases: [{}],
			website: '',
			facebookUrl: '',
			bandcampUrl: '',
			soundcloudUrl: ''
		},
		animation: 'slide-in',
		previousRoute: ''
	},
	mutations: {
		setCurrentEvent(state, event) {
			event.formattedDate = moment(event.startDate).format('LL');
			event.formattedTime = moment(event.startDate).format('HH:mm');
			if (event.location.address) {
				event.location.label = event.location.name + ' - ' + event.location.address.city;
			}

			if(event.bands[0] != '') {
				event.bands.forEach(band => {
					band.label = band.name + ' - ' + band.origin.country;
				})
			}
			state.currentEvent = Object.assign({},event);
			
		},
		setCurrentLocation(state, location) {
			if(!location.address.value) {
				location.address.value = location.address.street + ', ' + location.address.city;
			}
			
			state.currentLocation = location;
		},
		setCurrentBand(state, band) {
			state.currentBand = band;
		},
		setAnimation(state, animation) {
			state.animation = animation;
		},
		setPreviousRoute(state, route) {
			state.previousRoute = route;
		}
	},
	getters: {
		currentEvent: state => {
			return state.currentEvent;
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