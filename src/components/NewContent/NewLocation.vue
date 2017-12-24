<template>
	<div id="new_location">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
  			<md-icon>clear</md-icon>
		</md-button>
		
		<h1>Neue Location</h1>
		
		<location-form :data="newLocation"></location-form>

		<md-button type="submit" v-on:click="addLocation" class="md-raised md-accent">Send</md-button>
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
				// street: '',
				// zipCode: '',
				// city: '',
				address: '',
				website: '',
				facebook_page_url: ''
			},
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
						vm.submitStatus = 'Neue Location erfolgreich angelegt!';
						this.$refs.snackbar.open();
						this.emitClose();
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
				this.submitStatus = 'Alle erforderlichen Felder müssen ausgefüllt sein!';
				this.$refs.snackbar.open();
				this.loading = false;
			}
      },
	  emitClose() {
		  this.$emit('close');
	  }
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
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
	@import "src/scss/NewContent/_newLocation";
</style>
