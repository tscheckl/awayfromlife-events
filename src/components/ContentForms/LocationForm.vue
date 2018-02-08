<template>
  	<div id="location_form">
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
							<input type="search" ref="address_input" v-model="data.address.value" placeholder="Address of the location" required/>
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
							<md-input v-model="data.facebook_page_url"></md-input>
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
  	</div>
</template>

<script>
import places from 'places.js';



export default {
	name: 'location-form',
	props: {
		data: Object,
	},
	components: {
    	places
	},
	methods: {
		close() {
			this.placesAutocomplete.setVal('');
			document.querySelector('.ap-icon-clear').style.display = 'none';
			document.querySelector('.ap-icon-pin').style.display = '';
		}
	},
	mounted() {
		this.placesAutocomplete = places({container: this.$refs.address_input, type: ['address', 'busStop', 'trainStation']});
		this.placesAutocomplete.on('change', e => {
			this.data.address.street = e.suggestion.name;
			this.data.address.city = e.suggestion.city;
			this.data.address.administrative = e.suggestion.administrative;
			this.data.address.country = e.suggestion.country;
			this.data.address.postcode = e.suggestion.postcode;
			this.data.address.lat = e.suggestion.latlng.lat;
			this.data.address.lng = e.suggestion.latlng.lng;
			this.data.address.value = e.suggestion.value;
		});
	},
	
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_locationForm.scss";
</style>
