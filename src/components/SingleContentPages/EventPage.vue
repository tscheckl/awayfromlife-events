<template>
	<div id="event_page">
		<div class="page-header">

			<div class="left-container">

				<div class="edit-buttons">
					<md-button class="md-icon-button edit-button" v-on:click="openDialog('editEventDialog')">
						<md-icon>edit</md-icon>
						<md-tooltip md-direction="bottom">edit event</md-tooltip>	
					</md-button>
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="openDialog('confirmDeletionDialog')">
						<md-icon>delete</md-icon>
						<md-tooltip md-direction="bottom">delete event</md-tooltip>
					</md-button>
					<md-button class="md-icon-button edit-button" v-if="event.canceled != 2" v-on:click="openDialog('cancelDialog')">
						<md-icon>event_busy</md-icon>
						<md-tooltip md-direction="bottom">report event as cancelled</md-tooltip>
					</md-button>
					<md-button class="md-icon-button edit-button" v-on:click="openDialog('reportDialog')">
						<md-icon>report</md-icon>
						<md-tooltip md-direction="bottom">report event</md-tooltip>
					</md-button>
				</div>
			</div>
		</div>

		<div class="content" v-if="event._id">
			<h1 v-if="event.canceled == 2" class="cancelled-info">
				<md-icon>warning</md-icon>
				<span>THIS EVENT WAS CANCELLED</span>
				<md-icon>warning</md-icon>
			</h1>

			<h3 v-if="event.canceled == 1 && $route.path.indexOf('/event/') != -1" class="unverified-cancelled-info">
				<md-icon>warning</md-icon>
				This event was reported as cancelled but the report is not verified yet! 
			</h3>

			<div class="title">
				<h2>{{event.name?event.name.toUpperCase(): ''}}</h2>
				<h4 class="date">{{event.formattedDate}}</h4>
			</div>

			<div class="content-body">
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
					<a :href="event.ticketLink" target="_blank">{{event.ticketLink}}</a>
					<hr>
				</div>

				<div v-if="event.description">
					<h3><md-icon>format_quote</md-icon><span>Description</span></h3>
					<p>{{event.description}}</p>
				</div>

				<div class="loading" v-show="loading">
					<div class="darken"></div>
					<md-spinner md-indeterminate class="md-accent"></md-spinner>
				</div>
			</div>
		</div>

		<div class="color-block"></div>

		<md-dialog ref="editEventDialog">
			<event-form :event="JSON.parse(JSON.stringify(event))" canSubmit v-on:submit="updateEvent" v-on:close="$refs.editEventDialog.close()">
				<h1 slot="headline">Edit Event</h1>
			</event-form>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>

		<md-dialog ref="reportDialog">
			<report-dialog :id="event._id" :contentType="backendEndpoint.slice(0,-1)" v-on:close="message => handleDialogClose(message, 'reportDialog')"></report-dialog>
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

		<md-dialog ref="confirmDeletionDialog">
			<confirm-dialog v-on:confirm="deleteEvent" v-on:close="$refs.confirmDeletionDialog.close()">
				<h3 slot="headline">Do you really want to delete this event?</h3>
			</confirm-dialog>
		</md-dialog>
	</div>
</template>

<script>
import { removeEmptyObjectFields, addBandLabels } from '@/helpers/array-object-helpers.js';

import EventForm from '@/components/ContentForms/EventForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import ReportDialog from '@/components/SingleContentPages/ReportDialog';
import NotFound from '@/components/NotFound';

import {frontEndSecret, backendUrl } from '@/secrets.js';
import moment from 'moment';

export default {
	name: 'event-page-new',
	components: {
		EventForm,
		ReportDialog,
		NotFound,
		ConfirmDialog
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
		deleteEvent() {
			this.$refs.confirmDeletionDialog.close();
			
			this.$http.delete(backendUrl + `/api/${this.backendEndpoint}/` + this.event._id)
				.then(response => {
					this.$router.go(-1);
				})
				.catch(err => {
					this.submitStatus = 'Error while deleting the event. Please try again!';
					this.$refs.snackbar.open();
				})
		},
		updateEvent(data) {
			this.$refs.editEventDialog.close();

			this.loading = true;

			removeEmptyObjectFields(data);

			this.$http.put(backendUrl + `/api/events/${data._id}`, data)
				.then(response => {
					this.getCurrentEvent('Event successfully updated!');
				})
				.catch(err =>  {
					this.submitStatus = err;
					this.$refs.snackbar.open();
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
							this.$refs.snackbar.open();
						}

						this.$store.commit('setCurrentEvent', response.body.data);
						addBandLabels(this.event);
						this.$router.push({path: `/event/${response.body.data.url}`});
					}
				})
				.catch(err => {
					this.loading = false;

					this.submitStatus = err;
					this.$refs.snackbar.open();
				});
		},
		handleDialogClose(message, dialogRef) {
			this.$refs[dialogRef].close();
			this.submitStatus = message;
			this.$refs.snackbar.open();
		},
		reportCancel(accept) {
			document.getElementsByClassName(accept ?'yes' :'no')[0].classList.add('selected');
			document.getElementsByClassName(accept ?'yes-icon' :'no-icon')[0].classList.add('selected');
			setTimeout(() => {
				if(accept) {
					this.$http.put(backendUrl + `/api/${this.backendEndpoint}/cancel/${this.event._id}`)
					.then(response => {
						console.log(response);
						this.handleDialogClose('Thanks for your report, we will verify it before it is visible for everyone!', 'cancelDialog');
					})
					.catch(err => {this.handleDialogClose('Something went wrong while sending your report. Please try again!', 'cancelDialog')})
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
			.catch(err => {});
			
		if(this.$store.getters.currentEvent.name == '' || this.$store.getters.currentEvent.url != this.$route.params.url) {

			this.$http.get(backendUrl + `/api/${this.backendEndpoint}/byurl/` + this.$route.params.url)
			.then(response => {
				if(response.body.data) {
					this.$store.commit('setCurrentEvent', response.body.data);
				}
			})
			.catch(err => this.$router.push('/not-found'));
		}
		
			
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_eventPage.scss";
</style>