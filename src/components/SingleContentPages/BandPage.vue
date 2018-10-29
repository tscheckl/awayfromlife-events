<template>
	<div id="band_page">
		<div class="page-header">

			<div class="left-container">

				<div class="edit-buttons">
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="openDialog('editBandDialog')">
						<md-icon>edit</md-icon>
						<md-tooltip md-direction="bottom">edit band</md-tooltip>	
					</md-button>
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="openDialog('confirmDeletionDialog')">
						<md-icon>delete</md-icon>
						<md-tooltip md-direction="bottom">delete band</md-tooltip>
					</md-button>
					<md-button class="md-icon-button edit-button" v-on:click="openDialog('reportDialog')">
						<md-icon>report</md-icon>
						<md-tooltip md-direction="bottom">report event</md-tooltip>
					</md-button>	
				</div>
			</div>
		</div>

		<div class="content" v-if="band._id">
			<div class="content-header">
				<h2 class="title">{{band.name?band.name.toUpperCase(): ''}}</h2>
			</div>

			<div class="content-body">
				<h3><md-icon>info_outline</md-icon>General Information</h3>
				<p>
					<span>Genre: </span>
					<span class="band-genre" v-for="(genre, index) in band.genre" :key="genre">{{genre + (index == band.genre.length-1 ?'' :', ')}}</span>
				</p>

				<p v-if="band.recordLabel"><span>Label: </span>{{band.recordLabel}}</p>
				
				<hr>

				<h3><md-icon>timeline</md-icon>History and Origin</h3>
				<p v-if="band.foundingDate"><span>Founded: </span>{{band.foundingDate}}</p>
				<p v-if="band.origin"><span>Origin: </span>{{band.origin.city + ', ' + (band.origin.administrative ? (band.origin.administrative + ', ') :'') + band.origin.country}}</p>
				<p v-if="band.history" class="band-history"><span>History / Band description: <br></span> {{band.history}}</p>

				<div class="releases" v-if="band.releases && band.releases.length > 0 && band.releases[0].releaseName != ''">
					<hr>

					<h3><md-icon>album</md-icon>Releases</h3>
					<ul>
						<li v-for="release in band.releases" :key="release.releaseName">{{release.releaseName}} - {{release.releaseYear}}</li>
					</ul>
				</div>

				<hr v-if="band.facebookUrl || band.website || band.bandcampUrl || band.soundclouldUrl">

				<h3 v-if="band.facebookUrl || band.website || band.bandcampUrl || band.soundclouldUrl"><md-icon>subject</md-icon>Additional Information</h3>
				<p v-if="band.facebookUrl"><span>Facebook Page: </span><a :href="band.facebookUrl" target="_blank">{{band.facebookUrl}}</a></p>
				<p v-if="band.website"><span>Website: </span><a :href="band.website" target="_blank">{{band.website}}</a></p>
				<p v-if="band.bandcampUrl"><span>Bandcamp Page: </span><a :href="band.bandcampUrl" target="_blank">{{band.bandcampUrl}}</a></p>
				<p v-if="band.soundclouldUrl"><span>Soundcloud Page: </span><a :href="band.soundclouldUrl" target="_blank">{{band.soundclouldUrl}}</a></p>

				<div class="events" v-if="bandEvents.length > 0">
					<h3><md-icon>date_range</md-icon>Next Shows:</h3>
					<div class="event" v-for="index in eventLimiter" :key="index" v-on:click="showEvent(bandEvents[index-1])">
						<div class="event-information">
							<p>{{bandEvents[index-1].name}}</p>
							<p>{{bandEvents[index-1].formattedDate}}, {{bandEvents[index-1].formattedTime}}</p>
							<p>Lineup: <span v-for="band in bandEvents[index-1].bands" :key="band._id" class="event-band">{{band.name}}</span></p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</div>
					<p class="more-events-btn" v-if="eventLimiter!=bandEvents.length" @click="eventLimiter=bandEvents.length">More Events<md-icon>keyboard_arrow_down</md-icon></p>
				</div>
			</div>

			<div class="loading" v-show="loading">
				<div class="darken"></div>
				<md-spinner md-indeterminate class="md-accent"></md-spinner>
			</div>
		</div>

		<div class="color-block"></div>

		<md-dialog ref="editBandDialog">
			<band-form :data="JSON.parse(JSON.stringify(band))" canSubmit v-on:submit="updateBand" v-on:close="$refs.editBandDialog.close()">
				<h1 slot="headline">Edit Band</h1>
			</band-form>
		</md-dialog>

		<md-dialog ref="reportDialog">
			<report-dialog :id="band._id" contentType="band" v-on:close="message => handleDialogClose(message, 'reportDialog')">
			</report-dialog>
		</md-dialog>

		<md-dialog ref="confirmDeletionDialog">
			<confirm-dialog v-on:confirm="deleteBand" v-on:close="$refs.confirmDeletionDialog.close()">
				<h3 slot="headline">Do you really want to delete this band?</h3>
			</confirm-dialog>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import { removeEmptyObjectFields } from '@/helpers/array-object-helpers.js';

import BandForm from '@/components/ContentForms/BandForm';
import ConfirmDialog from '@/components/Utilities/ConfirmDialog';
import ReportDialog from '@/components/SingleContentPages/ReportDialog';
import NotFound from '@/components/NotFound';

import { backendUrl } from '@/secrets.js';
import moment from 'moment';

export default {
	name: 'band-page',
	components: {
		BandForm,
		ConfirmDialog,
		ReportDialog,
		NotFound
	},
	watch: {
		$route() {
			if(this.$route.params.url != this.band.url)
				this.getBandByUrl();
		}
	},
	computed: {
		band() {
			return JSON.parse(JSON.stringify(this.$store.getters.currentBand));
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
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		//Function for giving the Single-Event dialog the data of the clicked event and opening it.
		showEvent(event) {
			this.$store.commit('setCurrentEvent', event);
			this.$router.push({path: `/event/${event.url}`});
		},
		deleteBand() {
			this.$refs.confirmDeletionDialog.close();

			this.$http.delete(backendUrl + '/api/bands/' + this.band._id)
				.then(response => {
					this.$router.go(-1);
				})
				.catch(err => {
					this.submitStatus = err.body.message;
					this.$refs.snackbar.open();
				})
		},
		updateBand(data) {
			this.$refs.editBandDialog.close();

			this.loading = true;

			removeEmptyObjectFields(data);

			this.$http.put(backendUrl + `/api/bands/${data._id}`, data)
				.then(response => {
					this.getCurrentBand('Band successfully updated!');
				})
				.catch(err =>  {
					this.submitStatus = err.body.message;
					this.$refs.snackbar.open();
				});
		},
		getCurrentBand(message = '') {
			this.loading = true;

			this.$http.get(backendUrl + `/api/bands/byid/` + this.band._id)
				.then(response => {
					this.loading = false;
					if(response.body.data) {
						if(message != '') {
							this.submitStatus = message;
							this.$refs.snackbar.open();
						}

						this.$store.commit('setCurrentBand', response.body.data);
						this.$router.push({path: `/band/${response.body.data.url}`});
					}
				})
				.catch(err => {
					this.loading = false;
					this.submitStatus = err.body.message;
					this.$refs.snackbar.open();
				});
		},
		handleDialogClose(message, dialogRef) {
			this.$refs[dialogRef].close();
			this.submitStatus = message;
			this.$refs.snackbar.open();
		},
		getBandEvents() {
			this.loading = true;
			this.bandEvents = [];

			this.$http.get(backendUrl + '/api/bands/events/' + this.band._id)
			.then(response => {
				if(!response.body.message) {
					this.bandEvents = response.body.data;
					if(this.bandEvents) {
						for(let event of this.bandEvents) {
							event.formattedDate = moment(event.date).format('LL');
							event.formattedTime = moment(event.date).format('HH:mm');
						}
					}

					this.eventLimiter = this.bandEvents.length>=3 ?3 :this.bandEvents.length;
				}
				this.loading = false;
			})
			.catch(err => {
				this.loading = false;
			});
		},
		getBandByUrl() {
			this.loading = true;

			this.$http.get(backendUrl + '/api/bands/byurl/' + this.$route.params.url)
				.then(response => {
					if(response.body.data) {
						this.loading = false;
						this.$store.commit('setCurrentBand', JSON.parse(JSON.stringify(response.body.data)));
						this.getBandEvents();
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

		if(this.$store.getters.currentBand.name == ''  || this.$store.getters.currentBand.url != this.$route.params.url) {
			this.getBandByUrl();
		}
		else {
			this.getBandEvents();
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_bandPage.scss";
</style>
