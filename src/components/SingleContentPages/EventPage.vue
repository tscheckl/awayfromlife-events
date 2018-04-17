<template>
	<div id="event_page">
		<div class="page-container">
			<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
				<md-icon>clear</md-icon>
			</md-button>

			<div class="color-block">
			</div>

			<div class="content">
				
				<div class="content-header">
					<div class="title">
						<h2>{{event.title?event.title.toUpperCase(): ''}}</h2>
						<h4 class="date">{{event.formattedDate}}</h4>
					</div>
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="openDialog('newEventDialog')">
						<md-icon>edit</md-icon>
						<md-tooltip md-direction="bottom">Edit this event</md-tooltip>	
					</md-button>
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="deleteEvent">
						<md-icon>delete</md-icon>
						<md-tooltip md-direction="bottom">delete this event</md-tooltip>
					</md-button>
				</div>

				<div class="content-body">
					<div v-if="event.location.address">
						<h3><md-icon>location_on</md-icon>Location</h3>
						<p>{{event.location.name}}</p>
						<p>{{event.location.address.street}}</p>
						<p>{{event.location.address.postcode}} {{event.location.address.city}}</p>
						<p>{{event.location.address.country}}</p>
					</div>

					<hr>

					<h3 class="start-time"><md-icon>alarm</md-icon>Start:</h3><span>{{event.formattedTime}} Uhr</span>

					<hr>

					<h3><md-icon>queue_music</md-icon>Lineup </h3>
					<ul>
						<li v-for="band of event.bands" :key="band._id">{{band.name}}</li>
					</ul>
					
					<hr>

					<h3><md-icon>format_quote</md-icon>Description</h3>
					<p>{{event.description}}</p>
				</div>
			</div>
		</div>

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
	name: 'event-page',
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
		}
	},
	methods: {
		emitClose() {
			this.$emit('close');
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		deleteEvent() {
			this.$http.delete(backendUrl + '/api/events/' + this.event._id, {headers: {'Authorization': 'JWT ' + localStorage.aflAuthToken}})
				.then(response => {
					this.emitClose();
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
	@import "src/scss/SingleContentPages/_eventPage.scss";
</style>
