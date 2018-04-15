import Vuex from "vuex";
import Vue from 'vue';
import moment from 'moment';
import {backendUrl} from '@/secrets.js';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		currentEvent: {}
	},
	mutations: {
		setCurrentEvent(state, event) {
			event.formattedDate = moment(event.startDate).format('LL');
			event.formattedTime = moment(event.startDate).format('HH:mm');
			state.currentEvent = event;
		}
	},
	getters: {
		currentEvent: state => {
			return state.currentEvent;
		}
	}
});