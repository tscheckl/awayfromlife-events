<template>
  	<div id="new_event">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
			<md-icon>clear</md-icon>
		</md-button>

		<md-button-toggle class="event-type-switch" md-single>
			<md-button v-on:click="createEvent=true" :class="createEvent? 'active' : ''">
				Single Event
			</md-button>
			<md-button v-on:click="createEvent=false" :class="!createEvent? 'active' : ''">
				Tour
			</md-button>
		</md-button-toggle>

		<div v-if="createEvent" class="content">
			<h1 v-on:click="show">NEW EVENT</h1>
			<event-form :data="newEvent"></event-form>
			
			<md-button type="submit" v-on:click="addEvent" class="md-raised md-accent">Add Event</md-button>
		</div>
		
		<div v-else class="content">
			<h1>NEW TOUR</h1>
			<tour-form :data="newTour" :selectedLocations="[]"></tour-form>

			<md-button type="submit" v-on:click="addTour" class="md-raised md-accent">Add Tour</md-button>
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
			if(this.newEvent.title && this.newEvent.startDate && this.newEvent.location) {
				this.$http.post(backendUrl + this.apiRoute, this.newEvent, {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
				.then(response => {
					vm.submitStatus = 'New event successfully created';
					this.$refs.snackbar.open();
					this.emitClose();
					vm.loading = false;

					//Reset all fields
					this.resetEventFields();
				}).catch(err => {
					// Error
					console.log(err);
						vm.submitStatus = 'An error occurred while creating the Event. Please try again!';
						this.$refs.snackbar.open();
					vm.loading = false;
				});
			}
			else { // else show error message
				this.submitStatus = 'All required input fields have to be filled out!';
				this.$refs.snackbar.open();
				this.loading = false;
				this.newEvent.startDate = '';
			}
	 	},
	  	addTour() {
		  	this.loading = true;

			this.submitStatus = '';

			if(this.newTour.title && this.newTour.tourStops[0].location && this.newTour.tourStops[0].startDate) {
				for(let tourstop in this.newTour.tourStops) {
					let singleTourStopEvent = {
						title: this.newTour.title,
						description: this.newTour.description,
						location: this.newTour.tourStops[tourstop].location,
						bands: this.newTour.bands,
						startDate: this.newTour.tourStops[tourstop].startDate
					}

					this.$http.post(backendUrl + this.apiRoute, singleTourStopEvent, {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
						.then(response => {
							console.log(response);
						}).catch(err => {
							// Error
							console.log(err);
							vm.submitStatus = 'An error occurred while creating the Tour. Please try again!';
							this.$refs.snackbar.open();
							vm.loading = false;
						});
				}
				
				this.submitStatus = 'New Tour successfully created';
				this.$refs.snackbar.open();
				this.emitClose();
				this.loading = false;

				//Reset all fields
				this.resetTourFields();
			}
			else { // else show error message
				this.submitStatus = 'All required input fields have to be filled out!';
				this.$refs.snackbar.open();
				this.loading = false;
				this.newEvent.startDate = '';
			}
	 	},
		emitClose() {
			this.$emit('close');
		},
	 	resetEventFields() {
			this.newEvent = {
				title: '',
				description: '',
				location: '',
				bands: [''],
				startDate: '',
				endDate: '',
				time: ''
			}
	  	},
		resetTourFields() {
			this.newTour = {
				title: '',
				description: '',
				bands: [''],
				tourStops: [{
					location: '',
					startDate: ''
				}],
			}
		}
	},
	mounted() {
		let vm = this;
		
		this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
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
