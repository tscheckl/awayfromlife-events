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
						<h2>{{data.title?data.title.toUpperCase(): ''}}</h2>
						<h4 class="date">{{formattedDate}}</h4>
					</div>
					<div v-if="isAuthenticated" class="edit-buttons">
						<md-button class="md-icon-button" v-on:click="openDialog('new-event-dialog')">
							<md-icon>edit</md-icon>
							<md-tooltip md-direction="bottom">Edit this event</md-tooltip>	
						</md-button>
						<md-button class="md-icon-button" v-on:click="deleteEvent">
							<md-icon>delete</md-icon>
							<md-tooltip md-direction="bottom">delete this event</md-tooltip>
						</md-button>
					</div>
				</div>

				<div class="content-body" v-if="eventLocation.address">
					<h3><md-icon>location_on</md-icon>Location</h3>
					<p>{{eventLocation.name}}</p>
					<p>{{eventLocation.address.street}}</p>
					<p>{{eventLocation.address.postcode}} {{eventLocation.address.city}}</p>
					<p>{{eventLocation.address.country}}</p>

					<hr>

					<h3 class="start-time"><md-icon>alarm</md-icon>Start:</h3><span>{{formattedTime}} Uhr</span>

					<hr>

					<h3><md-icon>queue_music</md-icon>Lineup </h3>
					<ul>
						<li v-for="band in eventBands" :key="band._id" v-cloak>{{band.name}}</li>
					</ul>
					
					<hr>

					<h3><md-icon>format_quote</md-icon>Description</h3>
					<p>{{data.description}}</p>
				</div>
			</div>
		</div>

		<md-dialog ref="new-event-dialog">
			<new-event v-on:close="$refs['new-event-dialog'].close()" :data="data" :selectedBands="eventBands" :selectedLocation="eventLocation"></new-event>
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
	watch: {
		data() {
			console.log("Currently clicked event's data:", this.data);
			this.showBands = false;

			this.eventLocation = {};
			this.$http.get(backendUrl + '/api/locations/byid/' + this.data.location)
				.then (response => {
					this.eventLocation = response.body.data;
					this.eventLocation.label = this.eventLocation.name + ' - ' + this.eventLocation.address.city;
				})
				.catch(err => {});

			this.formattedDate = moment(this.data.startDate).format('LL');
			this.formattedTime = moment(this.data.startDate).format('HH:mm');
		}
	},
	props: {
		data: undefined
	},
	data() {
		return {
			formattedDate: '',
			formattedTime: '',
			eventLocation: {},
			eventBands: [],
			submitStatus: '',
			isAuthenticated: false,
			showBands: false
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
			this.$http.delete(backendUrl + '/api/events/' + this.data._id, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
				.then(response => {
					console.log(response);
					this.emitClose();
					this.submitStatus = 'Event successfully deleted!';
					this.$refs.snackbar.open();
				})
				.catch(err => {
					console.log(err);
					this.submitStatus = 'Error while deleting the event. Please try again!';
					this.$refs.snackbar.open();
				})
		},
		getEventBands() {
			this.eventBands = [];
			if(this.data.bands[0] != '') {
				console.log("pos branch");
				
				for(let i=0; i < this.data.bands.length; i++) {			
					this.$http.get(backendUrl + "/api/bands/byid/" + this.data.bands[i])
						.then(response => {
							console.log("got response: ", response);
							
							this.eventBands[i] = response.body.data;
							this.eventBands[i].label = this.eventBands[i].name + ' - ' + this.eventBands[i].origin.country;
							console.log("current eventBands: ", this.eventBands);
							this.$nextTick();
							this.showBands = true;
							
						})
						.catch(err => {});
				}
			}
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => {});
			console.log("mounted");
			
		this.getEventBands();
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_eventPage.scss";
</style>
