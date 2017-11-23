<template>
  	<div id="new_event">
		<h1>New event</h1>
		
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
						<list-select :list="locations"
											option-value="_id"
											option-text="name"
											:custom-text="nameAndAddress"
											:selected-item="selectedLocation"
											placeholder="Select event location*"
											@select="onSelect">
						</list-select>
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
import { ListSelect  } from 'vue-search-select';
import moment from 'moment';

export default {
	name: 'new-event',
	components: {
		ListSelect 
	},
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
			//Value that will be modelled by the datepicker
			startTime: {
				time: ''
			},
			//Time options for the datepicker
			timeoption: {
				type: 'min',
				week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
				month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				format: 'YYYY/MM/DD HH:mm'
			},
			//Message that will display a status afer sending the new event
			submitStatus: '',
			success: false,
			loading: false,
			locations: [],
			//Variable for the search-select that contains the currently selected item/location
			selectedLocation: {}
		}
	},
	methods: {
		nameAndAddress(selectedLocation) { //Function to format the value that is displayed in the search-select
			return `${selectedLocation.name} - ${selectedLocation.address}`;
		},
		onSelect(selected) {
			//Set the value for the item that will be displayed in the search select input
			this.selectedLocation = selected;
			//Set the new Event's location attribute to the ID of the selected location
			this.newEvent.location = selected['_id'];
		},
		addEvent() {
			//Format and set the new Event's date and time attributes from the startTime variable created by the Datepicker
			this.newEvent.startDate = moment(this.startTime.time).format('YYYY-MM-DD');
			this.newEvent.time = moment(this.startTime.time).format('HH:mm');

			this.loading = true;

			//Reset the error messages
			this.submitStatus = '';
			var vm = this;
			//Only go on if all required fields are filled out
			if(this.newEvent.title.length != 0 && this.newEvent.description != 0 && this.newEvent.date != 0) {
				this.$http.post('http://localhost:3000/api/events', vm.newEvent)
				.then(response => {
					// Success
					vm.submitStatus = "New Event was successfully created.";
					vm.success = true;
					vm.loading = false;

					//Reset all fields
					vm.newEvent.title = '';
					vm.newEvent.description = '';
					vm.newEvent.time = '';
					vm.newEvent.startDate = '';
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
			}
      },
	},
	mounted() {
		let vm = this;
		//Get all locations from the backend to display them as select options
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
