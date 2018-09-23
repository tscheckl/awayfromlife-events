<template>
	<div id="new_festival">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="$emit('close')">
  			<md-icon>clear</md-icon>
		</md-button>

		<div :class="'form-intro '  + (showStepper ?'hide' :'')">
			<h1>New Festival</h1>
			<div :class="(createExistingFestival ?'hide ' :'') + 'creation-prompt'">
				<h3>Do you want to create a</h3>
				<button class="md-button md-raised" v-on:click="showForm(true)">New Festival</button>
				<h3>or a</h3>
				<button class="md-button md-raised" v-on:click="showForm(false)">New Instance of an existing Festival</button>

				<p class="not-sure-prompt">not sure? <span v-on:click="showFestivalList = !showFestivalList">check if the festival you want to create already exists <md-icon>{{showFestivalList ?'keyboard_arrow_down' :'keyboard_arrow_right'}}</md-icon></span></p>

				<div :class="'festival-list ' + (!showFestivalList ?'hide' : '')">
					<md-input-container>
						<v-select class="form-v-select"
									v-model="existingFestival"
									:options="festivalList"
									:on-change="checkSelection"
									label="title"
									placeholder="Enter the festival you're looking for*">
						</v-select>
					</md-input-container>
				</div>
			</div>

			<div :class="(!createExistingFestival ?'hide ' :'') + 'create-existing'">
				<md-icon class="big-check">check</md-icon>
				<p>looks like the festival you're looking for already exists. So you probably want to</p>
				<button class="md-button md-raised" v-on:click="showForm(false)">Create a new Instance of an existing Festival <md-icon>keyboard_arrow_right</md-icon></button>
				<p class="check-again" v-on:click="createExistingFestival = false">or check again?</p>
			</div>
		</div>

		<button class="md-button back-to-selection-btn" v-if="showStepper" v-on:click="showStepper = false"><md-icon>keyboard_arrow_left</md-icon>Back to selection</button>

		<stepper :class="'festival-form ' + (!showStepper ?'hide' :'')" :steps="createFestival ?4 :3" v-on:submit="createFestival ?addFestival() :addFestivalEvent()">
			<h1 slot="headline">New Festival {{!createExistingFestival ?' Instance' :''}}</h1>
			<div slot="step-1" v-show="createFestival">
				<h3>General information</h3>
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Name of the festival</label>
							<md-input v-model="newFestival.title" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h4>Address</h4>
						<p>Always pick one of the suggested cities instead of only writing it into the input field. If the exact city you were looking for does not appear in the suggestions please always pick the closest match.</p>
						<md-input-container>
							<input type="search" ref="address_input" v-model="newFestival.address.value" placeholder="Address of the festival*" required/>
						</md-input-container>
					</md-layout>

					<md-layout md-gutter md-flex="100">
						<md-layout md-flex="100">
							<h4>Genre</h4>
							<p>(You can add up to 3)</p>
						</md-layout>
						<md-layout class="single-genre single-form-field" v-for="(genre, index) in newFestival.genre" :key="index" md-flex="33" md-flex-small="100">
							<md-input-container>
								<v-select class="form-v-select"
										  label="name"
										  :on-change="(selected) => onSelectGenre(selected, index)"
										  :options="backendGenres"
										  v-model="newFestival.genre[index]"
										  placeholder="Select band's genre*">
								</v-select>
							</md-input-container>

							<md-button v-if="newFestival.genre.length > 1" v-on:click="removeFromArray(newFestival.genre,index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove genre</md-tooltip>
							</md-button>
						</md-layout>

						<md-button v-if="newFestival.genre.length < 3" v-on:click="newFestival.genre.push('')" class="md-icon-button md-raised md-accent add-field-btn add-genre-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another genre</md-tooltip>
						</md-button>
					</md-layout>
				</md-layout>
			</div>

			<div class="select-existing-festival" slot="step-1" v-if="!createFestival">
				<h3>Select the festival you want to create a new instance of</h3>
				<md-input-container>
					<v-select class="form-v-select"
								v-model="existingFestival"
								:options="festivalList"
								:on-change="checkSelection"
								label="title"
								placeholder="Enter the festival you're looking for*">
					</v-select>
				</md-input-container>
			</div>

			<div slot="step-2">
				<h3>Lineup</h3>
				<div class="single-form-field" v-for="(band, index) in newFestivalEvent.bands" :key="index">
					<md-input-container>
						<v-select class="form-v-select"
									:options="backendBands"
									:on-change="(selected) => onSelectBand(selected, index)"
									v-model="newFestivalEvent.bands[index]"
									placeholder="Select festival's bands*">

									<span slot="no-options">
										Looks like the band you're looking for doesn't exist yet. 
										<b v-on:click="$refs.newBandDialog.open()">Want to add it now?</b>
									</span>
						</v-select>
					</md-input-container>
					<md-button v-on:click="removeFromArray(newFestivalEvent.bands, index)" class="md-icon-button md-raised">
						<md-icon>clear</md-icon>
						<md-tooltip>Remove band</md-tooltip>
					</md-button>
				</div>
				
				<md-button v-if="newFestivalEvent.bands != null" v-on:click="newFestivalEvent.bands.push('')" class="md-icon-button md-raised md-accent add-field-btn">
					<md-icon>add</md-icon>
					<md-tooltip md-direction="right">Add another band</md-tooltip>
				</md-button>
			</div>

			<div slot="step-3">
				<h3>When does the festival happen? </h3>
				<p class="heading-additional-info">(You can select a date range)</p>
				<div class="datepicker-trigger">
					<input
						type="text"
						style="visibility:hidden;"
						id="datepicker-trigger"
						placeholder="Select dates"
						:value="'fisch'"
					>

					<AirbnbStyleDatepicker
						:trigger-element-id="'datepicker-trigger'"
						:mode="'range'"
						:inline="true"
						:showActionButtons="false"
						:date-one="newFestivalEvent.startDate"
						:date-two="newFestivalEvent.endDate"
						@date-one-selected="val => { newFestivalEvent.startDate = val }"
						@date-two-selected="val => { newFestivalEvent.endDate = val }"
					/>
				</div>
			</div>

			<div slot="step-4" v-if="createFestival">
				<h3>Additional information</h3>
				<md-layout md-gutter>
					<md-layout md-flex="100">
						<md-input-container>
							<label>Description</label>
							<md-textarea v-model="newFestival.description"></md-textarea>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Ticket Link</label>
							<md-input v-model="newFestival.ticketLink"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Website</label>
							<md-input v-model="newFestival.websiteUrl"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Facebook page</label>
							<md-input v-model="newFestival.facebookUrl"></md-input>
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
	</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import places from 'places.js';
import moment from 'moment';
import {frontEndSecret, backendUrl} from '@/secrets.js';
import Stepper from '@/Components/Stepper';

export default {
	name: 'new-festival',
	components: {
		Stepper,
		Datepicker
	},
	data() {
		return {
			newFestival: {
				title: '',
				description: '',
				genre: [''],
				address: {},
				ticketLink: '',
				website: '',
				facebookUrl: ''
			},
			newFestivalEvent: {
				title: '',
				startDate: new Date().setDate(new Date().getDate()-1),
				endDate: new Date().setDate(new Date().getDate()+1),
				bands: ['']
			},
			authorized: false,
			loading: false,
			submitStatus: '',
			backendBands: [],
			backendGenres: [],
			showStepper: false,
			createFestival: false,
			showFestivalList: false,
			festivalList: [],
			createExistingFestival: false,
			existingFestival: null
		}
	},
	methods: {
		addFestival() {
			this.loading = true;
			
			if(this.newFestival.title 
			&& this.newFestival.address.value 
			&& this.newFestival.genre[0] != '' 
			&& this.newFestivalEvent.bands[0] != '' 
			&& this.newFestivalEvent.startDate 
			&& this.newFestivalEvent.endDate) {
				this.newFestivalEvent.title = this.newFestival.title + ' ' + moment(this.newFestivalEvent.startDate).format('YYYY');

				for (let index in this.newFestival.genre) {
					if(this.newFestival.genre[index].name)
						this.newFestival.genre[index] = this.newFestival.genre[index].name;
					else
						this.newFestival.genre.splice(index, 1);
				}

				for(let index in this.newFestivalEvent.bands) {
					if(this.newFestivalEvent.bands[index]._id) 
						this.newFestivalEvent.bands[index] = this.newFestivalEvent.bands[index]._id
					else
						this.newFestivalEvent.bands.splice(index, 1)
				}

				let requestBody = {
					festival: this.newFestival,
					event: this.newFestivalEvent
				}
				
				let apiRoute = this.authorized ?'festivals' :'unvalidated-festivals';
	
				this.$http.post(`${backendUrl}/api/${apiRoute}`, requestBody)
					.then(response => {
						this.loading = false;
						this.$emit('success');					
					})
					.catch(err => {
						this.loading = false;
						this.submitStatus = err.body.message;	
						this.$refs.snackbar.open();				
					});
			}
			else {
				this.loading = false;
				this.submitStatus = 'All required form fields need to be filled out!';	
				this.$refs.snackbar.open();	
			}
		},
		addFestivalEvent() {
			this.loading = true;

			if(this.existingFestival && this.newFestivalEvent.bands[0] != '' && this.newFestivalEvent.startDate && this.newFestivalEvent.endDate) {
				this.newFestivalEvent.title = this.existingFestival.title + ' ' + moment(this.newFestivalEvent.startDate).format('YYYY');

				for(let index in this.newFestivalEvent.bands) {
					if(this.newFestivalEvent.bands[index]._id) 
						this.newFestivalEvent.bands[index] = this.newFestivalEvent.bands[index]._id
					else
						this.newFestivalEvent.bands.splice(index, 1)
				}

				let apiRoute = this.authorized ?'festival-events' :'unvalidated-festival-events';

				this.$http.post(`${backendUrl}/api/${apiRoute}` + this.existingFestival._id, this.newFestivalEvent)
					.then(response => {
						this.loading = false;
						this.$emit('success');					
					})
					.catch(err => {
						this.loading = false;
						this.submitStatus = err.body.message;	
						this.$refs.snackbar.open();				
					});
			}
			else {
				this.loading = false;
				this.submitStatus = 'All required form fields need to be filled out!';	
				this.$refs.snackbar.open();		
			}
		},
		onSelectGenre(selected, index) {
			this.newFestival.genre[index] = selected;
			if(selected != '') {
				if(this.newFestival.genre.reduce((acc, cur) => (acc != '' && cur != ''))) {
					if(this.newFestival.genre.length < 3)
						this.newFestival.genre.push('');
				}
			}
		},
		onSelectBand(selected, index) {			
			this.newFestivalEvent.bands[index] = selected;
			if(selected != '') {
				if(this.newFestivalEvent.bands.reduce((acc, cur) => (acc != '' && cur != '')))
					this.newFestivalEvent.bands.push('');
			}
		},
		removeFromArray(array, index) {
			array.splice(index, 1);
			
			if(array.length == 0) {
				array[0] = '';
			}
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
		checkSelection(selection) {
			if(selection != null) {
				this.existingFestival = selection;
				this.createExistingFestival = true;
			}
			else {
				this.createExistingFestival = false;
			}
		},
		showForm(createFestival) {
			this.createFestival = createFestival;
			this.showStepper = true;
		}
	},
	mounted() {
		this.getBandOptions();

		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.authorized = true;
			})
			.catch(err => {});

		this.$http.get(backendUrl + '/api/genres')
			.then(response => {				
				this.backendGenres = response.body.data;
			})
			.catch(err => console.log("Error in Festival Form:", err));

		this.$http.get(backendUrl + '/api/festivals')
			.then(response => {				
				this.festivalList = response.body.data;
			})
			.catch(err => console.log("Error in Festival Form:", err));

		this.placesAutocomplete = places({container: this.$refs.address_input, type: 'address'});
		this.placesAutocomplete.on('change', e => {
			this.newFestival.address.street = e.suggestion.name;
			this.newFestival.address.city = e.suggestion.city;
			this.newFestival.address.administrative = e.suggestion.administrative;
			this.newFestival.address.country = e.suggestion.country;
			this.newFestival.address.postcode = e.suggestion.postcode;
			this.newFestival.address.lat = e.suggestion.latlng.lat;
			this.newFestival.address.lng = e.suggestion.latlng.lng;
			this.newFestival.address.value = e.suggestion.value;
			// this.value = e.suggestion.value ?e.suggestion.value :this.value;
		});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newFestival.scss";
</style>
