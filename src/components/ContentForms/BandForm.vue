<template>
	<div id="band_form">
		<md-button v-if="canSubmit" class="md-icon-button md-accent close-btn" v-on:click="$emit('close')">
			<md-icon>clear</md-icon>
		</md-button>

		<slot name="headline"></slot>
		
		<form v-on:submit.prevent >
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="100" md-flex-small="100">
						<md-input-container>
							<label>Name of the band</label>
							<md-input v-model="myData.name" required></md-input>
						</md-input-container>
					</md-layout>

					<image-step v-model="image"></image-step>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Band's Founding year</label>
							<md-input type="number" v-model="myData.foundingDate"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Label the band is signed to</label>
							<md-input v-model="myData.recordLabel"></md-input>
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
										  placeholder="Select band's genre*">
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

					<md-layout md-flex="100">
						<h2>Origin</h2>
					</md-layout>

					<md-layout md-flex="100">
						<p>Always pick one of the suggested cities instead of only writing it into the input field. If the exact city you were looking for does not appear in the suggestions please always pick the closest match.</p>
						<md-input-container>
							<input type="search" ref="address_input" v-model="myData.origin.value" placeholder="Origin of the Band*" required/>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Band History / Description</h2>
					</md-layout>
					
					<md-layout md-flex="100">
						<md-input-container>
							<label>Band History / Description</label>
							<md-textarea v-model="myData.history"></md-textarea>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Releases</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-release single-form-field" v-for="(release, index) in myData.releases" :key="index">
							<div class="release-info">
								<md-input-container class="release-name">
									<label>Name</label>
									<md-input v-model="release.releaseName"></md-input>
								</md-input-container>
								
								<md-input-container class="release-year">
									<label>Year</label>
									<md-input type="number" v-model="release.releaseYear"></md-input>
								</md-input-container>
							</div>

							<md-button v-on:click="removeFromArray(myData.releases,index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove release</md-tooltip>
							</md-button>
						</div>

						<md-button v-if="myData.releases != null" v-on:click="addRelease" class="md-icon-button md-raised md-accent add-field-btn">
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
							<md-input v-model="myData.website"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Facebook page</label>
							<md-input v-model="myData.facebookUrl"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Bandcamp page</label>
							<md-input v-model="myData.bandcampUrl"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Soundcloud page</label>
							<md-input v-model="myData.soundcloudUrl"></md-input>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>
		</form>

		<md-button v-if="canSubmit" type="submit" v-on:click="$emit('submit', myData)" class="md-raised md-accent submit-button">Update band</md-button>
	</div>
</template>

<script>
import places from 'places.js';
import {frontEndSecret, backendUrl} from '@/secrets.js';

import ImageStep from "@/components/NewContent/ImageStep";

export default {
	name: 'band-form',
	components: {
		ImageStep
	},
	props: {
		data: Object,
		value: [String, Object, File],
		canSubmit: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		data() {
			this.myData = this.data;
		},
		value() {
			this.image = this.value;
		},
		image() {
			this.$emit('input', this.image);
		}
	},
	data() {
		return {
			myData: this.data,
			backendGenres: [],
			image: this.value
		}	
	},
	methods: {
		addRelease() {
			this.myData.releases.push({
				releaseName: '',
				releaseYear: ''
			});

			console.log(this.myData.releases);
			this.$nextTick();
			
		},
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
		this.$http.get(backendUrl + '/api/genres')
			.then(response => {				
				this.backendGenres = response.body.data;
			})
			.catch(err => console.log("Error in BandForm:", err));
		
		this.placesAutocomplete = places({container: this.$refs.address_input, type: 'city', language: 'en'});
		this.placesAutocomplete.on('change', e => {
			
			this.myData.origin.city = e.suggestion.name;
			this.myData.origin.administrative = e.suggestion.administrative;
			this.myData.origin.country = e.suggestion.country;
			this.myData.origin.countryCode = e.suggestion.countryCode;
			this.myData.origin.postcode = e.suggestion.postcode;
			this.myData.origin.lat = e.suggestion.latlng.lat;
			this.myData.origin.lng = e.suggestion.latlng.lng;
			this.myData.origin.value = e.suggestion.value;
		});	
	},
	updated() {
		//Workaround for admin page.
		if(!this.placesAutocomplete) this.placesAutocomplete = places({container: this.$refs.address_input, type: 'city', language: 'en'});
	}
}
</script>

<style lang="scss">
	@import "src/scss/contentForms/_bandForm.scss";
</style>
