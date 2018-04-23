<template>
	<div id="new_band">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
  			<md-icon>clear</md-icon>
		</md-button>
		
		<div class="content">
			<h1>{{edit? 'EDIT BAND' :'NEW BAND'}}</h1>
		
			<band-form :data="newBand"></band-form>

			<md-button type="submit" v-on:click="addBand" class="md-raised md-accent">{{edit ?'Update Band' :'Add Band'}}</md-button>
		</div>
		
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
	props: {
		edit: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		newBand() {
			if(this.edit) {
				return Object.assign({},this.$store.getters.currentBand);
			}
			else {
				return this.blankBand
			}
		}
	},
	data() {
		return {
			newBandValue: '',
			submitStatus: '',
			loading: false,
			apiRoute: '/api/unvalidated-bands',
			blankBand: {
				name: '',
				genre: '',
				origin: {},
				history: '',
				recordLabel: '',
				releases: [{
					releaseName: '',
					releaseYear: ''
				}],
				foundingDate: '',
				websiteUrl: '',
				bandcampUrl: '',
				soundcloudUrl: '',
				facebookUrl: ''
			}
		}
	},
	methods: {
		addBand() {
			this.loading = true;
			this.submitStatus = '';
			
			var vm = this;

			if(this.newBand.name && this.newBand.genre && this.newBand.origin) {
				//Check if auth token is available in localStorage, if so also send it to verify.
				let authHeader =  localStorage.aflAuthToken? {'Authorization': 'JWT ' + localStorage.aflAuthToken}: {};

				//Check if an location is currently edited or a new one is created and update the request routes + parameters accordingly.
				let requestType = this.edit?'put':'post'
				let editBand = this.edit?'/' + this.newBand._id: '';

				this.$http[requestType](backendUrl + this.apiRoute + editBand, this.newBand, {headers: authHeader})
					.then(response => {	
						vm.submitStatus = 'New Band successfully created';
						this.$refs.snackbar.open();
						this.emitClose();
						vm.loading = false;
						this.emptyFormFields();

					})
					.catch(err => {
						this.loading = false;
						this.submitStatus = this.edit ?'An error occurred while updating the Band. Please try again!'
										:'An error occurred while creating the Band. Please try again!';
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
			this.blankBand = {
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
