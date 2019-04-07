<template>
	<div id="new_location">
		<!-- <md-button class="md-icon-button md-accent close-btn" v-on:click="$emit('close');">
  			<md-icon>clear</md-icon>
		</md-button> -->
		
		<stepper ref="formStepper" :class="'location-form ' + (finishedCreation ?'hide' :'')" :steps="3" v-on:submit="addLocation">
			<h1 slot="headline">New Location</h1>
			<div slot="step-1">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Name of the location</label>
							<md-input v-model="newLocation.name" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Address</h2>
					</md-layout>

					<md-layout md-flex="100">
						<p>Always pick one of the suggested addresses instead of only writing it into the input field. If the exact address you were looking for does not appear in the suggestions please always pick the closest match.</p>
						<md-input-container>
							<input type="search" ref="address_input" v-model="newLocation.address.value" placeholder="Address of the location*" required/>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>

			<div slot="step-2">
				<image-step ref="imageInput" v-model="locationImage"></image-step>
			</div>

			<div slot="step-3">
				<md-layout md-gutter>
					<md-layout md-flex="100">
						<h2>Additional information</h2>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Website</label>
							<md-input v-model="newLocation.website"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Facebook page</label>
							<md-input v-model="newLocation.facebookUrl"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Additional information</label>
							<md-textarea v-model="newLocation.information"></md-textarea>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>
		</stepper>

		<finished-step 
			:class="(!finishedCreation ?'hide' :'')"
			contentType="Location"
			v-on:back="$router.push('locations')"
			v-on:redo="restartForm">
		</finished-step>

		<div class="loading" v-show="loading">
			<div class="darken"></div>
			<md-spinner md-indeterminate class="md-accent"></md-spinner>
		</div>
		
		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>

		<md-dialog class="similar-dialog" 
				   ref="similarLocationDialog"
				   :md-click-outside-to-close="false" 
				   :md-esc-to-close="false">
			<confirm-dialog v-on:close="checkSimilar(false)" v-on:confirm="checkSimilar(true)">
				<h3 slot="headline">There already is a location at this address. Maybe you wanted to enter this one?</h3>
				<div slot="additional-information" class="similar-event" v-for="location in similarLocations" :key="location._id">
					<a :href="`/location/${location.url}`" target="_blank">
						<div class="similar-event-info">
							<h3>{{location.name}}</h3>
							<p>Address: <span>{{location.address.street}}</span></p>
							<p>City: <span>{{location.address.city}}</span></p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</a>
				</div>
			</confirm-dialog>
		</md-dialog>
	</div>
</template>

<script>
import places from 'places.js';

import {backendUrl} from '@/secrets.js';

import LocationForm from '@/components/ContentForms/LocationForm';
import ImageStep from '@/components/NewContent/ImageStep';
import ConfirmDialog from '@/components/Utilities/ConfirmDialog';
import FinishedStep from '@/components/NewContent/FinishedStep';
import Stepper from '@/components/Utilities/Stepper';

export default {
	name: 'new-location',
	components: {
		LocationForm,
		ImageStep,
		ConfirmDialog,
		FinishedStep,
		Stepper
	},
	watch: {
		newLocationAddress() {
			this.getSimilar();
		},
		newLocationCity() {
			this.getSimilar();
		},
		newLocationName() {
			this.getSimilar();
		}
	},
	computed: {
		newLocation() {
			return this.$store.getters.currentLocation;
		},
		newLocationAddress() {
			return this.newLocation.address.street;
		},
		newLocationCity() {
			return this.newLocation.address.city;
		},
		newLocationName() {
			return this.newLocation.name;
		}
	},
	data() {
		return {
			submitStatus: '',
			loading: false,
			apiRoute: '/api/unvalidated-locations',
			blankLocation: {
				name: '',
				address: {
					street: '',
					city: '',
					administrative: '',
					country: '',
					county: '',
					countryCode: '',
					postcode: '',
					lat: 0,
					lng: 0,
					value: '',
				},
				information: '',
				website: '',
				facebookUrl: ''
			},
			similarLocationFound: false,
			similarLocations: [],
			locationImage: null,
			finishedCreation: false
		}
	},
	methods: {
		addLocation() {
			this.loading = true;
			this.submitStatus = '';

			if(this.newLocation.name && this.newLocation.address) {
				
				let formData = new FormData();
				formData.append('image', this.locationImage, 'location-image.png');
				formData.append('data', JSON.stringify(this.newLocation));

				this.$http.post(backendUrl + this.apiRoute, formData)
					.then(response => {
						this.$emit('success');
						this.loading = false;
						this.emptyFormFields();

						this.finishedCreation = true;
					})
					.catch(err => {
						this.loading = false;
						this.submitStatus = err.body.message;
						this.$refs.snackbar.open();
					});
			}
			else {
				this.submitStatus = 'All required input fields have to be filled out!';
				this.$refs.snackbar.open();
				this.loading = false;
			}
    	},
	  	emptyFormFields() {
			this.$store.commit('setCurrentLocation', JSON.parse(JSON.stringify(this.blankLocation)));
			this.locationImage = null;
			this.$refs.imageInput.resetInput();
		},
		getSimilar() {
			this.similarLocationFound = false;
			if((this.newLocation.address.street || (this.newLocation.address.city && this.newLocation.name))) {
				let requestParams = (this.newLocation.address.city && this.newLocation.name) 
					?`city=${this.newLocation.address.city}&name=${this.newLocation.name}` 
					:`address=${this.newLocation.address.street}`;

				this.$http.get(backendUrl + '/api/locations/similar?' + requestParams)
				.then(response => {
					if (response.body.data) {
						this.similarLocations = response.body.data;
						this.similarLocationFound = true;
						this.$refs.similarLocationDialog.open()
					}
				}).catch(err => console.log(err));
			}
		},
		checkSimilar(accept) {
			if(accept)
				this.$router.push('/locations');

			this.similarLocationFound = false;
			this.$refs.similarLocationDialog.close();
		},
		restartForm() {
			this.finishedCreation = false;
			this.$refs.formStepper.changeStep(1);
		}
	},
	mounted() {
		this.emptyFormFields();

		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.apiRoute = '/api/locations';
			})
			.catch(err => console.log(err));
			
		this.placesAutocomplete = places({container: this.$refs.address_input, type: 'address', language: 'en'});
		this.placesAutocomplete.on('change', e => {
			this.newLocation.address.street = e.suggestion.name;
			this.newLocation.address.city = e.suggestion.city ?e.suggestion.city :'';

			if(e.suggestion.city)
				this.newLocation.address.city = e.suggestion.city;
			else if(e.suggestion.county)
				this.danewLocationta.address.city = e.suggestion.county;
			else if(e.suggestion.administrative)
				this.newLocation.address.city = e.suggestion.administrative;
			else 
				this.newLocation.address.city = '';

			this.newLocation.address.administrative = e.suggestion.administrative;
			this.newLocation.address.county = e.suggestion.county;
			this.newLocation.address.country = e.suggestion.country;
			this.newLocation.address.countryCode = e.suggestion.countryCode;
			this.newLocation.address.postcode = e.suggestion.postcode;
			this.newLocation.address.lat = e.suggestion.latlng.lat;
			this.newLocation.address.lng = e.suggestion.latlng.lng;
			this.newLocation.address.value = e.suggestion.value;
			this.value = e.suggestion.value ?e.suggestion.value :this.value;
		});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newLocation";
</style>
