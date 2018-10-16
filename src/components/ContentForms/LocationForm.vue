<template>
  	<div id="location_form">
		<md-button v-if="canSubmit" class="md-icon-button md-accent close-btn" v-on:click="$emit('close')">
			<md-icon>clear</md-icon>
		</md-button>

		<slot name="headline"></slot>
		
	  	<form v-on:submit.prevent >
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Name of the location</label>
							<md-input v-model="data.name" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Address</h2>
					</md-layout>

					<md-layout md-flex="100">
						<p>Always pick one of the suggested addresses instead of only writing it into the input field. If the exact address you were looking for does not appear in the suggestions please always pick the closest match.</p>
						<md-input-container>
							<input type="search" ref="address_input" v-model="data.address.value" placeholder="Address of the location*" required/>
						</md-input-container>
					</md-layout>
					

					<md-layout md-flex="100">
						<h2>Additional information</h2>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Website</label>
							<md-input v-model="data.website"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Facebook page</label>
							<md-input v-model="data.facebookUrl"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Additional information</label>
							<md-textarea v-model="data.information"></md-textarea>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>
		</form>

		<md-button v-if="canSubmit" type="submit" v-on:click="$emit('submit', data)" class="md-raised md-accent submit-button">Update location</md-button>
  	</div>
</template>

<script>
import places from 'places.js';

export default {
	name: 'location-form',
	components: {
    	places
	},
	props: {
		data: Object,
		value: String,
		canSubmit: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		data() {
			if(this.value == '') {
				this.close();
			}
		}
	},
	methods: {
		close() {
			this.placesAutocomplete.setVal('');
			document.querySelector('.ap-icon-clear').style.display = 'none';
			document.querySelector('.ap-icon-pin').style.display = '';
		}
	},
	mounted() {
		this.placesAutocomplete = places({container: this.$refs.address_input, type: 'address', language: 'en'});
		this.placesAutocomplete.on('change', e => {
			this.data.address.street = e.suggestion.name;
			this.data.address.city = e.suggestion.city ?e.suggestion.city :'';

			if(e.suggestion.city)
				this.data.address.city = e.suggestion.city;
			else if(e.suggestion.county)
				this.data.address.city = e.suggestion.county;
			else if(e.suggestion.administrative)
				this.data.address.city = e.suggestion.administrative;
			else 
				this.data.address.city = '';

			this.data.address.administrative = e.suggestion.administrative;
			this.data.address.county = e.suggestion.county;
			this.data.address.country = e.suggestion.country;
			this.data.address.countryCode = e.suggestion.countryCode;
			this.data.address.postcode = e.suggestion.postcode;
			this.data.address.lat = e.suggestion.latlng.lat;
			this.data.address.lng = e.suggestion.latlng.lng;
			this.data.address.value = e.suggestion.value;
			this.value = e.suggestion.value ?e.suggestion.value :this.value;
		});
	},
	updated() {
		//Workaround for admin page.
		if(!this.placesAutocomplete) this.placesAutocomplete = places({container: this.$refs.address_input, type: 'address', language: 'en'});
	}
	
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_locationForm.scss";
</style>
