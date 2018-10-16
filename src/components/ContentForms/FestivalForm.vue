<template>
	<div id="festival_form">
		<md-button v-if="canSubmit" class="md-icon-button md-accent close-btn" v-on:click="$emit('close')">
			<md-icon>clear</md-icon>
		</md-button>
		
		<slot name="headline"></slot>
		
		<form class="new-festival-form" v-on:submit.prevent>
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Title</label>
							<md-input v-model="myData.name" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout class="genre-header" md-flex="100">
						<h2>Genre</h2>
						<p>(You can add up to 3)</p>
					</md-layout>

					<md-layout md-gutter md-flex="100">
						<md-layout class="single-genre single-form-field" v-for="(genre, index) in myData.genre" :key="index" md-flex="33" md-flex-small="100">
							<md-input-container>
								<v-select class="form-v-select"
										  label="name"
										  :on-change="(selected) => onSelectGenre(selected, index)"
										  :options="backendGenres"
										  v-model="myData.genre[index]"
										  placeholder="Select festival's genre*">
								</v-select>
							</md-input-container>

							<md-button v-if="myData.genre.length > 1" v-on:click="removeFromArray(myData.genre,index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove genre</md-tooltip>
							</md-button>
						</md-layout>

						<md-button v-if="myData.genre.length < 3" v-on:click="myData.genre.push('')" class="md-icon-button md-raised md-accent add-field-btn add-genre-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another genre</md-tooltip>
						</md-button>
					</md-layout>
				</md-layout>

				<md-layout md-flex="100">
					<h2>Address</h2>
				</md-layout>

				<md-layout md-flex="100">
					<p>Always pick one of the suggested addresses instead of only writing it into the input field. If the exact address you were looking for does not appear in the suggestions please always pick the closest match.</p>
					<md-input-container>
						<input type="search" ref="address_input" v-model="myData.address.value" placeholder="Address of the location*" required/>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<h2>Additional information</h2>
				</md-layout>

				<md-layout md-flex="100">
					<md-input-container>
						<label>Description</label>
						<md-textarea v-model="myData.description"></md-textarea>
					</md-input-container>
				</md-layout>
				
				<md-layout md-flex="100">
					<md-input-container>
						<label>Ticket Link</label>
						<md-input v-model="myData.ticketLink"></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="50" md-flex-small="100">
					<md-input-container>
						<label>Website</label>
						<md-input v-model="myData.website"></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="50" md-flex-small="100">
					<md-input-container>
						<label>Facebook page</label>
						<md-input v-model="myData.facebookUrl"></md-input>
					</md-input-container>
				</md-layout>
			</div>

			<md-button v-if="canSubmit" type="submit" v-on:click="$emit('submit', myData)" class="md-raised md-accent submit-button">Update Festival</md-button>
		</form>
	</div>
</template>

<script>
import places from 'places.js';

import {frontEndSecret, backendUrl} from '@/secrets.js';
import { getBandOptions } from '@/helpers/backend-getters.js';

export default {
	name: 'festival-form',
	props: {
		data: Object,
		value: String,
		canSubmit: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			myData: this.data,
			backendGenres: [],
			backendBands: [],
		}
	},
	methods: {
		onSelectGenre(selected, index) {
			this.myData.genre[index] = selected;
			if(selected != '') {
				if(this.myData.genre.reduce((acc, cur) => (acc != '' && cur != ''))) {
					if(this.myData.genre.length < 3)
						this.myData.genre.push('');
				}
			}
		},
		removeFromArray(array, index) {
			array.splice(index, 1);
			
			if(array.length == 0) {
				array[0] = '';
			}
		},
	},
	mounted() {
		getBandOptions()
			.then(data => this.backendBands = data)
			.catch(err => console.log(err));

		this.$http.get(backendUrl + '/api/genres')
			.then(response => {				
				this.backendGenres = response.body.data;
			})
			.catch(err => console.log("Error in BandForm:", err));

		this.placesAutocomplete = places({container: this.$refs.address_input, type: 'address', language: 'en'});
		this.placesAutocomplete.on('change', e => {
			this.myData.address.street = e.suggestion.name;
			
			if(e.suggestion.city)
				this.myData.address.city = e.suggestion.city;
			else if(e.suggestion.county)
				this.myData.address.city = e.suggestion.county;
			else if(e.suggestion.administrative)
				this.myData.address.city = e.suggestion.administrative;
			else 
				this.myData.address.city = '';

			this.myData.address.administrative = e.suggestion.administrative;
			this.myData.address.county = e.suggestion.county;
			this.myData.address.country = e.suggestion.country;
			this.myData.address.countryCode = e.suggestion.countryCode;
			this.myData.address.postcode = e.suggestion.postcode;
			this.myData.address.lat = e.suggestion.latlng.lat;
			this.myData.address.lng = e.suggestion.latlng.lng;
			this.myData.address.value = e.suggestion.value;
			this.value = e.suggestion.value;
		});
	},
	updated() {
		//Workaround for admin page.
		if(!this.placesAutocomplete) this.placesAutocomplete = places({container: this.$refs.address_input, type: 'address', language: 'en'});
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_festivalForm.scss";
</style>
