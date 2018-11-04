<template>
	<div id="location_page">
		<detail-page
			contentType="location"
			:id="location._id"
			:loading="loading"
			:submitStatus="submitStatus"
			v-on:edit="openDialog('editLocationDialog')">

			<h2 slot="title" class="title" v-if="location.name">{{location.name.toUpperCase()}}</h2>

			<div v-if="location._id">
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
							<p>{{locationEvents[index-1].name}}</p>
							<p>{{locationEvents[index-1].formattedDate}}, {{locationEvents[index-1].formattedTime}}</p>
							<p>Lineup: <span v-for="band in locationEvents[index-1].bands" :key="band._id" class="event-band">{{band.name}}</span></p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</div>
					<p class="more-events-btn" v-if="eventLimiter!=locationEvents.length" @click="eventLimiter=locationEvents.length">More Events<md-icon>keyboard_arrow_down</md-icon></p>
				</div>
			</div>

			<md-dialog ref="editLocationDialog" slot="edit-dialogs">
				<location-form :data="JSON.parse(JSON.stringify(location))" canSubmit v-on:submit="updateLocation" v-on:close="$refs.editLocationDialog.close()">
					<h1 slot="headline">Edit Location</h1>
				</location-form>
			</md-dialog>
		</detail-page>
	</div>
</template>

<script>
import LocationForm from '@/components/ContentForms/LocationForm';
import DetailPage from '@/components/SingleContentPages/DetailPage';

import { backendUrl } from '@/secrets.js';
import { removeEmptyObjectFields } from '@/helpers/array-object-helpers.js';
import moment from 'moment';

export default {
	name: 'location-page',
	components: {
		LocationForm,
		DetailPage
	},
	watch: {
		$route() {
			if(this.$route.params.url != this.location.url)
				this.getLocationByUrl();
		}
	},
	computed: {
		location() {
			return JSON.parse(JSON.stringify(this.$store.getters.currentLocation));
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
		updateLocation(data) {
			this.$refs.editLocationDialog.close();

			this.loading = true;

			removeEmptyObjectFields(data);

			this.$http.put(backendUrl + `/api/locations/${data._id}`, data)
				.then(response => {
					this.getCurrentLocation('Location successfully updated!');
				})
				.catch(err =>  {
					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		getCurrentLocation(message = '') {
			this.loading = true;

			this.$http.get(backendUrl + `/api/locations/byid/` + this.location._id)
				.then(response => {
					this.loading = false;
					if(response.body.data) {
						if(message != '') {
							this.submitStatus = message;
							this.$children[0].$refs.snackbar.open();
						}

						this.$store.commit('setCurrentLocation', response.body.data);
						this.$router.push({path: `/location/${response.body.data.url}`});
					}
				})
				.catch(err => {
					this.loading = false;

					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		getLocationEvents() {
			this.loading = true;
			this.locationEvents = [];

			this.$http.get(backendUrl + '/api/locations/events/' + this.location._id)
			.then(response => {
				if(!response.body.message) {
					this.locationEvents = response.body.data;
					console.log(this.locationEvents);
					
					if(this.locationEvents) {
						for(let event of this.locationEvents) {
							event.formattedDate = moment(event.date).format('LL');
							event.formattedTime = moment(event.date).format('HH:mm');
						}
					}

					this.eventLimiter = this.locationEvents.length>=3 ?3 :this.locationEvents.length;
				}
				this.loading = false;
			})
			.catch(err => {
				console.log(err);
				this.loading = false;
			});
		},
		getLocationByUrl() {
			this.loading = true;

			this.$http.get(backendUrl + '/api/locations/byurl/' + this.$route.params.url)
			.then(response => {
				if(response.body.data) {
					this.loading = false;
					this.$store.commit('setCurrentLocation', response.body.data);
					this.getLocationEvents();
				}
			})
			.catch(err => this.$router.push('/not-found'));
		}
	},
	mounted() {
		document.getElementById('topbar').classList.add('single-page');
		
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => console.log(err));

		if(this.$store.getters.currentLocation.name == ''  || this.$store.getters.currentLocation.url != this.$route.params.url) {		
			this.getLocationByUrl();
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
