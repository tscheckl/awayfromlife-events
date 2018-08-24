<template>
	<div id="band_form">
		<form v-on:submit.prevent >
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="100" md-flex-small="100">
						<md-input-container>
							<label>Name of the band</label>
							<md-input v-model="data.name" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Band's Founding year</label>
							<md-input type="number" v-model="data.foundingDate"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Label the band is signed to</label>
							<md-input v-model="data.recordLabel"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout class="genre-header" md-flex="100">
						<h2>Genre</h2>
						<p>(You can add up to 3)</p>
					</md-layout>

					<md-layout md-gutter md-flex="100">
						<md-layout class="single-genre single-form-field" v-for="(genre, index) in data.genre" :key="index" md-flex="33" md-flex-small="100">
							<md-input-container>
								<v-select class="form-v-select"
										  :options="backendGenres"
										  v-model="data.genre[index]"
										  placeholder="Select band's genre*">
								</v-select>
							</md-input-container>

							<md-button v-if="data.genre.length > 1" v-on:click="removeFromArray(data.genre,index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove genre</md-tooltip>
							</md-button>
						</md-layout>

						<md-button v-if="data.genre.length < 3" v-on:click="data.genre.push('')" class="md-icon-button md-raised md-accent add-field-btn add-genre-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another genre</md-tooltip>
						</md-button>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Origin</h2>
					</md-layout>

					<md-layout md-flex="100">
						<p>Always pick one of the suggested cities instead of only writing it into the input field. If the exact city you were looking for does not appear in the suggestions please always pick the closest match.</p>
						<md-input-container>
							<input type="search" ref="address_input" v-model="data.origin.value" placeholder="Origin of the Band*" required/>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Band History / Description</h2>
					</md-layout>
					
					<md-layout md-flex="100">
						<md-input-container>
							<label>Band History / Description</label>
							<md-textarea v-model="data.history"></md-textarea>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Releases</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-release single-form-field" v-for="(release, index) in data.releases" :key="index">
							<div class="release-info">
								<md-input-container class="release-name">
									<label>Name</label>
									<md-input v-model="data.releases[index].releaseName"></md-input>
								</md-input-container>
								
								<md-input-container class="release-year">
									<label>Year</label>
									<md-input type="number" v-model="data.releases[index].releaseYear"></md-input>
								</md-input-container>
							</div>

							<md-button v-on:click="removeFromArray(data.releases,index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove release</md-tooltip>
							</md-button>
						</div>

						<md-button v-if="data.releases != null" v-on:click="addRelease" class="md-icon-button md-raised md-accent add-field-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another release</md-tooltip>
						</md-button>
					</md-layout>
					

					<md-layout md-flex="100">
						<h2>Additional information</h2>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Website</label>
							<md-input v-model="data.websiteUrl"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Facebook page</label>
							<md-input v-model="data.facebookUrl"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Bandcamp page</label>
							<md-input v-model="data.bandcampUrl"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Soundcloud page</label>
							<md-input v-model="data.soundcloudUrl"></md-input>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>
		</form>
	</div>
</template>

<script>
import places from 'places.js';
import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'band-form',
	props: {
		data: Object,
		value: String
	},
	data() {
		return {
			backendGenres: []
		}	
	},
	methods: {
		addRelease() {
			this.data.releases.push({
				releaseName: '',
				releaseYear: ''
			});
		},
		removeFromArray(array, index) {
			array.splice(index, 1);
			
			if(array.length == 0) {
				array[0] = '';
			}
		},
	},
	mounted() {
		this.$http.get(backendUrl + '/api/bands/genres')
			.then(response => {
				this.backendGenres = response.body.data;
			})
			.catch(err => console.log("Error in BandForm:", err));
		
		this.placesAutocomplete = places({container: this.$refs.address_input, type: 'city'});
		this.placesAutocomplete.on('change', e => {
			
			this.data.origin.name = e.suggestion.name;
			this.data.origin.administrative = e.suggestion.administrative;
			this.data.origin.country = e.suggestion.country;
			this.data.origin.postcode = e.suggestion.postcode;
			this.data.origin.lat = e.suggestion.latlng.lat;
			this.data.origin.lng = e.suggestion.latlng.lng;
			this.data.origin.value = e.suggestion.value;
			this.value = e.suggestion.value;
		});	
	},
	updated() {
		//Workaround for admin page.
		if(!this.placesAutocomplete) this.placesAutocomplete = places({container: this.$refs.address_input, type: 'city'});		
	}
}
</script>

<style lang="scss">
	@import "src/scss/contentForms/_bandForm.scss";
</style>
