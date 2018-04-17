<template>
	<div id="new_location">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
  			<md-icon>clear</md-icon>
		</md-button>
		
		<h1>NEW LOCATION</h1>
		
		<location-form :data="newLocation" :value="newLocationValue"></location-form>

		<md-button type="submit" v-on:click="addLocation" class="md-raised md-accent">Add Location</md-button>
		<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		<md-snackbar ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import LocationForm from '@/Components/ContentForms/LocationForm';

import {backendUrl} from '@/secrets.js';

export default {
	name: 'new-location',
	components: {
		LocationForm
	},
	data() {
		return {
			newLocation: {
				name: '',
				address: {
					street: '',
					city: '',
					administrative: '',
					country: '',
					postcode: '',
					lat: 0,
					lng: 0,
					value: '',
				},
				information: '',
				website: '',
				facebook_page_url: ''
			},
			newLocationValue: '',
			submitStatus: '',
			loading: false,
			apiRoute: '/api/unvalidated-locations'
		}
	},
	methods: {
		addLocation() {
			this.loading = true;
			this.submitStatus = '';
			
			var vm = this;

			if(this.newLocation.name && this.newLocation.address) {
				//Check if sending directly to validated route and if so, also send token to verify.
				let authHeader =  localStorage.aflAuthToken? {'Authorization': 'JWT ' + localStorage.aflAuthToken}: {};

				this.$http.post(backendUrl + this.apiRoute, this.newLocation, {headers: authHeader})
					.then(response => {	
						vm.submitStatus = 'New Location successfully created';
						this.$refs.snackbar.open();
						this.emitClose();
						vm.loading = false;
						this.emptyFormFields();

					})
					.catch(err => {
						this.loading = false;
						vm.submitStatus = 'An error occurred while creating the location. Please try again!';
						this.$refs.snackbar.open();
					});
			}
			else {
				this.submitStatus = 'All required input fields have to be filled out!';
				this.$refs.snackbar.open();
				this.loading = false;
			}
    	},
		emitClose() {
			this.$emit('close');
		},
	  	emptyFormFields() {
			this.newLocation = {
				name: '',
				address: {
					street: '',
					city: '',
					administrative: '',
					country: '',
					postcode: '',
					lat: 0,
					lng: 0,
					value: '',
				},
				information: '',
				website: '',
				facebook_page_url: ''
			};
			this.newLocationValue = '';
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
			.then(response => {
				this.apiRoute = '/api/locations';
			})
			.catch(err => {
			});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newLocation";
</style>
