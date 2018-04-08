import Vuex from "vuex";
import Vue from 'vue';
import {backendUrl} from '@/secrets.js';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		newEventDialogOpened: false
	},
	mutations: {
		setEventDialogOpened(state, open) {
			state.newEventDialogOpened = open;
		}
	},
	getters: {
		newEventDialogOpened: state => {
			return state.newEventDialogOpened
		}
	}
});