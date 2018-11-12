<template>
	<div id="event_page">
		<detail-page
			contentType="event"
			:id="event._id"
			:loading="loading"
			:submitStatus="submitStatus"
			v-on:edit="openDialog('editEventDialog')">
			<md-button slot="additonal-edit-buttons" class="md-icon-button edit-button" v-if="event.canceled != 2" v-on:click="openDialog('cancelDialog')">
				<md-icon>event_busy</md-icon>
				<md-tooltip md-direction="bottom">report event as cancelled</md-tooltip>
			</md-button>

			<div slot="important-information">
				<h1 v-if="event.canceled == 2" class="cancelled-info">
					<md-icon>warning</md-icon>
					<span>THIS EVENT WAS CANCELLED</span>
					<md-icon>warning</md-icon>
				</h1>

				<h3 v-if="event.canceled == 1 && $route.path.indexOf('/event/') != -1" class="unverified-cancelled-info">
					<md-icon>warning</md-icon>
					This event was reported as cancelled but the report is not verified yet! 
				</h3>
			</div>

			<div slot="title" class="title" v-if="event.name && event.formattedDate">
				<h2>{{event.name.toUpperCase()}}</h2>
				<h4 class="date">{{event.formattedDate}}</h4>
			</div>

			<div v-if="event._id">
				<div v-if="event.location.address" class="event-location">
					<h3><md-icon>location_on</md-icon><span>Location</span></h3>
					<p><b>{{event.location.name}}</b></p>
					<p>{{event.location.address.street}}</p>
					<p>{{event.location.address.postcode}} {{event.location.address.city}}</p>
					<p v-if="event.location.address.county">{{event.location.address.county}}</p>
					<p>{{event.location.address.country}}</p>
				</div>

				<hr>

				<h3><md-icon>queue_music</md-icon><span>Lineup</span></h3>
				<ul>
					<li v-for="band of event.bands" :key="band._id"><router-link :to="`/band/${band.url}`"><span>{{band.name}}</span></router-link></li>
				</ul>
				
				<hr>

				<div v-if="event.ticketLink" class="ticket-link">
					<h3><md-icon>receipt</md-icon>Ticket Link</h3>
					<a :href="'//' + event.ticketLink" target="_blank">{{event.ticketLink}}</a>
					<hr>
				</div>

				<div v-if="event.description">
					<h3><md-icon>format_quote</md-icon><span>Description</span></h3>
					<p>{{event.description}}</p>
				</div>
			</div>
			
			<div slot="edit-dialogs">
				<md-dialog ref="editEventDialog">
					<event-form :event="JSON.parse(JSON.stringify(event))" canSubmit v-on:submit="updateEvent" v-on:close="$refs.editEventDialog.close()">
						<h1 slot="headline">Edit Event</h1>
					</event-form>
				</md-dialog>

				<md-dialog ref="cancelDialog">
					<div class="cancel-dialog">
						<h2>Do you really want to report this event as cancelled?</h2>
						<md-icon class="yes-icon">check</md-icon>
						<md-icon class="no-icon">clear</md-icon>
						<md-button class="yes" v-on:click="reportCancel(true)">Yes</md-button>
						<md-button class="no" v-on:click="reportCancel(false)">No</md-button>
					</div>
				</md-dialog>
			</div>
		</detail-page>
	</div>
</template>

<script>
import { removeEmptyObjectFields, addBandLabels } from '@/helpers/array-object-helpers.js';

import EventForm from '@/components/ContentForms/EventForm';
import DetailPage from '@/components/SingleContentPages/DetailPage';

import {frontEndSecret, backendUrl } from '@/secrets.js';
import moment from 'moment';

export default {
	name: 'event-page-new',
	components: {
		EventForm,
		DetailPage
	},
	watch: {
		$route() {
			if(this.$route.params.url != this.event.url)
				this.getEventByUrl();
		}
	},
	computed: {
		event() {
			return JSON.parse(JSON.stringify(this.$store.getters.currentEvent));
		}
	},
	data() {
		return {
			submitStatus: '',
			isAuthenticated: false,
			backendEndpoint: 'events',
			loading: false
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		updateEvent(data) {
			this.$refs.editEventDialog.close();
		
			this.loading = true;

			removeEmptyObjectFields(data);
			data.date = moment(data.date).format('YYYY-MM-DD');

			this.$http.put(backendUrl + `/api/events/${data._id}`, data)
				.then(response => {
					this.getCurrentEvent('Event successfully updated!');
				})
				.catch(err =>  {
					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		getCurrentEvent(message = '') {
			this.loading = true;

			this.$http.get(backendUrl + `/api/events/byid/` + this.event._id)
				.then(response => {
					this.loading = false;
					if(response.body.data) {
						if(message != '') {
							this.submitStatus = message;
							this.$children[0].$refs.snackbar.open();
						}

						this.$store.commit('setCurrentEvent', response.body.data);
						addBandLabels(this.event);
						this.$router.push({path: `/event/${response.body.data.url}`});
						document.title = `${this.event.name}, ${moment(this.event.date).format('DD.MM.YYYY')}, ${this.event.location.name} | AWAY FROM LIFE STREETS`;
					}
				})
				.catch(err => {
					this.loading = false;
					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		reportCancel(accept) {
			document.getElementsByClassName(accept ?'yes' :'no')[0].classList.add('selected');
			document.getElementsByClassName(accept ?'yes-icon' :'no-icon')[0].classList.add('selected');
			setTimeout(() => {
				if(accept) {
					this.$http.put(backendUrl + `/api/${this.backendEndpoint}/cancel/${this.event._id}`)
					.then(response => {
						this.$refs.cancelDialog.close();
						this.submitStatus = 'Thanks for your report, we will verify it before it is visible for everyone!';
						this.$children[0].$refs.snackbar.open();
					})
					.catch(err => {
						this.$refs.cancelDialog.close();
						this.submitStatus = err.body.message;
						this.$children[0].$refs.snackbar.open();
					})
				}

				this.similarEventFound = false;
				setTimeout(() => {
					this.$refs.cancelDialog.close();
					setTimeout(() => {
						document.getElementsByClassName(accept ?'yes' :'no')[0].classList.remove('selected');
						document.getElementsByClassName(accept ?'yes-icon' :'no-icon')[0].classList.remove('selected');
					}, 200);
				},200);
			}, 500);
		},
		getEventByUrl() {
			this.loading = true;

			this.$http.get(backendUrl + `/api/${this.backendEndpoint}/byurl/` + this.$route.params.url)
			.then(response => {
				if(response.body.data) {
					this.loading = false;
					this.$store.commit('setCurrentEvent', response.body.data);
					document.title = `${this.event.name}, ${moment(this.event.date).format('DD.MM.YYYY')}, ${this.event.location.name} | AWAY FROM LIFE STREETS`;
				}
			})
			.catch(err => this.$router.push('/not-found'));
		}
	},
	mounted() {
		if(this.$route.path.indexOf('archived-event') != -1 || this.$route.path.indexOf('event') != -1)
			document.getElementById('topbar').classList.add('single-page');
		
		if(this.$route.path.indexOf('archived-event') != -1) {
			this.backendEndpoint = 'archived-events';
		}
		
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => console.log(err));
			
		if(this.$store.getters.currentEvent.name == '' || (this.$store.getters.currentEvent.url != this.$route.params.url && this.$route.path == '/event'))
			this.getEventByUrl();
		else
			document.title = `${this.event.name}, ${moment(this.event.date).format('DD.MM.YYYY')}, ${this.event.location.name} | AWAY FROM LIFE STREETS`;
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_eventPage.scss";
</style>