<template>
  	<div id="new_event">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
			<md-icon>clear</md-icon>
		</md-button>

		<div :class="'form-intro '  + (showStepper ?'hide' :'')">
			<h1>New Event</h1>
			<h3>Do you want to create a</h3>
			<button class="md-button md-raised" v-on:click="showForm(true)">Single Event</button>
			<h3>or a</h3>
			<button class="md-button md-raised" v-on:click="showForm(false)">Tour</button>
		</div>

		<button class="md-button back-to-selection-btn" v-if="showStepper" v-on:click="showStepper = false"><md-icon>keyboard_arrow_left</md-icon>Back to selection</button>

		<stepper :class="(createEvent ?'event-form ' :'tour-form ') + (!showStepper ?'hide' :'')" :steps="3" v-on:submit="createEvent ?addEvent() :addTour()">
			<h1 slot="headline">New {{createEvent ?'Event' :'Tour'}}</h1>
			<div slot="step-1">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Title</label>
							<md-input v-model="currentObject.name" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100" v-if="createEvent">
						<md-input-container>
							<v-select class="form-v-select"
							 		  :options="backendLocations"
									  :on-change="onSelectLocation"
									  v-model="currentObject.location"
									  placeholder="Select event location*">

									  	<span slot="no-options">
											Looks like the location you're looking for doesn't exist yet. 
											<b v-on:click="$refs.newLocationDialog.open()">Want to add it now?</b>
										</span>
							</v-select>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100" v-if="!createEvent">
						<div class="tourstop single-form-field" v-for="(tourstop, index) in currentObject.tourStops" :key="index">
							<md-input-container>
								<v-select class="form-v-select"
										  :options="backendLocations"
										  :on-change="(selected) => onSelectTourLocation(selected, index)"
										  v-model="currentObject.tourstops[index].location"
										  placeholder="Select event location*">
											
											<span slot="no-options">
												Looks like the location you're looking for doesn't exist yet. 
												<b v-on:click="$refs.newLocationDialog.open()">Want to add it now?</b>
											</span>
								</v-select>
							</md-input-container>
							<div class="picker">
								<md-icon>date_range</md-icon>
								<datetime v-model="tourstop.date" placeholder="Select date*" type="date"></datetime>
							</div>
							<md-button v-on:click="removeTourStop(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove tourstop</md-tooltip>
							</md-button>
						</div>

						<md-button v-if="locations != null" v-on:click="addTourStop" class="md-icon-button md-raised md-accent add-field-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another tourstop</md-tooltip>
						</md-button>
					</md-layout>
				</md-layout>
			</div>

			<div slot="step-2">
				<md-layout md-gutter>
					<md-layout md-flex="100">
						<h2>Lineup for this event</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-form-field" v-for="(band, index) in currentObject.bands" :key="index">
							<md-input-container>
								<v-select class="form-v-select"
											:options="backendBands"
											:on-change="(selected) => onSelectBand(selected, index)"
											v-model="currentObject.bands[index]"
											placeholder="Select event's bands*">

											<span slot="no-options">
												Looks like the band you're looking for doesn't exist yet. 
												<b v-on:click="$refs.newBandDialog.open()">Want to add it now?</b>
											</span>
								</v-select>
							</md-input-container>
							<md-button v-on:click="removeBand(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove band</md-tooltip>
							</md-button>
						</div>

						<md-button v-if="currentObject.bands != null" v-on:click="addBand" class="md-icon-button md-raised md-accent add-field-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another band</md-tooltip>
						</md-button>
					</md-layout>
				</md-layout>
			</div>

			<div slot="step-3">
				<md-layout md-gutter>
					<md-layout md-flex="100">
						<h2>Additional Information</h2>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Ticket Link</label>
							<md-input v-model="currentObject.ticketLink"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Description</label>
							<md-textarea v-model="currentObject.description"></md-textarea>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>
		</stepper>

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
							<h3>{{event.name}} <span>{{event.formattedDate}}</span></h3>
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

import {frontEndSecret, backendUrl} from '@/secrets.js';

import ConfirmDialog from '@/Components/ConfirmDialog';
import EventForm from '@/Components/ContentForms/EventForm';
import TourForm from '@/Components/ContentForms/TourForm';
import Stepper from '@/components/Stepper';

export default {
	name: 'new-event',
	components: {
		ConfirmDialog,
		EventForm,
		TourForm,
		Stepper
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
						eventBands.push(JSON.parse(JSON.stringify(band)));
					}
				}
				else {
					eventBands = this.$store.getters.currentEvent.bands;
				}
				
				return {
					_id: this.$store.getters.currentEvent._id,
					url: this.$store.getters.currentEvent.url,
					name: this.$store.getters.currentEvent.name,
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
				name: '',
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
				name: '',
				location: '',
				bands: [''],
				description: '',
				date: '',
				canceled: 0,
				ticketLink: ''
			},
			similarEventFound: false,
			similarEvents: [],
			showStepper: false,
			currentObject: {},
			backendBands: [],
			backendLocations: []
		}
	},
	methods: {
		addEvent() {
			this.loading = true;
			//Reset the error messages
			this.submitStatus = '';
			var vm = this;
			
			//Only go on if all required fields are filled out
			if(this.newEvent.name && this.newEvent.date && this.newEvent.location && this.newEvent.bands[0] != '') {
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

			if(this.newTour.name && this.newTour.tourStops[0].location && this.newTour.tourStops[0].date) {
				for(let i in this.newTour.bands) {
					if(this.newTour.bands[i] == '')
						this.newTour.bands.splice(i, 1);
				}

				for(let tourstop in this.newTour.tourStops) {
					let singleTourStopEvent = {
						name: this.newTour.name,
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
				name: '',
				description: '',
				location: {label: ''},
				bands: [''],
				date: '',
				endDate: '',
				time: '',
				ticketLink: ''
			});

			this.blankEvent = {
				name: '',
				location: '',
				bands: [''],
				description: '',
				date: '',
				ticketLink: ''
			}
	  	},
		resetTourFields() {
			this.newTour = {
				name: '',
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
		},
		showForm(createEvent) {
			this.createEvent = createEvent;
			this.showStepper = true;
			this.currentObject = createEvent
						? this.newEvent
						: this.newTour;
		},
		onSelectLocation(selected) {
			//Set the new Event's location attribute to the ID of the selected location
			this.newEvent.location = selected;
		},
		onSelectTourLocation(selected, index) {
			//Set the value for the item that will be displayed in the search select input
			this.currentObject.tourStops[index].location = selected;
		},
		onSelectBand(selected, index) {			
			this.currentObject.bands[index] = selected;
			if(selected != '') {
				if(this.currentObject.bands.reduce((acc, cur) => (acc != '' && cur != '')))
					this.addBand();
			}
		},
		addTourStop() {
			this.newTour.tourStops.push({
				location: '',
				date: ''
			});
		},
		removeTourStop(index) {
			this.newTour.tourStops.splice(index, 1);

			if(this.newTour.tourStops.length == 0) {
				this.newTour.tourStops[0] = {
					location: '',
					date: ''
				};
			}
		},
		addBand() {
			this.currentObject.bands.push('');
		},
		removeBand(index) {
			this.currentObject.bands.splice(index, 1);
			
			if(this.currentObject.bands.length == 0)
				this.currentObject.bands[0] = '';
		},
		getBandOptions() {
			this.$http.get(backendUrl + "/api/bands")
				.then(response => {
					this.backendBands = response.body.data;
					for(let band of this.backendBands) {
						band.label = band.name + ' - ' + band.origin.country;
					}
				})
				.catch(err => {});
		},
		getLocationOptions() {
			this.$http.get(backendUrl + "/api/locations")
				.then(response => {
					this.backendLocations = response.body.data;
					for(let location of this.backendLocations) {
						location.label = location.name + ' - ' + location.address.city;
					}
				})
				.catch(err => {});
		}
	},
	mounted() {
		let vm = this;
		
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				vm.apiRoute = '/api/events';
			})
			.catch(err => {});

		this.currentObject = this.newEvent;

		this.getBandOptions();
		this.getLocationOptions();
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newEvent.scss";
</style>
