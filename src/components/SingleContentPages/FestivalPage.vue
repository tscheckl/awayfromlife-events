<template>
	<div id="festival_page">
		<detail-page
			contentType="festival"
			:id="festival._id"
			:loading="loading"
			:submitStatus="submitStatus"
			v-on:edit="openDialog('editFestivalDialog')">
			<h2 slot="title" class="title" v-if="festival.name">{{festival.name.toUpperCase()}}</h2>

			<div v-if="festival._id">
				<span class="festival-genres" v-if="festival.genre.length > 0">
					<h3><md-icon>library_music</md-icon>Genre</h3>
					<p><span class="festival-genre" v-for="genre in festival.genre" :key="genre">{{genre}}</span></p>
				</span>

				<hr>

				<div v-if="festival.address" class="festival-location">
					<h3><md-icon>location_on</md-icon><span>Address</span></h3>
					<p>{{festival.address.street}}</p>
					<p>{{festival.address.postcode}} {{festival.address.city}}</p>
					<p v-if="festival.address.county">{{festival.address.county}}</p>
					<p>{{festival.address.country}}</p>

					<hr>
				</div>

				<h3 v-if="festival.events.length > 0"><md-icon>timeline</md-icon><span>Festival History</span></h3>

				<stepper
					class="festivals-stepper"
					v-if="festival.events.length > 0"
					:steps="festival.events.length"
					infinite
					:showHeader="false"
					:selectableSteps="festival.events"
					selectionLabel="Select Year">
					
					<div class="color-block"></div>
					<div class="festival-instance" v-for="(festivalEvent, index) in festival.events" :key="index" :slot="'step-' + (index+1)">
						<div class="edit-buttons">
							<md-button class="md-icon-button edit-button" v-on:click="editFestivalEvent(festivalEvent)">
								<md-icon>edit</md-icon>
								<md-tooltip md-direction="bottom">edit festival event</md-tooltip>	
							</md-button>

							<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="confirmDeletion('event', festivalEvent)">
								<md-icon>delete</md-icon>
								<md-tooltip md-direction="bottom">delete festival event</md-tooltip>
							</md-button>
						</div>

						<h1>{{festivalEvent.name}}</h1>
						<h4>{{formatDate(festivalEvent.startDate)}} - {{formatDate(festivalEvent.endDate)}}</h4>
						<div class="line-up">
							<h3><md-icon>queue_music</md-icon><span>Lineup:</span></h3>
							<ul>
								<li v-for="(band, index) in festivalEvent.bands" :key="index"><router-link :to="`/band/${band.url}`"><span>{{band.name}}</span></router-link></li>
							</ul>
						</div>
					</div>
				</stepper>

				<hr>

				<div v-if="festival.ticketLink" class="ticket-link">
					<h3><md-icon>receipt</md-icon>Ticket Link</h3>
					<a :href="festival.ticketLink" target="_blank">{{festival.ticketLink}}</a>
					<hr>
				</div>

				<div v-if="festival.description">
					<h3><md-icon>format_quote</md-icon><span>Description</span></h3>
					<p>{{festival.description}}</p>
					<hr>
				</div>

				<div class="additional-info" v-if="festival.website || festival.facebookUrl">
					<h3><md-icon>subject</md-icon>Additional Information</h3>
					<p v-if="festival.website" class="website"><span>Website:</span> <a :href="festival.website" target="_blank">{{festival.website}}</a></p>
					<p v-if="festival.facebookUrl" class="facebook-page"><span>Facebook Page:</span> <a :href="festival.facebookUrl" target="_blank">{{festival.facebookUrl}}</a></p>
					<hr>
				</div>
			</div>

			<div slot="edit-dialogs">
				<md-dialog ref="confirmDeletionDialog">
					<confirm-dialog v-on:confirm="deleteFestivalEvent" v-on:close="$refs.confirmDeletionDialog.close()">
						<h3 slot="headline">Do you really want to delete this festival event?</h3>
						<h4 v-if="onlyFestivalEvent" class="warning" slot="warning">
							<md-icon>warning</md-icon>
							Warning: This is the only event of this festival. If you delete this event, the whole festival will be deleted!
						</h4>
					</confirm-dialog>
				</md-dialog>

				<md-dialog ref="editFestivalDialog">
					<festival-form :data="JSON.parse(JSON.stringify(festival))" canSubmit v-on:submit="updateFestival" v-on:close="$refs.editFestivalDialog.close()">
						<h1 slot="headline">Edit Festival</h1>
					</festival-form>
				</md-dialog>

				<md-dialog ref="editFestivalEventDialog">
					<festival-event-form :data="currentFestivalEvent" canSubmit v-on:submit="updateFestivalEvent" v-on:close="$refs.editFestivalEventDialog.close()">
						<h1 slot="headline">Edit Festival Event</h1>
					</festival-event-form>
				</md-dialog>
			</div>
		</detail-page>
	</div>
</template>

<script>
import Stepper from '@/components/Utilities/Stepper';
import ConfirmDialog from '@/components/Utilities/ConfirmDialog';
import FestivalForm from '@/components/ContentForms/FestivalForm';
import FestivalEventForm from '@/components/ContentForms/FestivalEventForm';
import DetailPage from '@/components/SingleContentPages/DetailPage';

import {frontEndSecret, backendUrl } from '@/secrets.js';
import { removeEmptyObjectFields, addBandLabels } from '@/helpers/array-object-helpers.js';

import moment from 'moment';

export default {
	name: 'festival-page',
	components: {
		Stepper,
		ConfirmDialog,
		FestivalForm,
		FestivalEventForm,
		DetailPage
	},
	watch: {
		$route() {
			if(this.$route.params.url != this.festival.url)
				this.getFestivalByUrl();
		}
	},
	computed: {
		festival() {
			return JSON.parse(JSON.stringify(this.$store.getters.currentFestival));
		},
		selectableSteps() {
			let selectableSteps = [];

			this.festival.events.forEach(festivalEvent => {
				selectableSteps.push(moment(festivalEvent.startDate).format('YYYY'));
			});

			return selectableSteps;
		}
	},
	data() {
		return {
			isAuthenticated: false,
			loading: false,
			submitStatus: '',
			currentFestivalEvent: {},
			onlyFestivalEvent: false
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		confirmDeletion(contentType, data = undefined) {
			if(data) this.currentFestivalEvent = JSON.parse(JSON.stringify(data));		
			this.openDialog('confirmDeletionDialog');
		},
		formatDate(date) {
			return moment(date).format('LL');
		},
		editFestivalEvent(event) {
			this.currentFestivalEvent = JSON.parse(JSON.stringify(event));
			this.openDialog('editFestivalEventDialog');
		},
		getCurrentFestival(message = '') {
			this.loading = true;

			this.$http.get(backendUrl + `/api/festivals/byid/` + this.festival._id)
				.then(response => {
					this.loading = false;
					if(response.body.data) {
						if(message != '') {
							this.submitStatus = message;
							this.$children[0].$refs.snackbar.open();
						}

						this.$store.commit('setCurrentFestival', response.body.data);
						this.festival.events.forEach(event => {
							addBandLabels(event);
						});

						if(this.festival.events.length == 1)
							this.onlyFestivalEvent = true;

						this.$router.push({path: `/festival/${response.body.data.url}`});
					}
				})
				.catch(err => {
					this.loading = false;
					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		deleteFestivalEvent() {			
			this.$refs.confirmDeletionDialog.close();
			
			this.loading = true;

			this.$http.delete(backendUrl + `/api/festival-events/` + this.currentFestivalEvent._id)
				.then(response => {
					if(!this.onlyFestivalEvent)
						this.getCurrentFestival('Festival event successfully deleted!');
					else
						this.$router.go(-1);
				})
				.catch(err => {
					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		updateFestival(data) {
			this.$refs['editFestivalDialog'].close();
			
			this.loading = true;
			
			removeEmptyObjectFields(data);
			
			this.$http.put(backendUrl + `/api/festivals/${data._id}`, data)
				.then(response => {
					this.getCurrentFestival('Festival successfully updated!');
				})
				.catch(err =>  {
					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		updateFestivalEvent(data) {
			this.$refs['editFestivalEventDialog'].close();
			
			this.loading = true;
			
			removeEmptyObjectFields(data);
			
			this.$http.put(backendUrl + `/api/festival-events/${data._id}`, data)
				.then(response => {
					this.getCurrentFestival('Event successfully updated!');
				})
				.catch(err =>  {
					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		getFestivalByUrl() {
			this.loading = true;

			this.$http.get(backendUrl + `/api/festivals/byurl/` + this.$route.params.url)
			.then(response => {
				if(response.body.data) {
					this.loading = false;
					this.$store.commit('setCurrentFestival', response.body.data);					

					this.festival.events.forEach(event => {
						addBandLabels(event);
					});

					if(this.festival.events.length == 1)
						this.onlyFestivalEvent = true;
				}
			})
			.catch(err => this.$router.push('/not-found'));
		}
	},
	mounted() {
		if(this.$route.path.indexOf('festival') != -1)
			document.getElementById('topbar').classList.add('single-page');
		
		
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => console.log(err));
			
		if(this.$store.getters.currentFestival.name == '' || this.$store.getters.currentFestival.url != this.$route.params.url) {
			this.loading = true;
			this.getFestivalByUrl();
		}
		else {
			this.festival.events.forEach(event => {
				addBandLabels(event);
			});

			if(this.festival.events.length == 1)
				this.onlyFestivalEvent = true;
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_festivalPage.scss";
</style>
