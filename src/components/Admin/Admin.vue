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
					<md-select name="content-type" v-model="currentCategory" v-on:selected="getUnvalidatedData">
						<md-option value="unverifiedEvents">Events</md-option>
						<md-option value="unverifiedLocations">Locations</md-option>
						<md-option value="unverifiedBands">Bands</md-option>
						<md-option value="reports">Reported Content</md-option>
					</md-select>
				</md-input-container>

				<md-list>
					<div v-if="unverifiedContent.length > 0 && currentCategory != 'reports'">
						<md-list-item v-for="(data, index) in unverifiedContent" :key="index" @click="showInfo(unverifiedContent, index)">
							<h4>{{data.title ?data.title :data.name}}</h4>
							<span>{{currentCategory}}</span>
						</md-list-item>		
					</div>
					<div v-if="unverifiedContent.length > 0 && currentCategory == 'reports'">
						<md-list-item v-for="(data, index) in unverifiedContent" :key="index" @click="showInfo(unverifiedContent, index)">
							<h4 v-if="data.item">{{data.item.title ?data.item.title :data.item.name}}</h4>
							<span>{{data.category}}</span>
						</md-list-item>		
					</div>
					<h4 class="nothing-found-msg" v-if="unverifiedContent.length == 0">No unverified {{currentCategory}}s available!</h4>
					
					<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>
				</md-list>
			</div>

			<div class="verify-info">
				<md-button class="md-icon-button md-accent close-btn" v-on:click="closeInfo">
					<md-icon>clear</md-icon>
				</md-button>

				<h1>Given data</h1>
				<event-form v-if="currentCategory == 'unverifiedEvents' && unverifiedContent.length > 0" :event="verifyData" :edit="false"></event-form>

				<location-form v-if="currentCategory == 'unverifiedLocations' && unverifiedContent.length > 0" :data="verifyData"></location-form>

				<band-form v-if="currentCategory == 'unverifiedBands' && unverifiedContent.length > 0" :data="verifyData"></band-form>

				<div class="report-form" v-if="currentCategory == 'reports' && unverifiedContent.length > 0">
					<h2>Reported {{verifyData.category}}</h2>
					<div>
						{{verifyData.item.title ?verifyData.item.title :verifyData.item.name}}
					</div>
					<h2>User's reason for report:</h2>
					<p>{{verifyData.description}}</p>

					<div class="control-buttons">
						<button class="md-button md-raised dismiss-btn" v-on:click="handleVerify(true)">dismiss report</button>
						<button class="md-button md-raised delete-btn" v-on:click="handleVerify(false)">delete {{verifyData.category}}</button>
					</div>
				</div>
				
				<div v-if="unverifiedContent.length > 0 && currentCategory != 'reports'" >
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
			verifyData: {},
			unverifiedContent: []
		}
	},
	methods: {
		handleVerify(keepData) {
			//Delete the currently viewed data from the respective unvalidated-route.
			this.$http.delete(backendUrl + this.unvalidatedRoute + this.verifyData._id)
				.then(response => {
					//If the Admin chooses to unlock the data, send a post request to the respective route to unlock it for all users
					if(keepData && this.currentCategory != 'reports') {
						this.$http.post(backendUrl + this.validatedRoute,  this.verifyData)
							.then(response => {})
							.catch(err => {});
					}
					else if(this.currentCategory == 'reports' && !keepData) {
						this.$http.delete(backendUrl + `/api/${this.verifyData.category}s/${this.verifyData.item._id}`)
							.then(response => {})
							.catch(err => {});
					}
					
					//Delete the currently verified data-element from the array of unverified elements of the currently selected category.
					this.unverifiedContent.splice(this.verifyIndex, 1);
					
					//If there are still unverified elements of the current category left, show the first one of them.
					if(this.unverifiedContent[0]) {
						this.showInfo(this.unverifiedContent, 0)
					}

					document.getElementsByClassName('verify-info')[0].classList.remove('show-info');
				})
				.catch(err => {});
		},
		showInfo(content, index) {			
			
			document.getElementsByClassName('verify-info')[0].classList.add('show-info');	
			
			if(this.currentCategory == 'unverifiedEvents') {
				this.verifyData = Object.assign({}, content[index]);				

				this.verifyData.bands.forEach(band => {
					band.label = band.origin ?band.name + ' - ' + band.origin.country :'';
				});

				this.verifyData.location.label = this.verifyData.location.address ?this.verifyData.location.name + ' - ' + this.verifyData.location.address.city :'';				
			}	
			else {
				this.verifyData = content[index];
			}
			this.verifyIndex = index;
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		closeDialog(ref) {
			this.$refs[ref].close();
		},
		//Function for setting the currently selected category in the verify-list and set all variables for handling data for the respective category
		categoryChange(category) {
			if(category == 'unverifiedEvents') {
				this.unvalidatedRoute = '/api/unvalidated-events/';
				this.validatedRoute = '/api/events';
			}
			else if (category == 'unverifiedLocations') {
				this.unvalidatedRoute = '/api/unvalidated-locations/';
				this.validatedRoute = '/api/locations';
			}
			else if (category == 'reports') {
				this.unvalidatedRoute = '/api/reports/';
				this.validatedRoute = '/api/reports';
			}
			else {
				this.unvalidatedRoute = '/api/unvalidated-Bands/';
				this.validatedRoute = '/api/bands';
			}

		},
		//Function for getting the unvalidated data for the currently selected category
		getUnvalidatedData(category) {
			this.loading = true;
			this.unverifiedContent = [];

			this.categoryChange(category);			
			
			this.$http.get(backendUrl + this.unvalidatedRoute)
				.then(response => {
					
					this.currentCategory = category;					

					//Check if there is a message in the response (= error)
					if(!response.body.message) {
						//Set the array of unvalidated events for the currently selected category to the data from the reponse
						this.unverifiedContent = response.body.data;
						console.log("current unverifiedContent:", this.unverifiedContent);
						

						this.loading= false;
						//Display the first element of the array of unvalidated data for the currently selected category.
						this.showInfo(this.unverifiedContent, 0);
					}
					else {
						//If there was an error or no data was found, set the array of unvalidated data for the current category to an empty array.
						this.unverifiedContent = [];
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
			this.$http.get(backendUrl + '/api/users/logout')
				.then(response => {
					this.$router.push('/');
				})
				.catch((err) => {
					console.log(err);
				});
			
		},
	},
	mounted() {
		this.getUnvalidatedData(this.currentCategory);
	}
}
</script>

<style lang="scss">
	@import "src/scss/Admin/_admin.scss";
</style>
