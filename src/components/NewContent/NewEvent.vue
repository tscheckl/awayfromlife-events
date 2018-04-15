<template>
  	<div id="new_event">
		<md-button-toggle v-if="!edit" class="event-type-switch" md-single>
			<md-button v-on:click="createEvent=true" :class="createEvent? 'active' : ''">
				Single Event
			</md-button>
			<md-button v-on:click="createEvent=false" :class="!createEvent? 'active' : ''">
				Tour
			</md-button>
		</md-button-toggle>

		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
			<md-icon>clear</md-icon>
		</md-button>

		<div v-if="createEvent" class="content">
			<h1>{{edit?'EDIT EVENT' :'NEW EVENT'}}</h1>
			<event-form :data="newEvent" :edit="edit"></event-form>
			
			<md-button type="submit" v-on:click="addEvent" class="md-raised md-accent">{{edit?'Update Event' :'Add Event'}}</md-button>
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
	props: {
		data: Object,
		edit: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		newEvent() {
			if(this.edit) {
				return Object.assign({}, this.$store.getters.currentEvent);
			}
			else {
				return  {
					title: '',
					location: '',
					bands: [''],
					description: '',
					startDate: ''
				}
			}
		}
	},
	data() {
		return {
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
		addEvent() {
			
			this.loading = true;

			//Reset the error messages
			this.submitStatus = '';
			var vm = this;
			//Only go on if all required fields are filled out
			if(this.newEvent.title && this.newEvent.startDate && this.newEvent.location) {
				//Check if sending directly to validated route and if so, also send token to verify.
				let authHeader = this.apiRoute == '/api/events'? {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}: {};

				let requestType = this.edit?'put':'post'
				let editEvent = this.edit?'/' + this.newEvent._id: '';
				
				this.$http[requestType](backendUrl + this.apiRoute + editEvent, this.newEvent, {headers: authHeader})
				.then(response => {
					this.submitStatus = this.edit?'Event successfully updated' :'New event successfully created';
					this.$refs.snackbar.open();
					this.emitClose();
					this.loading = false;

					//Reset all fields
					this.resetEventFields();
				}).catch(err => {
					// Error
					console.log(err);
					
					this.submitStatus = this.edit ?'An error occurred while updating the Event. Please try again!'
										:'An error occurred while creating the Event. Please try again!';
					this.$refs.snackbar.open();
					this.loading = false;
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

					this.$http.post(backendUrl + this.apiRoute, singleTourStopEvent, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
						.then(response => {})
						.catch(err => {
							// Error
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
		
		this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
			.then(response => {
				vm.apiRoute = '/api/events';
			})
			.catch(err => {});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newEvent.scss";
</style>
