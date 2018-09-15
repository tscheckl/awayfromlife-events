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
			<event-form :event="newEvent" :edit="edit"></event-form>
			<md-button type="submit" v-on:click="addEvent" class="md-raised md-accent">{{edit?'Update Event' :'Add Event'}}</md-button>
		</div>
		
		<div v-else class="content">
			<h1>NEW TOUR</h1>
			<tour-form :data="newTour" :selectedLocations="[]"></tour-form>

			<md-button type="submit" v-on:click="addTour" class="md-raised md-accent">Add Tour</md-button>
		</div>

		<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>

		<md-dialog class="similar-dialog" 
				   ref="similarEventDialog"
				   :md-click-outside-to-close="false" 
				   :md-esc-to-close="false">
			<confirm-dialog v-on:close="checkSimilar(false)" v-on:confirm="checkSimilar(true)">
				<h3 slot="headline">There already is an event at happening at that location on the same date. Maybe you wanted to enter this one?</h3>
				<div slot="additional-information" class="similar-event" v-for="event in similarEvents" :key="event._id">
					<a :href="`/#/event/${event.url}`" target="_blank">
						<div class="similar-event-info">
							<h3>{{event.title}} <span>{{event.formattedDate}}</span></h3>
							<p>Location: <span>{{event.location.name}}</span></p>
							<p class="bands">Lineup: <span v-for="band in event.bands" :key="band._id">{{band.name}}</span></p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</a>
				</div>
			</confirm-dialog>
		</md-dialog>
  	</div>
</template>

<script>
import moment from 'moment';

import ConfirmDialog from '@/Components/ConfirmDialog';
import EventForm from '@/Components/ContentForms/EventForm';
import TourForm from '@/Components/ContentForms/TourForm';

import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'new-event',
	components: {
		ConfirmDialog,
		EventForm,
		TourForm
	},
	props: {
		data: Object,
		edit: {
			type: Boolean,
			default: false
		},
	},
	watch: {
		newEventDate() {
			this.getSimilar();
		},
		newEventLocation() {
			this.getSimilar();
		}
	},
	computed: {
		newEvent() {
			if(this.edit) {
				let eventBands = [];
				if(this.$store.getters.currentEvent.bands[0] != '') {
					for(let band of this.$store.getters.currentEvent.bands) {
						eventBands.push(Object.assign({}, band));
					}
				}
				else {
					eventBands = this.$store.getters.currentEvent.bands;
				}
				
				return {
					_id: this.$store.getters.currentEvent._id,
					url: this.$store.getters.currentEvent.url,
					title: this.$store.getters.currentEvent.title,
					location: this.$store.getters.currentEvent.location,
					bands: eventBands,
					date: this.$store.getters.currentEvent.date,
					description: this.$store.getters.currentEvent.description,
					canceled: this.$store.getters.currentEvent.canceled,
					ticketLink: this.$store.getters.currentEvent.ticketLink
				}
			}
			else {
				return this.blankEvent;
			}
		},
		newEventDate() {
			return this.newEvent.date
		},
		newEventLocation() {
			return this.newEvent.location
		}
	},
	data() {
		return {
			newTour: {
				title: '',
				description: '',
				bands: [''],
				ticketLink: '',
				tourStops: [{
					location: '',
					date: ''
				}],
			},
			//Message that will display a status afer sending the new event
			submitStatus: '',
			success: false,
			loading: false,
			//Variable for the api route according to if the user is authenticated or not
			apiRoute: '/api/unvalidated-events',
			createEvent: true,
			blankEvent: {
				title: '',
				location: '',
				bands: [''],
				description: '',
				date: '',
				canceled: 0,
				ticketLink: ''
			},
			similarEventFound: false,
			similarEvents: []
		}
	},
	methods: {
		addEvent() {
			this.loading = true;
			//Reset the error messages
			this.submitStatus = '';
			var vm = this;
			
			//Only go on if all required fields are filled out
			if(this.newEvent.title && this.newEvent.date && this.newEvent.location && this.newEvent.bands[0] != '') {
				//Extract ids of selected bands for the event to send it to the backend.
				for(let i in this.newEvent.bands) {
					if(this.newEvent.bands[i] == '')
						this.newEvent.bands.splice(i, 1);
					else
						this.newEvent.bands[i] = this.newEvent.bands[i]._id
				}
				//Extract id of selected location for the event to send it to the backend.
				this.newEvent.location = this.newEvent.location._id;

				//Check if an event is currently edited or a new one is created and update the request routes + parameters accordingly.
				let requestType = this.edit?'put':'post'
				let editEvent = this.edit?'/' + this.newEvent._id: '';
				//Send new/updated event to the backend.
				this.$http[requestType](backendUrl + this.apiRoute + editEvent, this.newEvent)
					.then(response => {
						this.emitSuccess();
						this.loading = false;

						//Reset all fields
						this.resetEventFields();
					}).catch(err => {
						
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
			}
	 	},
	  	addTour() {
		  	this.loading = true;

			this.submitStatus = '';

			if(this.newTour.title && this.newTour.tourStops[0].location && this.newTour.tourStops[0].date) {
				for(let tourstop in this.newTour.tourStops) {
					let singleTourStopEvent = {
						title: this.newTour.title,
						description: this.newTour.description,
						location: this.newTour.tourStops[tourstop].location,
						bands: this.newTour.bands,
						date: this.newTour.tourStops[tourstop].date,
						ticketLink: this.newTour.ticketLink
					}

					this.$http.post(backendUrl + this.apiRoute, singleTourStopEvent)
						.then(response => {	
							this.loading = false;
						})
						.catch(err => {
							// Error
							vm.submitStatus = 'An error occurred while creating the Tour. Please try again!';
							this.$refs.snackbar.open();
							vm.loading = false;
						});
				}

				this.emitSuccess();
				this.loading = false;

				//Reset all fields
				this.resetTourFields();
			}
			else { // else show error message
				this.submitStatus = 'All required input fields have to be filled out!';
				this.$refs.snackbar.open();
				this.loading = false;
				this.newEvent.date = '';
			}
	 	},
		emitSuccess() {
			this.$emit('success');
		},
		emitClose() {
			this.$emit('close');
		},
	 	resetEventFields() {			 
			this.$store.commit('setCurrentEvent', {
				title: '',
				description: '',
				location: {label: ''},
				bands: [''],
				date: '',
				endDate: '',
				time: '',
				ticketLink: ''
			});

			this.blankEvent = {
				title: '',
				location: '',
				bands: [''],
				description: '',
				date: '',
				ticketLink: ''
			}
	  	},
		resetTourFields() {
			this.newTour = {
				title: '',
				description: '',
				bands: [''],
				tourStops: [{
					location: '',
					date: ''
				}],
				ticketLink: ''
			}
		},
		getSimilar() {
			this.similarEventFound = false;
			if(this.newEvent.location && this.newEvent.date && this.$route.path.toLowerCase().indexOf('/events') != -1) {
				
				this.$http.get(backendUrl + '/api/events/similar?location=' + this.newEvent.location._id + '&date=' + this.newEvent.date)
				.then(response => {
					if (response.body.data) {
						this.similarEvents = response.body.data;

						for (let event of this.similarEvents)
							event.formattedDate = moment(event.date).format('LL');

						this.similarEventFound = true;
						this.$refs.similarEventDialog.open()
					}
				}).catch(err => {console.log(err);});
			}
		},
		checkSimilar(accept) {
			if(accept)
				this.emitClose();

			this.similarEventFound = false;
			this.$refs.similarEventDialog.close();
		}
	},
	mounted() {
		let vm = this;
		
		this.$http.get(backendUrl + '/api/users/auth')
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
