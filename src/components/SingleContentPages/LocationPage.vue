<template>
	<div id="location_page">

		<div class="page-header">

			<div class="left-container">

				<div class="edit-buttons">
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="openDialog('newLocationDialog')">
						<md-icon>edit</md-icon>
						<md-tooltip md-direction="bottom">edit location</md-tooltip>	
					</md-button>
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="deleteLocation">
						<md-icon>delete</md-icon>
						<md-tooltip md-direction="bottom">delete location</md-tooltip>
					</md-button>
					<md-button class="md-icon-button edit-button" v-on:click="openDialog('reportDialog')">
						<md-icon>report</md-icon>
						<md-tooltip md-direction="bottom">report event</md-tooltip>
					</md-button>	
				</div>
			</div>
		</div>


		<div class="content" v-if="location._id">
			<div class="content-header">
				<h2 class="title">{{location.name}}</h2>
			</div>

			<div class="content-body">
				<div v-if="location.address" class="address">
					<h3><md-icon>directions</md-icon>Address</h3>
					<p>{{location.address.street}}</p>
					<p>{{location.address.postcode}} {{location.address.city}}</p>
					<p v-if="location.address.county">{{location.address.county}}</p>
					<p>{{location.address.administrative}}</p>
					<p>{{location.address.country}}</p>
				</div>

				<hr v-if="location.website || location.facebookUrl">

				<h3 v-if="location.website || location.facebookUrl"><md-icon>subject</md-icon>Additional Information</h3>
				<p v-if="location.website" class="website">Website: <a :href="location.website" target="_blank">{{location.website}}</a></p>
				<p v-if="location.facebookUrl" class="facebook-page">Facebook Page: <a :href="location.facebookUrl" target="_blank">{{location.facebookUrl}}</a></p>

				<hr v-if="location.information">

				<h3 v-if="location.information"><md-icon>format_quote</md-icon>Description</h3>
				<p>{{location.information}}</p>

				<div class="events" v-if="locationEvents.length>0">
					<h3><md-icon>date_range</md-icon>Upcoming Events:</h3>
					<div class="event" v-for="index in eventLimiter" :key="index" v-on:click="showEvent(locationEvents[index-1])">
						<div class="event-information">
							<p>{{locationEvents[index-1].title}}</p>
							<p>{{locationEvents[index-1].formattedDate}}, {{locationEvents[index-1].formattedTime}}</p>
							<p>Lineup: <span v-for="band in locationEvents[index-1].bands" :key="band._id" class="event-band">{{band.name}}</span></p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</div>
					<p class="more-events-btn" v-if="eventLimiter!=locationEvents.length" @click="eventLimiter=locationEvents.length">More Events<md-icon>keyboard_arrow_down</md-icon></p>
				</div>
			</div>

			<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>
		</div>

		<div class="color-block"></div>

		<md-dialog ref="newLocationDialog" class="content-dialog">
			<new-location v-on:close="handleEditClose" :edit="true"></new-location>
		</md-dialog>

		<md-dialog ref="reportDialog">
			<report-dialog :id="location._id" contentType="location" v-on:close="message => handleDialogClose(message, 'reportDialog')"></report-dialog>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import NewLocation from '@/Components/NewContent/NewLocation';
import ReportDialog from '@/components/SingleContentPages/ReportDialog';
import NotFound from '@/components/NotFound';

import { backendUrl } from '@/secrets.js';
import moment from 'moment';

export default {
	name: 'location-page',
	components: {
		NewLocation,
		ReportDialog,
		NotFound
	},
	computed: {
		location() {
			return Object.assign({},this.$store.getters.currentLocation);
		}
	},
	data() {
		return {
			locationEvents: [],
			submitStatus: '',
			isAuthenticated: false,
			eventLimiter: 3,
			loading: false
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		//Function for giving the Single-Event dialog the data of the clicked event and opening it.
		showEvent(event) {
			this.$store.commit('setCurrentEvent', event);
			this.$router.push({path: `/event/${event.url}`});
		},
		deleteLocation() {
			this.$http.delete(backendUrl + '/api/locations/' + this.location._id)
				.then(response => {
					this.$router.go(-1);
				})
				.catch(err => {
					this.submitStatus = 'Error while deleting the location. Please try again!';
					this.$refs.snackbar.open();
				})
		},
		handleEditClose() {
			this.$refs['newLocationDialog'].close();
			
			this.$http.get(backendUrl + '/api/locations/byurl/' + this.$route.params.url)
			.then(response => {
				if(response.body.data) {
					this.submitStatus = 'Location successfully updated!';
					this.$refs.snackbar.open();
					this.$store.commit('setCurrentLocation', response.body.data);
				}
			})
			.catch(err => {
				this.submitStatus = 'Something went wrong while updating the location. Please try again!';
				this.$refs.snackbar.open();
			});
		},
		handleDialogClose(message, dialogRef) {
			this.$refs[dialogRef].close();
			this.submitStatus = message;
			this.$refs.snackbar.open();
		},
		getLocationEvents() {
			this.loading = true;
			this.locationEvents = [];

			this.$http.get(backendUrl + '/api/locations/events/' + this.location._id)
			.then(response => {
				if(!response.body.message) {
					this.locationEvents = response.body.data;
					if(this.locationEvents) {
						for(let event of this.locationEvents) {
							event.formattedDate = moment(event.startDate).format('LL');
							event.formattedTime = moment(event.startDate).format('HH:mm');
						}
					}

					this.eventLimiter = this.locationEvents.length>=3 ?3 :this.locationEvents.length;
				}
				this.loading = false;
			})
			.catch(err => {
				this.loading = false;
			});
		}
	},
	mounted() {
		document.getElementById('topbar').classList.add('single-page');
		
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => {});

		if(this.$store.getters.currentLocation.name == ''  || this.$store.getters.currentLocation.url != this.$route.params.url) {

			this.$http.get(backendUrl + '/api/locations/byurl/' + this.$route.params.url)
			.then(response => {
				if(response.body.data) {
					this.$store.commit('setCurrentLocation', response.body.data);
					this.getLocationEvents();
				}
			})
			.catch(err => this.$router.push('/not-found'));
		}
		else {
			this.getLocationEvents();
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_locationPage.scss";
</style>
