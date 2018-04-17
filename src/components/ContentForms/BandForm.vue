<template>
	<div id="band_form">
		<form v-on:submit.prevent >
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Name of the band</label>
							<md-input v-model="data.name" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Genre of the band</label>
							<md-input v-model="data.genre" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Band's Founding year</label>
							<md-input type="number" v-model="data.foundingDate" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Label the band is signed to</label>
							<md-input v-model="data.recordLabel"></md-input>
						</md-input-container>
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
						<div class="single-release" v-for="(release, index) in data.releases" :key="index">
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

							<md-button v-on:click="removeRelease(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove release</md-tooltip>
							</md-button>
						</div>

						<md-button v-if="data.releases != null" v-on:click="addRelease" class="md-icon-button md-raised md-accent add-release-btn">
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

export default {
	name: 'band-form',
	props: {
		data: Object,
		value: String
	},
	methods: {
		addRelease() {
			this.data.releases.push({
				releaseName: '',
				releaseYear: ''
			});
		},
		removeRelease(index) {
			this.data.releases.splice(index, 1);
			
			if(this.data.releases.length == 0) {
				this.data.releases[0] = '';
			}
		},
	},
	mounted() {
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
	}
}
</script>

<style lang="scss">
	@import "src/scss/contentForms/_bandForm.scss";
</style>
