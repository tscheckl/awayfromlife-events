<template>
	<div id="admin" >
		<md-toolbar>
			<router-link to="/">
				<md-button>
					<md-icon>arrow_back</md-icon>
					<md-tooltip md-direction="right">Back to Calendar (You stay logged in)</md-tooltip>
				</md-button>
			</router-link>

			<h1>ADMIN CONSOLE</h1>

			<md-button v-on:click="openDialog('changePwdDialog')">
				<md-icon>lock_outline</md-icon>
				<md-tooltip md-direction="bottom">Change password</md-tooltip>
			</md-button>

			<md-button v-on:click="logout">
				<md-icon>exit_to_app</md-icon>
				<md-tooltip md-direction="bottom">Logout</md-tooltip>
			</md-button>
		</md-toolbar>

		<div class="admin-content">
			<div class="verify-list">
				<md-input-container>
					<md-select name="content-type" v-model="isEvent" v-on:selected="categoryChange">
						<md-option :value="true">Events</md-option>
						<md-option :value="false">Locations</md-option>
					</md-select>
				</md-input-container>
				
				<md-list v-if="isEvent">
					<div v-if="unverifiedEvents.length > 0">
						<md-list-item v-for="(event, index) in unverifiedEvents" :key="event._id" @click="showEventInfo(event, index)">
							<h4>{{event.title}}</h4>
							<span>Event</span>
						</md-list-item>		
					</div>
					<h4 class="nothing-found-msg" v-else>No unverified events available!</h4>
					
					<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>
				</md-list>

				<md-list v-else>
					<div v-if="unverifiedLocations.length > 0">
						<md-list-item v-for="(location, index) in unverifiedLocations" :key="location._id" @click="showLocationInfo(location, index)">
							<h4>{{location.name}}</h4>
							<span>Location</span>
						</md-list-item>
					</div>
					<h4 class="nothing-found-msg" v-else>No unverified locations available!</h4>
					
					<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>
				</md-list>
			</div>

			<div class="verify-info">
				<md-button class="md-icon-button md-accent close-btn" v-on:click="closeInfo">
					<md-icon>clear</md-icon>
				</md-button>

				<h1>Given data</h1>

				<event-form v-if="isEvent && unverifiedEvents.length > 0" :data="verifyEvent" :selectedLocation="selectedLocation"></event-form>

				<location-form v-if="!isEvent && unverifiedLocations.length > 0" :data="verifyLocation"></location-form>
				
				<div v-if="isEvent && unverifiedEvents.length > 0 || !isEvent && unverifiedLocations.length > 0" >
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
import ChangePasswordForm from './ChangePasswordForm';

import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'admin',
	components: {
		EventForm,
		LocationForm,
		ChangePasswordForm
	},
	data() {
		return {
			error: false,
			errorMsg: '',
			loading: false,
			isEvent: true,
			unverifiedEvents: [],
			locations: [],
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
			unverifiedLocations: [],
			verifyLocation: {},
			verifyIndex: Number
		}
	},
	methods: {
		handleVerify(keepData) {
			if(this.isEvent) {
				this.$http.delete(backendUrl + '/api/unvalidated-events/' + this.verifyEvent._id, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
					.then(response => {
						if(keepData) {
							this.$http.post(backendUrl + '/api/events',  this.verifyEvent, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
								.then(response => {
									console.log(response);
								})
								.catch(err => {
									console.log(err);
								});
						}
						
						this.unverifiedEvents.splice(this.verifyIndex, 1);
						this.verifyEvent = {};
						document.getElementsByClassName('verify-info')[0].classList.remove('show-info');
						if(this.unverifiedEvents[0]) {
							this.showEventInfo(this.unverifiedEvents[0]);
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
			else {
				console.log('to be verified ', this.verifyLocation);
				this.$http.delete(backendUrl + '/api/unvalidated-locations/' + this.verifyLocation._id, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
					.then(response => {
						if(keepData) {
							this.$http.post(backendUrl + '/api/locations',  this.verifyLocation, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
								.then(response => {
									console.log(response);
								})
								.catch(err => {
									console.log(err);
								});
						}

						this.unverifiedLocations.splice(this.verifyIndex, 1);
						this.verifyLocation = {};
						document.getElementsByClassName('verify-info')[0].classList.remove('show-info');
						if(this.unverifiedLocations[0]) {
							this.showLocationInfo(this.unverifiedLocations[0]);
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		showEventInfo(event, index) {
			document.getElementsByClassName('verify-info')[0].classList.add('show-info');
			this.$http.get(backendUrl + "/api/locations/" + event.location)
				.then(response => {
					this.verifyEvent = {
						_id: event._id,
						title: event.title,
						description: event.description,
						startDate: event.startDate,
						time: event.time,
						location: response.body._id,
						bands: event.bands,
						endDate: ''
					};
					this.selectedLocation = response.body;
					this.selectedLocation.label = this.selectedLocation.name + ' - ' + this.selectedLocation.address;
				})
				.catch(err => {
					console.log(err);
				})
			this.verifyIndex = index;
		},
		showLocationInfo(location, index) {
			console.log(location);
			this.verifyLocation = location;
			this.verifyIndex = index;
		},
		logout() {
			sessionStorage.removeItem('aflAuthToken');
			this.$router.push('/');
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		closeDialog(ref) {
			this.$refs[ref].close();
		},
		categoryChange() {
			if(this.isEvent) {
				this.getUnvalidatedEvents();
			}
			else {
				this.getUnvalidatedLocations();
			}
		},
		getUnvalidatedEvents() {
			this.loading = true;

			this.$http.get(backendUrl + '/api/unvalidated-events', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
				.then(response => {
					if(!response.body.message) {
						this.unverifiedEvents = response.body;

						this.$http.get(backendUrl + "/api/locations")
							.then(response => {
								this.locations = response.body;
								this.loading = false;
								this.showEventInfo(this.unverifiedEvents[0]);
							})
							.catch(err => {
								console.log(err);
								this.loading = false;
							})
					}
					else {
						this.unverifiedEvents = [];
						this.loading = false;
					}
				})
				.catch(err => {
					console.log(err);
					this.loading = false;
				});
		},
		getUnvalidatedLocations() {
			this.loading = true;

			this.$http.get(backendUrl + '/api/unvalidated-locations', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
				.then(response => {
					if(!response.body.message) {
						this.unverifiedLocations = response.body;
						this.showLocationInfo(this.unverifiedLocations[0]);
					}
					else {
						this.unverifiedLocations = [];
					}
					this.loading = false;
					console.log("meddl on", this.unverifiedLocations);
					console.log(this.unverifiedLocations.length);
				})
				.catch(err => {
					console.log(err);
					this.loading = false;
				});
		},
		closeInfo() {
			document.getElementsByClassName('verify-info')[0].classList.remove('show-info');
		}
	},
	mounted() {
		this.categoryChange();
	}
}
</script>

<style lang="scss">
	@import "src/scss/Admin/_admin.scss";
</style>
