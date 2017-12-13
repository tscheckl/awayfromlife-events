<template>
	<div id="admin" class="center-ver-hor">
		<md-toolbar>
			<router-link to="/">
				<md-button>
					<md-icon>arrow_back</md-icon>
					<md-tooltip md-direction="bottom">Zurück zum Kalender (du bleibst eingeloggt)</md-tooltip>
				</md-button>
			</router-link>

			<h1>Admin Bereich</h1>

			<md-button v-on:click="openDialog('changePwdDialog')">
				<md-icon>lock_outline</md-icon>
				<md-tooltip md-direction="bottom">Passwort ändern</md-tooltip>
			</md-button>

			<md-button v-on:click="logout">
				<md-icon>exit_to_app</md-icon>
				<md-tooltip md-direction="bottom">Logout</md-tooltip>
			</md-button>
		</md-toolbar>

		<div class="admin-content">
			<div class="verify-list">
				<md-input-container>
					<md-select name="content-type" v-model="isEvent">
						<md-option :value="true" v-on:click="showEventInfo(this.unverifiedEvents[0])">Events</md-option>
						<md-option :value="false" v-on:click="showLocationInfo(this.unverifiedLocations[0])">Locations</md-option>
					</md-select>
				</md-input-container>
				
				<md-list v-if="isEvent">
					<md-list-item v-for="event in unverifiedEvents" :key="event._id" @click="showEventInfo(event)">
						<h4>{{event.title}}</h4>
						<span>Event</span>
					</md-list-item>
				</md-list>

				<md-list v-else>
					<md-list-item v-for="location in unverifiedLocations" :key="location._id" @click="showLocationInfo(location)">
						<h4>{{location.name}}</h4>
						<span>Location</span>
					</md-list-item>
				</md-list>
			</div>
			<div class="verify-info">
				<h1>Angegebene Daten</h1>

				<event-form v-if="isEvent" :data="verifyEvent" :selectedLocation="selectedLocation"></event-form>

				<location-form v-else :data="verifyLocation"></location-form>
				
				<md-button type="submit" v-on:click="handleVerify(true)" class="md-accent verify-btn">
					<md-icon>check</md-icon>
				</md-button>
				<md-button type="submit" v-on:click="handleVerify(false)" class="md-accent delete-btn">
					<md-icon>clear</md-icon>
				</md-button>
				<md-spinner v-if="loading" md-indeterminate></md-spinner>
			</div>
		</div>

		<md-dialog ref="changePwdDialog">
			<change-password-form v-on:pwdChanged="closeDialog('changePwdDialog')"></change-password-form>
		</md-dialog>
	</div>
</template>

<script>
import moment from 'moment';

import EventForm from './EventForm';
import LocationForm from './LocationForm';
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
			verifyEvent: {},
			selectedLocation: {},
			unverifiedLocations: [],
			verifyLocation: {}
		}
	},
	methods: {
		handleVerify(keepData) {
			if(this.isEvent) {
				//Format and set the Event's date and time attributes from the startTime variable created by the Datepicker
				this.verifyEvent.time = moment(this.verifyEvent.startDate.time).format('HH:mm');
				this.verifyEvent.startDate = moment(this.verifyEvent.startDate.time).format('YYYY-MM-DD');

				this.$http.delete(backendUrl + '/api/unvalidated-events/' + this.verifyEvent._id, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
					.then(response => {
						// https://www.facebook.com/Atari-Leipzig-259756324046400/
						if(keepData) {
							this.$http.post(backendUrl + '/api/events',  this.verifyEvent, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
								.then(response => {
									console.log(response);
								})
								.catch(err => {
									console.log(err);
								});
						}
						
						this.unverifiedEvents.shift();
						this.verifyEvent = {};
					})
					.catch(err => {
						console.log(err);
					});
			}
			else {
				this.$http.delete(backendUrl + '/api/unvalidated-locations/' + this.verifyLocation._id, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
					.then(response => {
						// https://www.facebook.com/Atari-Leipzig-259756324046400/
						if(keepData) {
							this.$http.post(backendUrl + '/api/locations',  this.verifyLocation, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
								.then(response => {
									console.log(response);
								})
								.catch(err => {
									console.log(err);
								});
						}

						this.unverifiedLocations.shift();
						this.verifyLocation = {};
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		showEventInfo(event) {
			console.log("ShowEvent Bands: ", event.bands);
			this.$http.get(backendUrl + "/api/locations/" + event.location)
				.then(response => {
					this.verifyEvent = {
						_id: event._id,
						title: event.title,
						description: event.description,
						startDate: {
							time: event.startDate + " " + event.time
						},
						time: event.time,
						location: response.body._id,
						bands: event.bands,
						endDate: ''
					};
					this.selectedLocation = response.body;
				})
				.catch(err => {
					console.log(err);
				})
		},
		showLocationInfo(location) {
			console.log(location);
			this.verifyLocation = location;
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
	},
	mounted() {
		this.$http.get(backendUrl + '/api/unvalidated-events', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
			.then(response => {
				this.unverifiedEvents = response.body;
				this.$http.get(backendUrl + "/api/locations")
					.then(response => {
						this.locations = response.body;
						this.showEventInfo(this.unverifiedEvents[0]);
					})
					.catch(err => {
						console.log(err);
					})
			})
			.catch(err => {
				console.log(err);
			});

		this.$http.get(backendUrl + '/api/unvalidated-locations', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
			.then(response => {
				this.unverifiedLocations = response.body;
			})
			.catch(err => {
				console.log(err);
			})
	}
}
</script>

<style lang="scss">
	@import "src/scss/_admin.scss";
</style>
