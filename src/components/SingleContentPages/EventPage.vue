<template>
	<div id="event_page">
		<div class="page-header">

			<div class="left-container">

				<div class="edit-buttons">
					<md-button class="md-icon-button edit-button" v-on:click="openDialog('newEventDialog')">
						<md-icon>edit</md-icon>
						<md-tooltip md-direction="bottom">edit event</md-tooltip>	
					</md-button>
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="deleteEvent">
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
					<!-- <md-menu md-direction="bottom left" md-size="5">
						<md-button class="md-icon-button edit-button more-button" md-menu-trigger>
							<md-icon>more_vert</md-icon>
						</md-button>

						<md-menu-content>
							<md-menu-item>Report this event as cancelled</md-menu-item>
							<md-menu-item>Report event</md-menu-item>
						</md-menu-content>
					</md-menu> -->
				</div>
			</div>
		</div>

		<div class="content">
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
				<h2>{{event.title?event.title.toUpperCase(): ''}}</h2>
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

				<h3 class="start-time"><md-icon>alarm</md-icon><span>Start</span></h3><span>{{event.formattedTime}} Uhr</span>

				<hr>

				<h3><md-icon>queue_music</md-icon><span>Lineup</span></h3>
				<ul>
					<li v-for="band of event.bands" :key="band._id"><router-link :to="`/band/${band._id}`"><span>{{band.name}}</span></router-link></li>
				</ul>
				
				<hr>

				<div v-if="event.description">
					<h3><md-icon>format_quote</md-icon><span>Description</span></h3>
					<p>{{event.description}}</p>
				</div>
			</div>
		</div>

		<div class="color-block"></div>

		<md-dialog ref="newEventDialog">
			<new-event v-on:close="handleEditClose" :edit="true"></new-event>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>

		<md-dialog ref="reportDialog">
			<report-dialog :contentType="backendEndpoint.slice(0,-1)" v-on:close="message => handleDialogClose(message, 'reportDialog')"></report-dialog>
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
</template>

<script>
import NewEvent from '@/components/NewContent/NewEvent';
import ReportDialog from '@/components/SingleContentPages/ReportDialog';

import {frontEndSecret, backendUrl } from '@/secrets.js';
import moment from 'moment';

export default {
	name: 'event-page-new',
	components: {
		NewEvent,
		ReportDialog
	},
	computed: {
		event() {
			return Object.assign({},this.$store.getters.currentEvent);
		}
	},
	data() {
		return {
			submitStatus: '',
			isAuthenticated: false,
			backendEndpoint: 'events'
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		deleteEvent() {
			this.$http.delete(backendUrl + `/api/${this.backendEndpoint}/` + this.event._id)
				.then(response => {
					this.$router.go(-1);
				})
				.catch(err => {
					this.submitStatus = 'Error while deleting the event. Please try again!';
					this.$refs.snackbar.open();
				})
		},
		handleEditClose() {
			this.$refs['newEventDialog'].close();
			
			this.$http.get(backendUrl + `/api/${this.backendEndpoint}/byId/` + this.$route.params.id)
			.then(response => {
				if(response.body.data) {
					this.submitStatus = 'Event successfully updated!';
					this.$refs.snackbar.open();
					this.$store.commit('setCurrentEvent', response.body.data);
				}
			})
			.catch(err => {
				console.log(err);
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
			
		if(this.$store.getters.currentEvent.title == '' || this.$store.getters.currentEvent._id != this.$route.params.id) {

			this.$http.get(backendUrl + `/api/${this.backendEndpoint}/byId/` + this.$route.params.id)
			.then(response => {
				if(response.body.data) {
					this.$store.commit('setCurrentEvent', response.body.data);
				}
			})
			.catch(err => { console.log(err); });
		}
			
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_eventPage.scss";
</style>