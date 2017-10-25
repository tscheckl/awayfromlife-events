<template>
  	<div id="new_event">
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
							<md-option v-for="location in locations" :key="location.name" :value="location['_id']">{{location.name }} - {{location.adress}}</md-option>
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
			 			<datepicker :option="timeoption" :date="startTime"></datepicker>
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
import moment from 'moment';
import {db} from '@/firebase.js';
let eventsRef = db.ref('Events');
let locationsRef = db.ref('Locations');

export default {
	name: 'new-event',
	data() {
		return {
			newEvent: {
				title: '',
				description: '',
				location: '',
				startDate: '',
				endDate: '',
				time: ''
			},
			startTime: {
				time: ''
			},
			endTime: {
				time: ''
			},
			timeoption: {
				type: 'min',
				week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
				month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				format: 'YYYY/MM/DD HH:mm'
			},
			submitStatus: '',
			success: false,
			loading: false,
			locations: []
		}
	},
	firebase: {
		availableLocations: locationsRef
	},
	methods: {
		print() {
			console.log("wdaw", moment(this.startTime.time).format('MM'));
			console.log("date:", moment(this.startTime.time).format('YYYY/MM/DD'));
			console.log("time:", moment(this.startTime.time).format('HH:mm'));
			console.log("Type:", typeof this.startTime.time);
		},
		addEvent: function () {
			this.newEvent.startDate = moment(this.startTime.time).format('YYYY/MM/DD');
			this.newEvent.time = moment(this.startTime.time).format('HH:mm');

			console.log("event object", this.newEvent);

			this.loading = true;
			this.submitStatus = '';
			var vm = this;
			if(this.newEvent.title.length != 0 && this.newEvent.description != 0 && this.newEvent.date != 0) {
				this.$http.post('http://localhost:3000/api/events', vm.newEvent)
				.then(function (response) {
					// Success
					console.log(response.data);

					vm.submitStatus = "New Event was successfully created.";
					vm.success = true;
					vm.loading = false;
					vm.newEvent.title = '';
					vm.newEvent.description = '';
					vm.newEvent.time = '';
					vm.newEvent.startDate = '';
					vm.newEvent.endDate = '';
					vm.startTime = {};
					vm.newEvent.location = '';
				},function (response) {
					// Error
					console.log(response.data);
					vm.loading = false;
				});

				// eventsRef.push(this.newEvent, function() {
				// 	console.log("done");
				// 	vm.submitStatus = "New Event was successfully created.";
				// 	vm.success = true;
				// 	vm.loading = false;
				// 	vm.newEvent.title = '';
				// 	vm.newEvent.description = '';
				// 	vm.newEvent.time = '';
				// 	vm.newEvent.startDate = '';
				// 	vm.newEvent.endDate = '';
				// 	vm.startTime = {};
				// 	vm.newEvent.location = '';
				// });

			}
			else {
				this.submitStatus = "All fields have to be filled out!";
				this.success = false;
				this.loading = false;
			}
      },
	},
	mounted() {
		let vm = this;
		this.$http.get('http://localhost:3000/api/locations')
			.then((response) => {
				vm.locations = response.body;
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			})
	}
}
</script>

<style lang="scss">
	@import "../scss/_newEvent";
</style>
