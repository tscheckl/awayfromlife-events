<template>
  	<div id="new_event">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
			<md-icon>clear</md-icon>
		</md-button>

		<md-button-toggle class="event-type-switch" md-single>
			<md-button v-on:click="createEvent=true" :class="createEvent? 'active' : ''">
				Einzelnes Event
			</md-button>
			<md-button v-on:click="createEvent=false" :class="!createEvent? 'active' : ''">
				Tour
			</md-button>
		</md-button-toggle>

		<div v-if="createEvent" class="content">
			<h1 v-on:click="show">NEUES EVENT</h1>
			<event-form :data="newEvent"></event-form>
			
			<md-button type="submit" v-on:click="addEvent" class="md-raised md-accent">Event hinzufügen</md-button>
		</div>
		
		<div v-else class="content">
			<h1>NEUE TOUR</h1>
			<tour-form :data="newTour" :selectedLocations="[{}]"></tour-form>

			<md-button type="submit" v-on:click="addTour" class="md-raised md-accent">Tour hinzufügen</md-button>
		</div>

		<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		<md-snackbar ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
  	</div>
</template>

<script>
import moment from 'moment';

import EventForm from '@/Components/ContentForms/EventForm';
import TourForm from '@/Components/ContentForms/TourForm';

import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'new-event',
	components: {
		EventForm,
		TourForm
	},
	data() {
		return {
			newEvent: {
				title: '',
				description: '',
				location: {},
				bands: [''],
				startDate: '',
				endDate: '',
				time: ''
			},
			newTour: {
				title: '',
				description: '',
				bands: [''],
				tourStops: [{
					location: '',
					startDate: ''
				}],
			},
			//Message that will display a status afer sending the new event
			submitStatus: '',
			success: false,
			loading: false,
			//Variable for the api route according to if the user is authenticated or not
			apiRoute: '/api/unvalidated-events',
			createEvent: true
		}
	},
	methods: {
		show() {
			console.log(this.newEvent);
		},
		addEvent() {

			this.loading = true;

			//Reset the error messages
			this.submitStatus = '';
			var vm = this;
			//Only go on if all required fields are filled out
			if(this.newEvent.title && this.newEvent.description && this.newEvent.startDate) {
				this.$http.post(backendUrl + this.apiRoute, this.newEvent, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
				.then(response => {
					// Success
					console.log("new event response: ", response);
					vm.submitStatus = 'Neues Event erfolgreich angelegt';
					this.$refs.snackbar.open();
					this.emitClose();
					vm.loading = false;

					//Reset all fields
					vm.newEvent.title = '';
					vm.newEvent.description = '';
					vm.newEvent.time = '';
					vm.newEvent.startDate = '';
					vm.newEvent.endDate = '';
					vm.startTime = {};
					vm.newEvent.location = '';
				}).catch(err => {
					// Error
					console.log(err);
					vm.loading = false;
				});
			}
			else { // else show error message
				this.submitStatus = 'Alle erforderlichen Felder müssen ausgefüllt sein!';
				this.$refs.snackbar.open();
				this.loading = false;
				this.newEvent.startDate = '';
			}
	  },
	  addTour() {
		  console.log(this.newTour);
	  },
	  emitClose() {
		  this.$emit('close');
	  }
	},
	mounted() {
		let vm = this;
		
		this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
			.then(response => {
				vm.apiRoute = '/api/events';
			})
			.catch(err => {
				console.log(err);
			});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newEvent.scss";
</style>
