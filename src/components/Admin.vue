<template>
	<div id="admin">
		<md-toolbar>
			<h1>Admin Console</h1>
			<md-button>
				<md-icon>exit_to_app</md-icon>
				<md-tooltip md-direction="bottom">Logout</md-tooltip>
			</md-button>
		</md-toolbar>

		<div class="admin-content">
			<div class="verify-list">
				<md-input-container>
					<md-select name="content-type" v-model="isEvent">
						<md-option :value="true">Events</md-option>
						<md-option :value="false">Locations</md-option>
					</md-select>
				</md-input-container>
				<md-list v-if="isEvent">
					<md-list-item v-for="event in events" :key="event._id" @click="showEventInfo(event)">
						<h4>{{event.title}}</h4>
						<span>Event</span>
					</md-list-item>
				</md-list>

				<md-list v-else>
					<md-list-item v-for="location in locations" :key="location._id" @click="showLocationInfo(location)">
						<h4>{{location.name}}</h4>
						<span>Location</span>
					</md-list-item>
				</md-list>
			</div>
			<div class="verify-info">
				<h1>Angegebene Daten</h1>
				<form v-on:submit.prevent v-if="isEvent">
					<md-layout md-gutter>
						<md-layout md-flex="50" md-flex-small="100">
							<md-input-container>
								<label>Title</label>
								<md-input v-model="verifyEvent.title"  required></md-input>
							</md-input-container>
						</md-layout>

						<md-layout md-flex="50" md-flex-small="100">
								<list-select :list="locations"
											option-value="_id"
											option-text="name"
											:custom-text="nameAndAddress"
											:selected-item="verifyEvent.location"
											placeholder="Select event location*"
											@select="onSelect">
								</list-select>
						</md-layout>

						<md-layout md-flex="100">
							<md-input-container>
								<label>Description</label>
								<md-textarea v-model="verifyEvent.description" required></md-textarea>
							</md-input-container>
						</md-layout>

						<md-layout md-flex="50" md-flex-small="100">
							<div class="picker">
								<label>Date</label>
								<datepicker :option="timeoption" :date="startTime"></datepicker>
							</div>
						</md-layout>
					</md-layout>
					<p class="error-msg" v-if="error"><md-icon>warning</md-icon> {{errorMsg}}</p>

					<md-button type="submit" v-on:click="handleVerify" class="md-accent verify-btn">
						<md-icon>check</md-icon>
					</md-button>
					<md-button type="submit" v-on:click="handleVerify" class="md-accent delete-btn">
						<md-icon>clear</md-icon>
					</md-button>
					<md-spinner v-if="loading" md-indeterminate></md-spinner>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { ListSelect  } from 'vue-search-select';

export default {
	name: 'admin',
	components: {
		ListSelect 
	},
	data() {
		return {
			error: false,
			errorMsg: '',
			loading: false,
			isEvent: true,
			events: [],
			locations: [],
			verifyEvent: {},
			//Value that will be modelled by the datepicker
			startTime: {
				time: ''
			},
			//Time options for the datepicker
			timeoption: {
				type: 'min',
				week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
				month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				format: 'YYYY-MM-DD HH:mm'
			},
		}
	},
	methods: {
		handleVerify() {
			//IMPORTANT: Before sending out the updated event, the location needs to be changed to the location's id instead of the whole object
			//ALSO IMPORTANT: Before sending out the updated event, the time and startDate need to be formatted from the startTime Variable.
			console.log(this.startTime);
		},
		showEventInfo(event) {
			this.verifyEvent = event;
			this.startTime.time = this.verifyEvent.startDate + " " + this.verifyEvent.time;

			this.$http.get("http://localhost:3000/api/locations/" + event.location)
				.then(response => {
					this.verifyEvent.location = response.body;
				})
				.catch(err => {
					console.log(err);
				})
		},
		nameAndAddress(selectedLocation) {
			return `${selectedLocation.name} - ${selectedLocation.address}`;
		},
		onSelect(selected) {
			this.verifyEvent.location = selected;
		}
	},
	mounted() {
		this.$http.get("http://localhost:3000/api/events")
			.then(response => {
				this.events = response.body;
				this.$http.get("http://localhost:3000/api/locations")
					.then(response => {
						this.locations = response.body;
						this.showEventInfo(this.events[0]);
					})
					.catch(err => {
						console.log(err);
					})
			})
			.catch(err => {
				console.log(err);
			});
	}
}
</script>

<style lang="scss">
	@import "src/scss/_admin.scss";
</style>
