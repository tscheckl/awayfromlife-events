<template>
	<div id="new_location">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose()">
  			<md-icon>clear</md-icon>
		</md-button>
		
		<h1>{{edit ?'EDIT LOCATION' :'NEW LOCATION'}}</h1>
		
		<location-form :data="newLocation" :value="newLocationValue"></location-form>

		<md-button type="submit" v-on:click="addLocation" class="md-raised md-accent">{{edit ?'Update Location' :'Add Location'}}</md-button>
		<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		
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
					<a :href="`/#/location/${location.url}`" target="_blank">
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
import ConfirmDialog from '@/Components/ConfirmDialog';
import LocationForm from '@/Components/ContentForms/LocationForm';

import {backendUrl} from '@/secrets.js';

export default {
	name: 'new-location',
	components: {
		LocationForm,
		ConfirmDialog
	},
	props: {
		edit: {
			type: Boolean,
			default: false
		}
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
			if(this.edit) {
				return JSON.parse(JSON.stringify(this.$store.getters.currentLocation));
			}
			else {
				return this.blankLocation
			}
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
			newLocationValue: 'wdwadaw',
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
			similarLocations: []

		}
	},
	methods: {
		addLocation() {
			this.loading = true;
			this.submitStatus = '';
			
			var vm = this;

			if(this.newLocation.name && this.newLocation.address) {
				//Check if an location is currently edited or a new one is created and update the request routes + parameters accordingly.
				let requestType = this.edit?'put':'post'
				let editLocation = this.edit?'/' + this.newLocation._id: '';

				this.$http[requestType](backendUrl + this.apiRoute + editLocation, this.newLocation)
					.then(response => {
						this.emitSuccess();
						vm.loading = false;
						this.emptyFormFields();

					})
					.catch(err => {
						this.loading = false;
						this.submitStatus = this.edit ?'An error occurred while updating the Location. Please try again!'
										:'An error occurred while creating the Location. Please try again!';
						this.$refs.snackbar.open();
					});
			}
			else {
				this.submitStatus = 'All required input fields have to be filled out!';
				this.$refs.snackbar.open();
				this.loading = false;
			}
    	},
		emitSuccess() {
			this.$emit('success');
		},
		emitClose() {
			this.$emit('close');
		},
	  	emptyFormFields() {
			this.blankLocation = {
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
				facebookUrl: ''
			};
			this.newLocationValue = '';
		},
		getSimilar() {
			this.similarLocationFound = false;
			if((this.newLocation.address.street || (this.newLocation.address.city && this.newLocation.name)) && this.$route.path.toLowerCase().indexOf('/location/') == -1) {
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
				}).catch(err => {console.log(err);});
			}
		},
		checkSimilar(accept) {
			if(accept)
				this.emitClose();

			this.similarLocationFound = false;
			this.$refs.similarLocationDialog.close();
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth')
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
