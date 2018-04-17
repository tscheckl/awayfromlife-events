<template>
	<div id="new_band">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
  			<md-icon>clear</md-icon>
		</md-button>
		
		<h1>New Band</h1>
		
		<band-form :data="newBand"></band-form>

		<md-button type="submit" v-on:click="addBand" class="md-raised md-accent">Add Band</md-button>
		<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		<md-snackbar ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import BandForm from '@/Components/ContentForms/BandForm';

import {backendUrl} from '@/secrets.js';

export default {
	name: 'new-band',
	components: {
		BandForm
	},
	data() {
		return {
			newBand: {
				name: '',
				genre: '',
				origin: {},
				history: '',
				label: '',
				releases: [{
					releaseName: '',
					releaseYear: ''
				}],
				foundingDate: '',
				websiteUrl: '',
				bandcampUrl: '',
				soundcloudUrl: '',
				facebookUrl: ''
			},
			newBandValue: '',
			submitStatus: '',
			loading: false,
			apiRoute: '/api/unvalidated-bands'
		}
	},
	methods: {
		addBand() {
			this.loading = true;
			this.submitStatus = '';
			
			var vm = this;

			if(this.newBand.name && this.newBand.genre && this.newBand.origin && this.newBand.foundingDate) {
				//Check if sending directly to validated route and if so, also send token to verify.
				let authHeader =  localStorage.aflAuthToken? {'Authorization': 'JWT ' + localStorage.aflAuthToken}: {};

				this.$http.post(backendUrl + this.apiRoute, this.newBand, {headers: authHeader})
					.then(response => {	
						vm.submitStatus = 'New Bands successfully created';
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
			this.newBand = {
				name: '',
				genre: '',
				origin: {},
				history: '',
				label: '',
				releases: [{
					releaseName: '',
					releaseYear: ''
				}],
				foundingDate: '',
				websiteUrl: '',
				bandcampUrl: '',
				soundcloudUrl: '',
				facebookUrl: ''
			};
			this.newBandValue = '';
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
			.then(response => {
				this.apiRoute = '/api/bands';
			})
			.catch(err => {});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newBand.scss";
</style>
