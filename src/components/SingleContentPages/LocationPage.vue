<template>
	<div id="location_page">
		<div class="page-container">
			<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
				<md-icon>clear</md-icon>
			</md-button>

			<div class="color-block">
			</div>

			<div class="content">
				<div class="content-header">
					<h2 class="title">{{location.name}}</h2>
					<div class="edit-buttons">
						<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="openDialog('newLocationDialog')">
							<md-icon>edit</md-icon>
							<md-tooltip md-direction="bottom">Edit this event</md-tooltip>	
						</md-button>
						<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="deleteLocation">
							<md-icon>delete</md-icon>
							<md-tooltip md-direction="bottom">delete this event</md-tooltip>
						</md-button>
					</div>
				</div>

				<div class="content-body">
					<div v-if="location.address">
						<h3><md-icon>directions</md-icon>Address</h3>
						<p>{{location.address.street}}</p>
						<p>{{location.address.postcode}} {{location.address.city}}</p>
						<p>{{location.address.administrative}}</p>
						<p>{{location.address.country}}</p>
					</div>

					<hr v-if="location.website || location.facebook_page_url">

					<h3 v-if="location.website || location.facebook_page_url"><md-icon>subject</md-icon>Additional Information</h3>
					<p v-if="location.website" class="website">Website: <a :href="location.website">{{location.website}}</a></p>
					<p v-if="location.facebook_page_url" class="facebook-page">Facebook Page: <a :href="location.facebook_page_url">{{location.facebook_page_url}}</a></p>

					<hr v-if="location.information">

					<h3 v-if="location.information"><md-icon>format_quote</md-icon>Description</h3>
					<p>{{location.information}}</p>

					<div class="events" v-if="locationEvents">
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
			</div>
		</div>

		<md-dialog ref="singleEventDialog" class="content-dialog">
			<event-page v-on:close="$refs.singleEventDialog.close()"></event-page>
		</md-dialog>

		<md-dialog ref="newLocationDialog" class="content-dialog">
			<new-location v-on:close="handleEditClose" :edit="true"></new-location>
		</md-dialog>

		<md-snackbar ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import moment from 'moment';
import { backendUrl } from '@/secrets.js';
import EventPage from '@/Components/SingleContentPages/EventPage';
import NewLocation from '@/Components/NewContent/NewLocation';

export default {
	name: 'location-page',
	components: {
		EventPage,
		NewLocation
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
			eventLimiter: 3
		}
	},
	watch: {
		location() {
			this.$http.get(backendUrl + '/api/locations/events/' + this.location._id)
			.then(response => {
				this.locationEvents = response.body.data;
				if(this.locationEvents) {
					for(let event of this.locationEvents) {
						event.formattedDate = moment(event.startDate).format('LL');
						event.formattedTime = moment(event.startDate).format('HH:mm');
					}
				}

				this.eventLimiter = this.locationEvents.length>=3 ?3 :this.locationEvents.length;
			})
			.catch(err => {})
		}
	},
	methods: {
		emitClose() {
			this.$emit('close');
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		//Function for giving the Single-Event dialog the data of the clicked event and opening it.
		showEvent(event) {
			this.$store.commit('setCurrentEvent', event);
			this.$refs.singleEventDialog.open();
		},
		deleteLocation() {
			this.$http.delete(backendUrl + '/api/locations/' + this.location._id, {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
				.then(response => {
					this.emitClose();
					this.submitStatus = 'Location successfully deleted!';
					this.$refs.snackbar.open();
				})
				.catch(err => {
					this.submitStatus = 'Error while deleting the location. Please try again!';
					this.$refs.snackbar.open();
				})
		},
		handleEditClose() {
			this.$refs['newLocationDialog'].close();
			this.emitClose();
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => {});
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_locationPage.scss";
</style>
