<template>
  	<div id="new_event">
		<router-link to="/locations">
			<md-button class="md-flat new-location-button">Create new Location -></md-button>
		</router-link>

		<h1 v-on:click="print">New event</h1>
		
		<form v-on:submit.prevent >
			<div class="form-content">
			<md-layout md-gutter>
				<md-layout md-flex="50" md-flex-small="100">
					<md-input-container>
						<label>Title</label>
						<md-input v-model="newEvent.title" required></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="50" md-flex-small="100">
					<md-input-container>
						<label>Select event location</label>
						<md-select v-model="newEvent.location">
							<md-option v-for="location in availableLocations" :key="location.name" :value="location['.key']">{{location.name }} - {{location.address}}</md-option>
						</md-select>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<md-input-container>
						<label>Description</label>
						<md-textarea v-model="newEvent.description" required></md-textarea>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="50" md-flex-small="100">
					<div class="picker">
						<label>Date</label>
			 			<datepicker :option="timeoption" :date="newEvent.startTime"></datepicker>
					</div>
				</md-layout>
			</md-layout>

			<md-button type="submit" v-on:click="addEvent" class="md-raised md-accent">Send</md-button>
			<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
			<span class="message" v-if="submitStatus.length >= 1" :class="this.success? 'success': 'error'">{{this.submitStatus}}</span>
		</div>
		</form>
  	</div>
</template>

<script>
import {db} from '@/firebase.js';
let eventsRef = db.ref('Events');
let locationsRef = db.ref('Locations');
console.log("locationsref", locationsRef);

export default {
	name: 'new-event',
	data() {
		return {
			newEvent: {
				title: '',
				description: '',
				startTime : {
					time: ''
				},
				location: ''
			},
			timeoption: {
				type: 'min',
				week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
				month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				format: 'YYYY-MM-DD HH:mm'
			},
			submitStatus: '',
			success: false,
			loading: false,
		}
	},
	firebase: {
		availableLocations: locationsRef
	},
	methods: {
		print() {
			console.log(this.newEvent.location);
		},
		addEvent: function () {
			this.loading = true;
			this.submitStatus = '';
			var vm = this;
			if(this.newEvent.title.length != 0 && this.newEvent.description != 0 && this.newEvent.startTime.time != 0) {
				eventsRef.push(this.newEvent, function() {
					console.log("done");
					vm.submitStatus = "New Event was successfully created.";
					vm.success = true;
					vm.loading = false;
					vm.newEvent.title = '';
					vm.newEvent.description = '';
					vm.newEvent.startTime.time = '';
				});
			}
			else {
				this.submitStatus = "All fields have to be filled out!";
				this.success = false;
				this.loading = false;
			}
      },
	},
	mounted() {
		console.log(locationsRef);
	}
}
</script>

<style lang="scss">
	@import "../scss/_newEvent";
</style>
