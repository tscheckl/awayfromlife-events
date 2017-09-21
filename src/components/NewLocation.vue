<template>
	<div id="new_location">
		<router-link to="/">
			<md-button class="md-flat new-event-button">Create new Location -></md-button>
		</router-link>

		<h1>New location</h1>
		
		<form v-on:submit.prevent >
			<div class="form-content">
			<md-layout md-gutter>
				<md-layout md-flex="50" md-flex-small="100">
					<md-input-container>
						<label>Name of the location</label>
						<md-input v-model="newLocation.name" required></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<h2>Adress</h2>
				</md-layout>

				<md-layout md-flex="30" md-flex-small="100">
					<md-input-container>
						<label>Street name + number</label>
						<md-input v-model="newLocation.street" required></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="30" md-flex-small="100">
					<md-input-container>
						<label>Zip code</label>
						<md-input v-model="newLocation.zipCode" required></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="30" md-flex-small="100">
					<md-input-container>
						<label>City</label>
						<md-input v-model="newLocation.city" required></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<h2>Additional information</h2>
				</md-layout>

				<md-layout md-flex="50" md-flex-small="100">
					<md-input-container>
						<label>Website</label>
						<md-input v-model="newLocation.website"></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="50" md-flex-small="100">
					<md-input-container>
						<label>Facebook page</label>
						<md-input v-model="newLocation.facebookPage"></md-input>
					</md-input-container>
				</md-layout>
			</md-layout>

			<md-button type="submit" v-on:click="addLocation" class="md-raised">Send</md-button>
			<span class="message" v-if="submitStatus.length >= 1" :class="success? 'success': 'error'">{{submitStatus}}</span>
		</div>
		</form>
	</div>
</template>

<script>
import {db} from '@/firebase.js';

let eventsRef = db.ref('Locations');

export default {
	name: 'new-location',
	data() {
		return {
			newLocation: {
				name: '',
				street: '',
				zipCode: '',
				city: '',
				website: '',
				facebookPage: ''

			},
			success: false,
			submitStatus: ''
		}
	},
	methods: {
		addLocation() {
			this.submitStatus = '';
			var vm = this;
			if(this.newLocation.name.length != 0 && this.newLocation.street != 0 && this.newLocation.zipCode != 0 && this.newLocation.city != 0) {
				eventsRef.push(this.newLocation, function(response) {
					console.log(response);
					console.log("done");
					vm.submitStatus = "New Location was successfully created.";
					vm.success = true;
				});
				this.newLocation.name = '';
				this.newLocation.street = '';
				this.newLocation.zipCode = '';
				this.newLocation.city = '';
				this.newLocation.website = '';
				this.newLocation.facebookPage = '';
			}
			else {
				vm.submitStatus = "All fields have to be filled out!";
				vm.success = false;
			}
      },
	}
}
</script>

<style lang="scss">
	@import "src/scss/_newLocation";
</style>
