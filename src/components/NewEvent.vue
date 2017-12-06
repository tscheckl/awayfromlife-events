<template>
  	<div id="new_event">
		<h1 v-on:click="show">New event</h1>

		<event-form :data="newEvent"></event-form>

		<md-button type="submit" v-on:click="addEvent" class="md-raised md-accent">Send</md-button>
		<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		<span class="message" v-if="submitStatus.length >= 1" :class="this.success? 'success': 'error'">{{this.submitStatus}}</span>
  	</div>
</template>

<script>
import moment from 'moment';

import EventForm from './EventForm';

import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'new-event',
	components: {
		EventForm
	},
	data() {
		return {
			newEvent: {
				title: '',
				description: '',
				location: {},
				startDate: {
					time: ''
				},
				endDate: '',
				time: ''
			},
			//Message that will display a status afer sending the new event
			submitStatus: '',
			success: false,
			loading: false,
			//Variable for the api route according to if the user is authenticated or not
			apiRoute: '/api/unvalidated-events'
		}
	},
	methods: {
		show() {
			console.log(this.newEvent);
		},
		addEvent() {
			//Format and set the new Event's date and time attributes from the startTime variable created by the Datepicker
			this.newEvent.startDate = moment(this.newEvent.startDate.time).format('YYYY-MM-DD');
			this.newEvent.time = moment(this.newEvent.startDate.time).format('HH:mm');
			this.newEvent.location = this.newEvent.location._id;
			console.log(this.newEvent);

			this.loading = true;

			//Reset the error messages
			this.submitStatus = '';
			var vm = this;
			//Only go on if all required fields are filled out
			if(this.newEvent.title && this.newEvent.description && this.newEvent.startDate) {
				this.$http.post(backendUrl + this.apiRoute, vm.newEvent)
				.then(response => {
					// Success
					vm.submitStatus = "New Event was successfully created.";
					vm.success = true;
					vm.loading = false;

					//Reset all fields
					vm.newEvent.title = '';
					vm.newEvent.description = '';
					vm.newEvent.time = '';
					vm.newEvent.startDate = {
						time: ''
					};
					vm.newEvent.endDate = '';
					vm.startTime = {};
					vm.newEvent.location = '';
				}).catch(err => {
					// Error
					console.log(err);
					vm.loading = false;
				});
			}
			else { // else show error message
				this.submitStatus = "All fields have to be filled out!";
				this.success = false;
				this.loading = false;
				this.newEvent.startDate = {
						time: ''
				};
			}
      },
	},
	mounted() {
		let vm = this;
		
		this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
			.then(response => {
				vm.apiRoute = '/api/events';
			})
			.catch(err => {
				console.log(err);
			});
	}
}
</script>

<style lang="scss">
	@import "../scss/_newEvent";
</style>
