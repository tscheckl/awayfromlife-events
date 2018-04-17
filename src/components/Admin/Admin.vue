<template>
	<div id="admin">
		<div class="admin-content">
			<div class="verify-list">
				<div class="admin-buttons">
					<md-button v-on:click="openDialog('changePwdDialog')">
						<md-icon>lock_outline</md-icon>
						<md-tooltip md-direction="bottom">Change password</md-tooltip>
					</md-button>

					<md-button v-on:click="logout">
						<md-icon>exit_to_app</md-icon>
						<md-tooltip md-direction="bottom">Logout</md-tooltip>
					</md-button>
				</div>
				
				<h1>Admin Console</h1>
				
				<md-input-container>
					<md-select name="content-type" v-model="currentCategory" v-on:selected="categoryChange">
						<md-option value="unverifiedEvents">Events</md-option>
						<md-option value="unverifiedLocations">Locations</md-option>
						<md-option value="unverifiedBands">Bands</md-option>
					</md-select>
				</md-input-container>
				
				<md-list v-if="currentCategory == 'unverifiedEvents'">
					<div v-if="unverifiedEvents.length > 0">
						<md-list-item v-for="(event, index) in unverifiedEvents" :key="event._id" @click="showEventInfo(event, index)">
							<h4>{{event.title}}</h4>
							<span>Event</span>
						</md-list-item>		
					</div>
					<h4 class="nothing-found-msg" v-else>No unverified events available!</h4>
					
					<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>
				</md-list>

				<md-list v-if="currentCategory == 'unverifiedLocations'">
					<div v-if="unverifiedLocations.length > 0">
						<md-list-item v-for="(location, index) in unverifiedLocations" :key="location._id" @click="showLocationInfo(location, index)">
							<h4>{{location.name}}</h4>
							<span>Location</span>
						</md-list-item>
					</div>
					<h4 class="nothing-found-msg" v-else>No unverified locations available!</h4>
					
					<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>
				</md-list>

				<md-list v-if="currentCategory == 'unverifiedBands'">
					<div v-if="unverifiedBands.length > 0">
						<md-list-item v-for="(band, index) in unverifiedBands" :key="band._id" @click="showBandInfo(band, index)">
							<h4>{{band.name}}</h4>
							<span>Band</span>
						</md-list-item>
					</div>
					<h4 class="nothing-found-msg" v-else>No unverified bands available!</h4>
					
					<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>
				</md-list>
			</div>

			<div class="verify-info">
				<md-button class="md-icon-button md-accent close-btn" v-on:click="closeInfo">
					<md-icon>clear</md-icon>
				</md-button>

				<h1>Given data</h1>

				<event-form v-if="currentCategory == 'unverifiedEvents' && unverifiedEvents.length > 0" 
					:data="verifyEvent" :edit="false" :selectedBands="selectedBands" :selectedLocation="selectedLocation"></event-form>

				<location-form v-if="currentCategory == 'unverifiedLocations' && unverifiedLocations.length > 0" :data="verifyLocation"></location-form>

				<band-form v-if="currentCategory == 'unverifiedBands' && unverifiedBands.length > 0" :data="verifyBand"></band-form>
				
				<div v-if="currentCategory == 'unverifiedEvents' && unverifiedEvents.length > 0 
						|| currentCategory == 'unverifiedLocations' && unverifiedLocations.length > 0
						|| currentCategory == 'unverifiedBands' && unverifiedBands.length > 0" >
					<md-button type="submit" v-on:click="handleVerify(true)" class="md-accent verify-btn">
						<md-icon>check</md-icon>
						<md-tooltip md-direction="top">Keep and activate entry</md-tooltip>
					</md-button>

					<md-button type="submit" v-on:click="handleVerify(false)" class="md-accent delete-btn">
						<md-icon>clear</md-icon>
						<md-tooltip md-direction="top">Decline and delete entry</md-tooltip>
					</md-button>
				</div>
			</div>
		</div>

		<md-dialog ref="changePwdDialog">
			<change-password-form v-on:pwdChanged="closeDialog('changePwdDialog')"></change-password-form>
		</md-dialog>
	</div>
</template>

<script>
import moment from 'moment';

import EventForm from '@/Components/ContentForms/EventForm';
import LocationForm from '@/Components/ContentForms/LocationForm';
import BandForm from '@/Components/ContentForms/BandForm';
import ChangePasswordForm from './ChangePasswordForm';

import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'admin',
	components: {
		EventForm,
		LocationForm,
		BandForm,
		ChangePasswordForm
	},
	data() {
		return {
			error: false,
			errorMsg: '',
			loading: false,
			// isEvent: true,
			currentCategory: 'unverifiedEvents',
			unverifiedEvents: [],
			verifyEvent: {
				_id: '',
				title: '',
				description: '',
				startDate: '',
				time: '',
				location: '',
				bands: [],
				endDate: ''
			},
			selectedLocation: {},
			selectedBands: [],
			unverifiedLocations: [],
			verifyLocation: {},
			unverifiedBands: [],
			verifyBand: {},
			verifyIndex: Number,
			unvalidatedRoute: '/api/unvalidated-events/',
			validatedRoute: '/api/events',
			verifyData: {}
		}
	},
	methods: {
		handleVerify(keepData) {
			//Delete the currently viewed data from the respective unvalidated-route.
			this.$http.delete(backendUrl + this.unvalidatedRoute + this.verifyData._id, {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
				.then(response => {
					//If the Admin chooses to unlock the data, send a post request to the respective route to unlock it for all users
					if(keepData) {
						this.$http.post(backendUrl + this.validatedRoute,  this.verifyData, {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
							.then(response => {})
							.catch(err => {});
					}
					
					//Delete the currently verified data-element from the array of unverified elements of the currently selected category.
					this[this.currentCategory].splice(this.verifyIndex, 1);
					//Reset all Object that are used for displaying the data
					this.verifyEvent = {};
					this.verifyLocation = {};
					this.verifyBand = {};

					//If there are still unverified elements of the current category left, show the first one of them.
					if(this[this.currentCategory][0]) {
						//Call the respective show-function according to the current category
						if(this.currentCategory == 'unverifiedEvents')
							this.showEventInfo(this.unverifiedEvents[0]);
						else if (this.currentCategory == 'unverifiedLocations')
							this.showLocationInfo(this.unverifiedLocations[0]);
						else
							this.showBandInfo(this.unverifiedBands[0]);
					}

					document.getElementsByClassName('verify-info')[0].classList.remove('show-info');
				})
				.catch(err => {});
		},
		showEventInfo(event, index) {
			console.log(event);
			
			document.getElementsByClassName('verify-info')[0].classList.add('show-info');
			
			this.verifyEvent = Object.assign({}, event);

			this.verifyEvent.bands.forEach(band => {
				band.origin ?band.label = band.name + ' - ' + band.origin.country :'';
			});

			this.verifyEvent.location.address ?this.verifyEvent.location.label = this.verifyEvent.location.name + ' - ' + this.verifyEvent.location.address.city :'';
			this.selectedLocation = Object.assign({}, event.location);
			this.selectedBands = event.bands.slice();
			
			this.verifyData = this.verifyEvent;
		},
		showLocationInfo(location, index) {
			document.getElementsByClassName('verify-info')[0].classList.add('show-info');
			
			this.verifyLocation = location;
			this.verifyData = this.verifyLocation;
			this.verifyIndex = index;
		},
		showBandInfo(band, index) {
			document.getElementsByClassName('verify-info')[0].classList.add('show-info');
			
			this.verifyBand = band;
			this.verifyData = this.verifyBand;
			this.verifyIndex = index;
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		closeDialog(ref) {
			this.$refs[ref].close();
		},
		//Function for setting the currently selected category in the verify-list and set all variables for handling data for the respective category
		categoryChange() {
			if(this.currentCategory == 'unverifiedEvents') {
				this.unvalidatedRoute = '/api/unvalidated-events/';
				this.validatedRoute = '/api/events';
				this.verifyData = this.verifyEvent;
			}
			else if (this.currentCategory == 'unverifiedLocations') {
				this.unvalidatedRoute = '/api/unvalidated-locations/';
				this.validatedRoute = '/api/locations';
				this.verifyData = this.verifyLocation;
			}
			else {
				this.unvalidatedRoute = '/api/unvalidated-Bands/';
				this.validatedRoute = '/api/bands';
				this.verifyData = this.verifyBand;
			}

			//Get the unverified-data for the selected category
			this.getUnvalidatedData();
		},
		//Function for getting the unvalidated data for the currently selected category
		getUnvalidatedData() {
			this.loading = true;

			this.$http.get(backendUrl + this.unvalidatedRoute, {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
				.then(response => {
					//Check if there is a message in the response (= error)
					if(!response.body.message) {
						//Set the array of unvalidated events for the currently selected category to the data from the reponse
						this[this.currentCategory] = response.body.data;
						this.loading= false;
						//Display the first element of the array of unvalidated data for the currently selected category.
						if(this.currentCategory == 'unverifiedEvents') 
							this.showEventInfo(this.unverifiedEvents[0]);
						else if(this.currentCategory == 'unverifiedLocations')
							this.showLocationInfo(this.unverifiedLocations[0]);
						else
							this.showBandInfo(this.unverifiedBands[0]);
					}
					else {
						//If there was an error or no data was found, set the array of unvalidated data for the current category to an empty array.
						this[this.currentCategory] = [];
						this.loading = false;
					}
				})
				.catch(err => {
					this.loading = false;
				});
		},
		closeInfo() {
			document.getElementsByClassName('verify-info')[0].classList.remove('show-info');
		},
		logout() {
			localStorage.removeItem('aflAuthToken');
			this.$router.push('/');
		},
	},
	mounted() {
		this.categoryChange();
	}
}
</script>

<style lang="scss">
	@import "src/scss/Admin/_admin.scss";
</style>
