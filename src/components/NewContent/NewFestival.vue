<template>
	<div id="new_festival">
		<!-- <md-button class="md-icon-button md-accent close-btn" v-on:click="$emit('close')">
  			<md-icon>clear</md-icon>
		</md-button> -->

		<div :class="'form-intro '  + (showStepper || finishedCreation ?'hide' :'')">
			<h1>New Festival</h1>
			<div :class="(createExistingFestival ?'hide ' :'') + 'creation-prompt'">
				<h3>Do you want to create a</h3>
				<button class="md-button md-raised" v-on:click="showForm(true)">New Festival</button>
				<h3>or a</h3>
				<button class="md-button md-raised" v-on:click="showForm(false)">New Instance of an existing Festival</button>

				<p class="not-sure-prompt">not sure? <span v-on:click="showFestivalList = !showFestivalList">check if the festival you want to create already exists <md-icon>{{showFestivalList ?'keyboard_arrow_down' :'keyboard_arrow_right'}}</md-icon></span></p>

				<div :class="'festival-list ' + (!showFestivalList ?'hide' : '')">
					<!-- <md-input-container>
						<v-select class="form-v-select"
									v-model="existingFestival"
									:options="festivalList"
									:on-change="checkSelection"
									label="name"
									placeholder="Enter the festival you're looking for*">
						</v-select>
					</md-input-container> -->
					<search-select v-model="existingFestival"
									:options="festivalList"
									v-on:change="checkSelection"
									label="name"
									placeholder="Enter the festival you're looking for*">
					</search-select>
				</div>
			</div>

			<div :class="(!createExistingFestival ?'hide ' :'') + 'create-existing'">
				<md-icon class="big-check">check</md-icon>
				<p>looks like the festival you're looking for already exists. So you probably want to</p>
				<button class="md-button md-raised" v-on:click="showForm(false)">Create a new Instance of an existing Festival <md-icon>keyboard_arrow_right</md-icon></button>
				<p class="check-again" v-on:click="createExistingFestival = false">or check again?</p>
			</div>
		</div>

		<button class="md-button back-to-selection-btn" v-if="showStepper" v-on:click="backToSelection"><md-icon>keyboard_arrow_left</md-icon>Back to selection</button>

		<stepper  ref="formStepper" :class="'festival-form ' + (!showStepper ?'hide' :'')" :steps="createFestival ?6 :4" v-on:submit="createFestival ?addFestival() :addFestivalEvent()">
			<h1 slot="headline">New Festival {{createFestival ?' ' :' Event'}}</h1>
			<div slot="step-1" v-show="createFestival">
				<h2>General information</h2>
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Name of the festival</label>
							<md-input v-model="newFestival.name" required></md-input>
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
							<!-- <md-input-container>
								<v-select class="form-v-select"
										  label="name"
										  :on-change="(selected) => onSelectGenre(selected, index)"
										  :options="backendGenres"
										  v-model="newFestival.genre[index]"
										  placeholder="Select festival's genre*">
								</v-select>
							</md-input-container> -->
							<search-select label="name"
										  v-on:change="(selected) => onSelectGenre(selected, index)"
										  :options="backendGenres"
										  v-model="newFestival.genre[index]"
										  placeholder="Select festival's genre*">
							</search-select>

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
				<h2>Select the festival you want to create a new instance of</h2>
				<md-layout md-gutter>
					<md-layout md-flex="100">
						<!-- <md-input-container>
							<v-select class="form-v-select"
										v-model="existingFestival"
										:options="festivalList"
										:on-change="checkSelection"
										label="name"
										placeholder="Enter the festival you're looking for*">
							</v-select>
						</md-input-container> -->
						<search-select v-model="existingFestival"
										:options="festivalList"
										v-on:change="checkSelection"
										label="name"
										placeholder="Enter the festival you're looking for*">
						</search-select>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Title of this festival edition</label>
							<md-input v-model="newFestivalEvent.name" required></md-input>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>

			<div slot="step-2" v-if="createFestival">
				<image-step 
					ref="imageInput" 
					v-model="festivalImage"
					:imageSource="newFestival.imageSource" 
					v-on:sourceChange="changeImageSource"
				></image-step>
			</div>

			<div slot="step-3" v-if="createFestival">
				<h2>Additional information</h2>
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
							<md-input v-model="newFestival.website"></md-input>
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

			<div :slot="createFestival ?'step-4':'step-2'">
				<h3 class="new-edition-info" v-if="createFestival">You now have to create one edition of this festival (e.g. Groezrock -> Groezrock 2019)</h3>

				<md-layout md-flex="100" v-if="createFestival">
					<md-input-container>
						<label>Title of this festival edition</label>
						<md-input v-model="newFestivalEvent.name" required></md-input>
					</md-input-container>
				</md-layout>

				<image-step ref="festivalEventImageInput" v-model="festivalEventImage" :addImageSource="false"></image-step>
			</div>

			<div :slot="createFestival ?'step-5' :'step-3'">
				<h2>Lineup</h2>
				<div class="single-form-field" v-for="(band, index) in newFestivalEvent.bands" :key="index">
					<!-- <md-input-container>
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
					</md-input-container> -->
					<search-select :options="backendBands"
									v-on:change="(selected) => onSelectBand(selected, index)"
									v-model="newFestivalEvent.bands[index]"
									placeholder="Select festival's bands*">

						<span slot="no-options">
							Looks like the band you're looking for doesn't exist yet. 
							<b v-on:click="$refs.newBandDialog.open()">Want to add it now?</b>
						</span>
					</search-select>
					<md-button v-on:click="removeFromArray(newFestivalEvent.bands, index)" class="md-icon-button md-raised">
						<md-icon>clear</md-icon>
						<md-tooltip>Remove band</md-tooltip>
					</md-button>
					<p class="not-verified-warning" v-if="band.isValidated == false">
						<md-icon>error_outline</md-icon>
						This Band is not validated yet.
					</p>
				</div>
				
				<md-button v-if="newFestivalEvent.bands != null" v-on:click="newFestivalEvent.bands.push('')" class="md-icon-button md-raised md-accent add-field-btn">
					<md-icon>add</md-icon>
					<md-tooltip md-direction="right">Add another band</md-tooltip>
				</md-button>
			</div>

			<div :slot="createFestival ?'step-6' :'step-4'">
				<h2>When does the festival happen? </h2>
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
		</stepper>

		<finished-step 
			:class="(!finishedCreation ?'hide' :'')"
			contentType="Festival"
			v-on:back="$router.push('festivals')"
			v-on:redo="restartForm">
		</finished-step>

		<div class="loading" v-show="loading">
			<div class="darken"></div>
			<md-spinner md-indeterminate class="md-accent"></md-spinner>
		</div>

		<md-dialog ref="newBandDialog">
			<new-band 
				v-on:close="$refs['newBandDialog'].close()"
				v-on:success="updateContent('newBandDialog')">
			</new-band>
		</md-dialog>

		<md-dialog class="similar-dialog" 
				   ref="similarFestivalDialog"
				   :md-click-outside-to-close="false" 
				   :md-esc-to-close="false">
			<confirm-dialog v-on:close="checkSimilar(false)" v-on:confirm="checkSimilar(true)">
				<h3 slot="headline">{{checkForSimilarFestivalEvent
					? 'There already is an event for this festival at that date. Maybe you wanted to enter this one?'
					:'There already is a festival with that name in that city. Maybe you wanted to enter this one?'}}</h3>
				<div 
					slot="additional-information" 
					class="similar-event"
					v-for="festival in similarFestivals" 
					:key="festival._id">
					<a :href="`/festival/${festival.url}`" target="_blank">
						<div class="similar-event-info">
							<h3>{{festival.name}}</h3>
							<p> City: <span>{{festival.address.city}}</span></p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</a>
				</div>
			</confirm-dialog>
		</md-dialog>
		
		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import places from 'places.js';
import moment from 'moment';

import {frontEndSecret, backendUrl} from '@/secrets.js';
import { removeEmptyObjectFields } from '@/helpers/array-object-helpers.js';
import { getBandOptions } from '@/helpers/backend-getters.js';
import { isUrl } from '@/helpers/validators.js';

import Stepper from '@/components/Utilities/Stepper';
import ConfirmDialog from '@/components/Utilities/ConfirmDialog';
import SearchSelect from '@/components/Utilities/SearchSelect';
import FinishedStep from '@/components/NewContent/FinishedStep';
import NewBand from '@/components/NewContent/NewBand';
import ImageStep from '@/components/NewContent/ImageStep';

export default {
	name: 'new-festival',
	components: {
		Stepper,
		NewBand,
		ImageStep,
		ConfirmDialog,
		SearchSelect,
		FinishedStep
	},
	watch: {
		newFestivalName() {			
			this.getSimilarFestivals();
		},
		newFestivalCity() {
			this.getSimilarFestivals();
		},
		newFestivalEventStartDate() { this.getSimilarFestivalEvents() },
		newFestivalEventEndDate(){ this.getSimilarFestivalEvents() }
	},
	computed: {
		newFestivalName() { return this.newFestival.name },
		newFestivalEventStartDate() { return this.newFestivalEvent.startDate },
		newFestivalEventEndDate() { return this.newFestivalEvent.endDate }
	},
	data() {
		return {
			newFestival: {
				name: '',
				description: '',
				genre: [''],
				address: {},
				ticketLink: '',
				website: '',
				facebookUrl: '',
				imageSource: {
					text: '',
					url: ''
				},
			},
			newFestivalCity: '',
			newFestivalEvent: {
				name: '',
				startDate: new Date().setDate(new Date().getDate()-1),
				endDate: new Date().setDate(new Date().getDate()+1),
				bands: ['']
			},
			festivalImage: null,
			festivalEventImage: null,
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
			existingFestival: null,
			similarFestivals: [],
			similarFestivalFound: false,
			checkForSimilarFestivalEvent: false,
			finishedCreation: false
		}
	},
	methods: {
		addFestival() {
			this.loading = true;
			
			if(this.allRequiredFieldsFilledOut()) {
				removeEmptyObjectFields(this.newFestival);
				removeEmptyObjectFields(this.newFestivalEvent);

				let requestBody = {
					festival: this.newFestival,
					event: this.newFestivalEvent
				}

				let formData = new FormData();
				formData.append('festivalImage', this.festivalImage, 'festival-image.png');
				formData.append('eventImage', this.festivalEventImage, 'festival-event-image.png');
				formData.append('data', JSON.stringify(requestBody));
				
				let apiRoute = this.authorized ?'festivals' :'unvalidated-festivals';
	
				this.$http.post(`${backendUrl}/api/${apiRoute}`, formData)
					.then(response => {
						this.loading = false;
						this.$emit('success');					
						this.resetFormFields();

						this.showStepper = false;
						this.finishedCreation = true;
					})
					.catch(err => {
						this.loading = false;
						this.submitStatus = err.body.message;	
						this.$refs.snackbar.open();				
					});
			}
			else {
				this.loading = false;
				this.submitStatus = 'All required form fields need to be filled out and be valid!';	
				this.$refs.snackbar.open();	
			}
		},
		addFestivalEvent() {
			this.loading = true;

			if(this.existingFestival && this.newFestivalEvent.bands[0] != '' && this.newFestivalEvent.startDate && this.newFestivalEvent.endDate) {
				for(let index in this.newFestivalEvent.bands) {
					if(this.newFestivalEvent.bands[index]._id) 
						this.newFestivalEvent.bands[index] = this.newFestivalEvent.bands[index]._id
					else
						this.newFestivalEvent.bands.splice(index, 1)
				}

				let formData = new FormData();
				formData.append('image', this.festivalEventImage, 'festival-image.png');
				formData.append('data', JSON.stringify(this.newFestivalEvent));

				let apiRoute = this.authorized ?'festival-events' :'unvalidated-festival-events';

				this.$http.post(`${backendUrl}/api/${apiRoute}/` + this.existingFestival._id, formData)
					.then(response => {
						this.loading = false;
						this.$emit('success');					
						this.resetFormFields();
						this.showStepper = false;
						this.finishedCreation = true;
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
		allRequiredFieldsFilledOut() {
			const validImageSourceUrl = this.newFestival.imageSource.url === '' || isUrl(this.newFestival.imageSource.url);
			return this.newFestival.name 
			&& validImageSourceUrl
			&& this.newFestival.address.value 
			&& this.newFestival.genre[0] != '' 
			&& this.newFestivalEvent.bands[0] != '' 
			&& this.newFestivalEvent.startDate 
			&& this.newFestivalEvent.endDate;
		},
		getSimilarFestivals() {
			this.similarFestivalFound = false;
			if(this.newFestival.name && this.newFestival.address.city) {				
				this.$http.get(`${backendUrl}/api/festivals/similar?name=${this.newFestival.name}&city=${this.newFestival.address.city}`)
				.then(response => {
					if (response.body.data) {
						this.similarFestivals = response.body.data;
						this.similarFestivalFound = true;
						this.$refs.similarFestivalDialog.open()
					}
				}).catch(err => console.log(err));
			}
		},
		getSimilarFestivalEvents() {
			this.similarFestivalFound = false;

			if(this.existingFestival && this.newFestivalEvent.startDate && this.newFestivalEvent.endDate) {				
				this.$http.get(`${backendUrl}/api/festival-events/similar?festival=${this.existingFestival._id}&startDate=${this.newFestivalEvent.startDate}&endDate=${this.newFestivalEvent.endDate}`)
				.then(response => {
					if (response.body.data) {
						//Give the similar Festival Event some additional attributes of the existing festival that is currently selected for displaying it in the dialog.
						response.body.data._id = this.existingFestival._id;
						response.body.data.address = {
							city: this.existingFestival.address.city
						};
						response.body.data.url = this.existingFestival.url;
						this.checkForSimilarFestivalEvent = true;

						//As only one event is returned it needs to be wrapped in an array to be displayed correctly.
						this.similarFestivals = [response.body.data];
						this.similarFestivalFound = true;
						this.$refs.similarFestivalDialog.open()
					}
				}).catch(err => console.log(err));
			}
		},
		checkSimilar(accept) {
			if(accept) {
				this.resetFormFields();
				this.showStepper = false;
				this.$router.push('/festivals');
			}

			this.similarFestivalFound = false;
			this.$refs.similarFestivalDialog.close();
		},
		resetFormFields() {
			this.newFestival = {
				name: '',
				description: '',
				genre: [''],
				address: {},
				ticketLink: '',
				website: '',
				facebookUrl: ''
			};

			this.existingFestival = null;

			this.newFestivalEvent = {
				name: '',
				startDate: new Date().setDate(new Date().getDate()-1),
				endDate: new Date().setDate(new Date().getDate()+1),
				bands: ['']
			};

			this.festivalImage = null;
			this.festivalEventImage = null;
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
		updateContent(dialog) {
			this.$refs[dialog].close();

			this.submitStatus = `New Festival successfully created! \nIt will be visible fkor everyone after it was verified by us.`;
			getBandOptions()
				.then(data => this.backendBands = data)
				.catch(err => console.log(err));

			this.$refs.snackbar.open();
		},
		checkSelection(selection) {
			if(selection != null) {
				this.existingFestival = selection;
				this.newFestivalEvent.name = this.existingFestival.name + ' ' + new Date().getFullYear();
				this.createExistingFestival = true;
			}
			else {
				this.createExistingFestival = false;
			}
		},
		showForm(createFestival) {
			this.createFestival = createFestival;
			this.showStepper = true;
		},
		restartForm() {
			this.finishedCreation = false;
			this.$refs.formStepper.changeStep(1);
		},
		backToSelection() {
			this.showStepper = false;
			this.newFestivalEvent.name = null;
			this.existingFestival = null;
		},		
		changeImageSource(value) {
			this.newFestival.imageSource = value;
		}
	},
	mounted() {
		getBandOptions()
			.then(data => this.backendBands = data)
			.catch(err => console.log(err));

		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.authorized = true;
			})
			.catch(err => console.log(err));

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

		this.placesAutocomplete = places({container: this.$refs.address_input, type: 'address', language: 'en'});
		this.placesAutocomplete.on('change', e => {
			this.newFestival.address.street = e.suggestion.name;
			this.newFestival.address.city = e.suggestion.city;
			this.newFestival.address.administrative = e.suggestion.administrative;
			this.newFestival.address.country = e.suggestion.country;
			this.newFestival.address.countryCode = e.suggestion.countryCode;
			this.newFestival.address.postcode = e.suggestion.postcode;
			this.newFestival.address.lat = e.suggestion.latlng.lat;
			this.newFestival.address.lng = e.suggestion.latlng.lng;
			this.newFestival.address.value = e.suggestion.value;
			this.newFestivalCity = e.suggestion.city;
		});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newFestival.scss";
</style>
