<template>
  	<div id="new_event">
		<!-- <md-button class="md-icon-button md-accent close-btn" v-on:click="$emit('close');">
			<md-icon>clear</md-icon>
		</md-button> -->

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
						<md-layout md-flex="100">
							<h2>Title</h2>
						</md-layout>

						<md-layout md-flex="100" md-flex-small="100">
							<md-input-container>
								<label>Title</label>
								<md-input v-model="currentObject.name" required></md-input>
							</md-input-container>
						</md-layout>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100" v-if="createEvent">
						<md-layout md-flex="100">
							<h2>Location of the event</h2>
						</md-layout>

						<md-layout md-flex="100" class="event-location">
							<md-input-container>
								<v-select class="form-v-select"
										:options="backendLocations"
										v-model="currentObject.location"
										placeholder="Select event location*">

											<span slot="no-options">
												Looks like the location you're looking for doesn't exist yet. 
												<b v-on:click="$refs.newLocationDialog.open()">Want to add it now?</b>
											</span>
								</v-select>
							</md-input-container>
							<p class="not-verified-warning" v-if="currentObject.location && currentObject.location.isValidated == false">
								<md-icon>error_outline</md-icon>
								This Location is not validated yet.
							</p>
						</md-layout>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100" v-if="createEvent">
						<md-layout md-flex="100" v-if="createEvent">
							<h2>Date of the event</h2>
						</md-layout>

						<md-layout md-flex="100" v-if="createEvent">
							<div class="datepicker-trigger">
								<md-input-container>
									<label>Date</label>
									<md-input id="datepicker-trigger" v-model="currentObject.date" required></md-input>
								</md-input-container>

								<AirbnbStyleDatepicker
									:trigger-element-id="'datepicker-trigger'"
									:offsetY="-300"
									:mode="'single'"
									:showActionButtons="false"
									:date-one="currentObject.date"
									@date-one-selected="val => { currentObject.date = val }"
								/>
							</div>
						</md-layout>
					</md-layout>
					
					<md-layout md-flex="50">
						<md-layout>
							<h2>Image</h2>
						</md-layout>

						<md-layout md-flex="100">
							<md-input-container>
								<label>Only Images</label>
								<md-file v-on:selected="uploadFile" accept="image/*"></md-file>
							</md-input-container>
						</md-layout>
					</md-layout>

					<md-layout md-flex="100" v-if="!createEvent">
						<h2>Tourstops</h2>
					</md-layout>

					<md-layout md-flex="100" v-if="!createEvent">
						<div class="tourstop single-form-field" v-for="(tourstop, index) in currentObject.tourStops" :key="index">
							<div class="datepicker-trigger">
								<md-input-container>
									<label>Date</label>
									<md-input :id="'datepicker-trigger-'+index" v-model="tourstop.date" required></md-input>
								</md-input-container>

								<AirbnbStyleDatepicker
									:trigger-element-id="'datepicker-trigger-' + index"
									:offsetY="-300"
									:mode="'single'"
									:showActionButtons="false"
									:date-one="tourstop.date"
									@date-one-selected="val => { tourstop.date = val }"
								/>
							</div>
							<md-input-container class="location-select">
								<v-select class="form-v-select"
										  :options="backendLocations"
										  :on-change="(selected) => onSelectTourLocation(selected, index)"
										  v-model="tourstop.location"
										  placeholder="Select event location*">
											
											<span slot="no-options">
												Looks like the location you're looking for doesn't exist yet. 
												<b v-on:click="$refs.newLocationDialog.open()">Want to add it now?</b>
											</span>
								</v-select>
							</md-input-container>
							<p class="not-verified-warning" v-if="tourstop.location.isValidated == false">
								<md-icon>error_outline</md-icon>
								This Location is not validated yet.
							</p>
							<md-button v-on:click="removeTourStop(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove tourstop</md-tooltip>
							</md-button>
						</div>

						<md-button v-on:click="addTourStop" class="md-icon-button md-raised md-accent add-field-btn">
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
							<p class="not-verified-warning" v-if="band.isValidated == false">
								<md-icon>error_outline</md-icon>
								This Band is not validated yet.
							</p>
						</div>

						<md-button v-if="currentObject.bands != null" v-on:click="currentObject.bands.push('');" class="md-icon-button md-raised md-accent add-field-btn">
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

		<div class="loading" v-show="loading">
			<div class="darken"></div>
			<md-spinner md-indeterminate class="md-accent"></md-spinner>
		</div>
		
		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>

		<md-dialog class="similar-dialog" 
				   ref="similarEventDialog"
				   :md-click-outside-to-close="false" 
				   :md-esc-to-close="false">
			<confirm-dialog v-on:close="checkSimilar(false)" v-on:confirm="checkSimilar(true)">
				<h3 slot="headline">There already is an event happening at that location on the same date. Maybe you wanted to enter this one?</h3>
				<div slot="additional-information" class="similar-event" v-for="event in similarEvents" :key="event._id">
					<a :href="`/event/${event.url}`" target="_blank">
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

		<md-dialog ref="newBandDialog">
			<new-band 
					v-on:close="$refs['newBandDialog'].close()"
					v-on:success="updateContent('newBandDialog')">
			</new-band>
		</md-dialog>

		<md-dialog ref="newLocationDialog">
			<new-location 
					v-on:close="$refs['newLocationDialog'].close()"
					v-on:success="updateContent('newLocationDialog')">
			</new-location>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span>New {{createdContent}} successfully created! <br> <b>It will be visible for everyone after it was verified by us.</b></span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
  	</div>
</template>

<script>
import moment from 'moment';

import {frontEndSecret, backendUrl} from '@/secrets.js';
import { removeEmptyObjectFields } from '@/helpers/array-object-helpers.js';
import { getBandOptions, getLocationOptions } from '@/helpers/backend-getters.js';

import ConfirmDialog from '@/components/Utilities/ConfirmDialog';
import Stepper from '@/components/Utilities/Stepper';
import NewBand from "@/components/NewContent/NewBand";
import NewLocation from "@/components/NewContent/NewLocation";

export default {
	name: 'new-event',
	components: {
		ConfirmDialog,
		Stepper,
		NewBand,
		NewLocation
	},
	props: {
		data: Object,
		edit: {
			type: Boolean,
			default: false
		}
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
			return this.$store.getters.currentEvent;
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
			blankEvent: {
				name: '',
				description: '',
				location: '',
				bands: [''],
				date: '',
				endDate: '',
				time: '',
				ticketLink: ''
			},
			//Message that will display a status afer sending the new event
			submitStatus: '',
			loading: false,
			//Variable for the api route according to if the user is authenticated or not
			apiRoute: '/api/unvalidated-events',
			createEvent: true,
			similarEventFound: false,
			similarEvents: [],
			showStepper: false,
			currentObject: {},
			backendBands: [],
			backendLocations: [],
			createdContent: '',
			eventImage: null
		}
	},
	methods: {
		addEvent() {
			this.loading = true;
			// return;
			
			//Only go on if all required fields are filled out
			if(this.newEvent.name && this.newEvent.date && this.newEvent.location && this.newEvent.bands[0] != '') {
				removeEmptyObjectFields(this.newEvent);
				
				var formData = new FormData();
				formData.append('image', this.eventImage, 'event-image.png');
				formData.append('data', JSON.stringify(this.newEvent));
				
				// if(this.apiRoute == '/api/events' 
				// && (this.newEvent.location.isValidated == false || this.allBandsUnverified()))
					// this.apiRoute = '/api/unvalidated-events';
					
				//Send new/updated event to the backend.
				this.$http.post(backendUrl + '/api/events/withImage', formData)
					.then(response => {
						console.log(response);
						
						this.$emit('success');
						this.loading = false;

						//Reset all fields
						this.resetEventFields();
					}).catch(err => {
						console.log(err);
												
						this.submitStatus = err.body.message;
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

			if(this.newTour.name && this.newTour.tourStops[0].location && this.newTour.tourStops[0].date) {
				removeEmptyObjectFields(this.newTour);

				let fullEvents = [];

				for(let tourstop in this.newTour.tourStops) {
					let singleTourStopEvent = {
						name: this.newTour.name,
						description: this.newTour.description,
						location: this.newTour.tourStops[tourstop].location,
						bands: this.newTour.bands,
						date: this.newTour.tourStops[tourstop].date,
						ticketLink: this.newTour.ticketLink
					}
					
					if(this.apiRoute == '/api/events' && this.newTour.tourStops[tourstop].location.isValidated == false)
						this.apiRoute = '/api/unvalidated-events';

					fullEvents.push(singleTourStopEvent);
				}

				if(this.apiRoute == '/api/events' && this.allBandsUnverified())
					this.apiRoute = '/api/unvalidated-events';

				this.$http.post(backendUrl + this.apiRoute + '/multiple', {list: fullEvents})
					.then(response => {	
						this.loading = false;
						this.$emit('success');
						//Reset all fields
						this.resetTourFields();
					})
					.catch(err => {
						// Error
						this.submitStatus = err.body.message;
						this.$refs.snackbar.open();
						this.loading = false;
					});
			}
			else { // else show error message
				this.submitStatus = 'All required input fields have to be filled out!';
				this.$refs.snackbar.open();
				this.loading = false;
				this.newEvent.date = '';
			}
	 	},
	 	resetEventFields() {			 
			this.$store.commit('setCurrentEvent', JSON.parse(JSON.stringify(this.blankEvent)));			
			this.currentObject = this.newEvent;
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
			this.currentObject = this.newTour;
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
				}).catch(err => console.log(err));
			}
		},
		checkSimilar(accept) {
			if(accept)
				this.$emit('close');

			this.similarEventFound = false;
			this.$refs.similarEventDialog.close();
		},
		updateContent(dialog) {
			this.$refs[dialog].close();

			if(dialog == 'newBandDialog') {
				this.createdContent = 'band';
				getBandOptions()
					.then(data => this.backendBands = data)
					.catch(err => console.log(err));
			}
			else {
				this.createdContent = 'location';
				getLocationOptions()
					.then(data => this.backendLocations = data)
					.catch(err => console.log(err));
			}

			this.$refs.snackbar.open();
		},
		showForm(createEvent) {
			this.createEvent = createEvent;
			this.showStepper = true;
			this.currentObject = createEvent
						? this.newEvent
						: this.newTour;			
		},
		onSelectTourLocation(selected, index) {
			//Set the value for the item that will be displayed in the search select input
			this.currentObject.tourStops[index].location = selected;
		},
		onSelectBand(selected, index) {			
			//Select band into localBands array so that Vue detects the change.
			this.currentObject.bands.splice(index, 1, selected);
			
			if(selected != '') {
				if(this.currentObject.bands.reduce((acc, cur) => (acc != '' && cur != '')))
					this.currentObject.bands.push('');
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
		removeBand(index) {
			this.currentObject.bands.splice(index, 1);
			
			if(this.currentObject.bands.length == 0)
				this.currentObject.bands[0] = '';
		},
		allBandsUnverified() {
			return this.currentObject.bands.every(band => band.isValidated == false);
		},
		uploadFile(file) {
			this.eventImage = file[0];			
		}
	},
	mounted() {	
		this.resetEventFields();

		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.apiRoute = '/api/events';
			})
			.catch(err => console.log(err));

		this.currentObject = this.newEvent;

		getBandOptions()
			.then(data => this.backendBands = data)
			.catch(err => console.log(err));

		getLocationOptions()
			.then(data => this.backendLocations = data)
			.catch(err => console.log(err));
	},
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newEvent.scss";
</style>
