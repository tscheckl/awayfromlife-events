<template>
	<div id="new_location">

		<h1>New location</h1>
		
		<location-form :data="newLocation"></location-form>

		<md-button type="submit" v-on:click="addLocation" class="md-raised md-accent">Send</md-button>
		<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		<span class="message" v-if="submitStatus.length >= 1" :class="success? 'success': 'error'">{{submitStatus}}</span>
	</div>
</template>

<script>
import LocationForm from './LocationForm';

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
				// street: '',
				// zipCode: '',
				// city: '',
				address: '',
				website: '',
				facebook_page_url: ''
			},
			success: false,
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
				console.log(this.newLocation);
				this.$http.post(backendUrl + this.apiRoute, vm.newLocation)
					.then(response => {	
						vm.submitStatus = "New Location was successfully created.";
						vm.success = true;
						vm.loading = false;

						vm.newLocation.name = '';
						vm.newLocation.address = '';
						vm.newLocation.website = '';
						vm.newLocation.facebook_page_url = '';
					})
					.catch(err => {
						this.loading = false;
						console.log(err);
					});
			}
			else {
				this.submitStatus = "All fields have to be filled out!";
				this.success = false;
				this.loading = false;
			}
      },
	},
	mounted() {
		this.$http.get(backendUrl + '/users/auth', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
			.then(response => {
				this.apiRoute = '/api/locations';
			})
			.catch(err => {
				console.log(err);
			})
	}
}
</script>

<style lang="scss">
	@import "src/scss/_newLocation";
</style>
