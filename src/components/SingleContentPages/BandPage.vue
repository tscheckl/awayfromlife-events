<template>
	<div id="band_page">
		<div class="page-container">
			<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
				<md-icon>clear</md-icon>
			</md-button>

			<div class="color-block">
			</div>

			<div class="content">
				<div class="content-header">
					<h2 class="title">{{band.name?band.name.toUpperCase(): ''}}</h2>
					<div class="edit-buttons">
						<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="openDialog('newBandDialog')">
							<md-icon>edit</md-icon>
							<md-tooltip md-direction="bottom">Edit this event</md-tooltip>	
						</md-button>
						<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="deleteBand">
							<md-icon>delete</md-icon>
							<md-tooltip md-direction="bottom">delete this event</md-tooltip>
						</md-button>
					</div>
				</div>

				<div class="content-body">
					<h3><md-icon>info_outline</md-icon>General Information</h3>
					<p><span>Genre: </span>{{band.genre}}</p>
					<p v-if="band.recordLabel"><span>Label: </span>{{band.recordLabel}}</p>
					
					<hr>

					<h3><md-icon>timeline</md-icon>History and Origin</h3>
					<p v-if="band.foundingDate"><span>Founded: </span>{{band.foundingDate}}</p>
					<p v-if="band.origin"><span>Origin: </span> {{band.origin.value}}</p>
					<p v-if="band.history" class="band-history"><span>History / Band description: <br></span> {{band.history}}</p>

					<div class="releases" v-if="band.releases.length > 0 && band.releases[0].releaseName != ''">
						<hr>

						<h3><md-icon>album</md-icon>Releases</h3>
						<ul>
							<li v-for="release in band.releases" :key="release.releaseName">{{release.releaseName}} - {{release.releaseYear}}</li>
						</ul>
					</div>

					<hr v-if="band.facebookUrl || band.website || band.bandcampUrl || band.soundclouldUrl">

					<h3 v-if="band.facebookUrl || band.website || band.bandcampUrl || band.soundclouldUrl"><md-icon>subject</md-icon>Additional Information</h3>
					<p v-if="band.facebookUrl"><span>Facebook Page: </span><a :href="band.facebookUrl">{{band.facebookUrl}}</a></p>
					<p v-if="band.website"><span>Website: </span><a :href="band.website">{{band.website}}</a></p>
					<p v-if="band.bandcampUrl"><span>Bandcamp Page: </span><a :href="band.bandcampUrl">{{band.bandcampUrl}}</a></p>
					<p v-if="band.soundclouldUrl"><span>Soundcloud Page: </span><a :href="band.soundclouldUrl">{{band.soundclouldUrl}}</a></p>

					<div class="events" v-if="bandEvents.length > 0">
						<h3><md-icon>date_range</md-icon>Next Shows:</h3>
						<div class="event" v-for="index in eventLimiter" :key="index" v-on:click="showEvent(bandEvents[index-1])">
							<div class="event-information">
								<p>{{bandEvents[index-1].title}}</p>
								<p>{{bandEvents[index-1].formattedDate}}, {{bandEvents[index-1].formattedTime}}</p>
								<p>Lineup: <span v-for="band in bandEvents[index-1].bands" :key="band._id" class="event-band">{{band.name}}</span></p>
							</div>
							<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
						</div>
						<p class="more-events-btn" v-if="eventLimiter!=bandEvents.length" @click="eventLimiter=bandEvents.length">More Events<md-icon>keyboard_arrow_down</md-icon></p>
					</div>
				</div>

				<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>
			</div>
		</div>

		<md-dialog ref="singleEventDialog" class="content-dialog">
			<event-page :data="showEventData" v-on:close="$refs.singleEventDialog.close()"></event-page>
		</md-dialog>

		<md-dialog ref="newBandDialog" class="content-dialog">
			<new-band v-on:close="handleEditClose" :edit="true"></new-band>
		</md-dialog>

		<md-snackbar ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import { backendUrl } from '@/secrets.js';
import moment from 'moment';
import EventPage from '@/Components/SingleContentPages/EventPage';
import NewBand from '@/Components/NewContent/NewBand';

export default {
	name: 'band-page',
	components: {
		EventPage,
		NewBand
	},
	computed: {
		band() {
			return Object.assign({},this.$store.getters.currentBand);
		}
	},
	data() {
		return {
			bandEvents: [],
			showEventData: {},
			submitStatus: '',
			isAuthenticated: false,
			eventLimiter: 3,
			loading: false
		}
	},
	watch: {
		band() {
			this.loading = true;

			this.$http.get(backendUrl + '/api/bands/events/' + this.band._id)
			.then(response => {
				
				if(!response.body.message) {
					this.bandEvents = response.body.data;
					if(this.bandEvents) {
						for(let event of this.bandEvents) {
							event.formattedDate = moment(event.startDate).format('LL');
							event.formattedTime = moment(event.startDate).format('HH:mm');
						}
					}

					this.eventLimiter = this.bandEvents.length>=3 ?3 :this.bandEvents.length;
				}
				else {
					this.bandEvents = [];
				}
				this.loading = false;
			})
			.catch(err => {
				this.bandEvents = [];
				this.loading = false;
			});
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
		deleteBand() {
			this.$http.delete(backendUrl + '/api/bands/' + this.band._id, {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
				.then(response => {
					this.emitClose();
					this.submitStatus = 'Band successfully deleted!';
					this.$refs.snackbar.open();
				})
				.catch(err => {
					this.submitStatus = 'Error while deleting the band. Please try again!';
					this.$refs.snackbar.open();
				})
		},
		handleEditClose() {
			this.$refs['newBandDialog'].close();
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
	@import "src/scss/SingleContentPages/_bandPage.scss";
</style>
