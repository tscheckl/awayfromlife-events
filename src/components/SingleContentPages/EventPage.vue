<template>
	<div id="event_page">
		<div class="page-header">

			<div class="left-container">

				<div class="edit-buttons">
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="openDialog('newEventDialog')">
						<md-icon>edit</md-icon>
						<md-tooltip md-direction="bottom">Edit this event</md-tooltip>	
					</md-button>
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="deleteEvent">
						<md-icon>delete</md-icon>
						<md-tooltip md-direction="bottom">delete this event</md-tooltip>
					</md-button>
				</div>
			</div>
		</div>

		<div class="content">
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
					<li v-for="band of event.bands" :key="band._id">{{band.name}}</li>
				</ul>
				
				<hr>

				<h3><md-icon>format_quote</md-icon><span>Description</span></h3>
				<p>{{event.description}}
				</p>
			</div>
		</div>

		<div class="color-block"></div>

		<md-dialog ref="newEventDialog">
			<new-event v-on:close="handleEditClose" :edit="true"></new-event>
		</md-dialog>

		<md-snackbar ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import NewEvent from '@/components/NewContent/NewEvent';

import {frontEndSecret, backendUrl } from '@/secrets.js';
import moment from 'moment';

export default {
	name: 'event-page-new',
	components: {
		NewEvent
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
					this.submitStatus = 'Event successfully deleted!';
					this.$refs.snackbar.open();
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
					this.$store.commit('setCurrentEvent', response.body.data);
				}
			})
			.catch(err => {
				console.log(err);
			});
		}
	},
	mounted() {
		document.getElementById('topbar').classList.add('single-page');
		console.log(this.$route.path);
		if(this.$route.path.indexOf('archived-event') != -1) {
			this.backendEndpoint = 'archived-events';
		}
		
		
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => {});
		
		if(this.$store.getters.currentEvent.title == '') {
			console.log("nix da");
			
			this.$http.get(backendUrl + `/api/${this.backendEndpoint}/byId/` + this.$route.params.id)
			.then(response => {
				if(response.body.data) {
					this.$store.commit('setCurrentEvent', response.body.data);
				}
			})
			.catch(err => {
				console.log(err);
			});
		}
			
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_eventPage.scss";
</style>