<template>
	<div id="new_band">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
  			<md-icon>clear</md-icon>
		</md-button>
		
		<div class="content">
		
			<!-- <band-form :data="newBand"></band-form> -->
			<stepper class="band-form" :steps="4" v-on:submit="addBand">
				<h1 slot="headline">New Band</h1>
				<div slot="step-1" >
					<md-layout md-gutter>
						<md-layout md-flex="100" md-flex-small="100">
							<md-input-container>
								<label>Name of the band</label>
								<md-input v-model="newBand.name" required></md-input>
							</md-input-container>
						</md-layout>

						<md-layout md-flex="50" md-flex-small="100">
							<md-input-container>
								<label>Band's Founding year</label>
								<md-input type="number" v-model="newBand.foundingDate"></md-input>
							</md-input-container>
						</md-layout>

						<md-layout md-flex="50" md-flex-small="100">
							<md-input-container>
								<label>Label the band is signed to</label>
								<md-input v-model="newBand.recordLabel"></md-input>
							</md-input-container>
						</md-layout>

						<md-layout class="genre-header" md-flex="100">
							<h2>Genre</h2>
							<p>(You can add up to 3)</p>
						</md-layout>

						<md-layout md-gutter md-flex="100">
							<md-layout class="single-genre single-form-field" v-for="(genre, index) in newBand.genre" :key="index" md-flex="33" md-flex-small="100">
								<md-input-container>
									<v-select class="form-v-select"
											label="name"
											:on-change="(selected) => onSelectGenre(selected, index)"
											:options="backendGenres"
											v-model="newBand.genre[index]"
											placeholder="Select band's genre*">
									</v-select>
								</md-input-container>

								<md-button v-if="newBand.genre.length > 1" v-on:click="removeFromArray(newBand.genre,index)" class="md-icon-button md-raised">
									<md-icon>clear</md-icon>
									<md-tooltip>Remove genre</md-tooltip>
								</md-button>
							</md-layout>

							<md-button v-if="newBand.genre.length < 3" v-on:click="newBand.genre.push('')" class="md-icon-button md-raised md-accent add-field-btn add-genre-btn">
								<md-icon>add</md-icon>
								<md-tooltip md-direction="right">Add another genre</md-tooltip>
							</md-button>
						</md-layout>
					</md-layout>
				</div>

				<div slot="step-2" >
					<md-layout md-gutter>
						<md-layout md-flex="100">
							<h2>Origin</h2>
						</md-layout>

						<md-layout md-flex="100">
							<p>Always pick one of the suggested cities instead of only writing it into the input field. If the exact city you were looking for does not appear in the suggestions please always pick the closest match.</p>
							<md-input-container>
								<input type="search" ref="address_input" v-model="newBand.origin.value" placeholder="Origin of the Band*" required/>
							</md-input-container>
						</md-layout>
					</md-layout>
				</div>

				<div slot="step-3" >
					<md-layout md-gutter>
						<md-layout md-flex="100">
							<h2>Band History / Description</h2>
						</md-layout>
						
						<md-layout md-flex="100">
							<md-input-container>
								<label>Band History / Description</label>
								<md-textarea v-model="newBand.history"></md-textarea>
							</md-input-container>
						</md-layout>

						<md-layout md-flex="100">
							<h2>Releases</h2>
						</md-layout>

						<md-layout md-flex="100">
							<div class="single-release single-form-field" v-for="(release, index) in newBand.releases" :key="index">
								<div class="release-info">
									<md-input-container class="release-name">
										<label>Name</label>
										<md-input v-model="newBand.releases[index].releaseName"></md-input>
									</md-input-container>
									
									<md-input-container class="release-year">
										<label>Year</label>
										<md-input type="number" v-model="newBand.releases[index].releaseYear"></md-input>
									</md-input-container>
								</div>

								<md-button v-on:click="removeFromArray(newBand.releases,index)" class="md-icon-button md-raised">
									<md-icon>clear</md-icon>
									<md-tooltip>Remove release</md-tooltip>
								</md-button>
							</div>

							<md-button v-if="newBand.releases != null" v-on:click="addRelease" class="md-icon-button md-raised md-accent add-field-btn">
								<md-icon>add</md-icon>
								<md-tooltip md-direction="right">Add another release</md-tooltip>
							</md-button>
						</md-layout>
					</md-layout>
				</div>

				<div slot="step-4" >
					<md-layout md-gutter>
						<md-layout md-flex="100">
							<h2>Additional information</h2>
						</md-layout>

						<md-layout md-flex="50" md-flex-small="100">
							<md-input-container>
								<label>Website</label>
								<md-input v-model="newBand.website"></md-input>
							</md-input-container>
						</md-layout>

						<md-layout md-flex="50" md-flex-small="100">
							<md-input-container>
								<label>Facebook page</label>
								<md-input v-model="newBand.facebookUrl"></md-input>
							</md-input-container>
						</md-layout>

						<md-layout md-flex="50" md-flex-small="100">
							<md-input-container>
								<label>Bandcamp page</label>
								<md-input v-model="newBand.bandcampUrl"></md-input>
							</md-input-container>
						</md-layout>

						<md-layout md-flex="50" md-flex-small="100">
							<md-input-container>
								<label>Soundcloud page</label>
								<md-input v-model="newBand.soundcloudUrl"></md-input>
							</md-input-container>
						</md-layout>
					</md-layout>
				</div>
			</stepper>
		</div>
		
		<div class="loading" v-show="loading">
			<div class="darken"></div>
			<md-spinner md-indeterminate class="md-accent"></md-spinner>
		</div>
		
		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>

		<md-dialog class="similar-dialog" 
				   ref="similarBandDialog"
				   :md-click-outside-to-close="false" 
				   :md-esc-to-close="false">
			<confirm-dialog v-on:close="checkSimilar(false)" v-on:confirm="checkSimilar(true)">

				<h3 slot="headline">There already is a band with the same name from that country. Maybe you wanted to enter this one?</h3>
				<div slot="additional-information" class="similar-event" v-for="band in similarBands" :key="band._id">
					<a :href="`/band/${band.url}`" target="_blank">
						<div class="similar-event-info">
							<h3>{{band.name}}</h3>
							<p>Origin: <span>{{band.origin.country}}</span></p>
							<p>Genre: 
								<span class="band-genre" v-for="genre in band.genre" :key="genre">{{genre}}</span>
							</p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</a>
				</div>
			</confirm-dialog>
		</md-dialog>
		
	</div>
</template>

<script>
import places from 'places.js';

import {backendUrl} from '@/secrets.js';

import BandForm from '@/components/ContentForms/BandForm';
import ConfirmDialog from '@/components/Utilities/ConfirmDialog';
import Stepper from '@/components/Utilities/Stepper';

export default {
	name: 'new-band',
	components: {
		BandForm,
		ConfirmDialog,
		Stepper
	},
	props: {
		edit: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		newBandCountry() {
			this.getSimilar();
		},
		newBandName() {
			this.getSimilar();
		}
	},
	computed: {
		newBand() {
			return this.$store.getters.currentBand;
		},
		newBandCountry() {
			return this.newBand.origin.country;
		},
		newBandName() {
			return this.newBand.name;
		}
	},
	data() {
		return {
			newBandValue: '',
			submitStatus: '',
			loading: false,
			apiRoute: '/api/unvalidated-bands',
			blankBand: {
				name: '',
				genre: [''],
				origin: {
					city: '',
					administrative: '',
					country: '',
					countryCode: '',
					postcode: '',
					lat: 0,
					lng: 0,
				},
				history: '',
				recordLabel: '',
				releases: [{
					releaseName: '',
					releaseYear: ''
				}],
				foundingDate: '',
				website: '',
				bandcampUrl: '',
				soundcloudUrl: '',
				facebookUrl: ''
			},
			similarBandFound: false,
			similarBands: [],
			backendGenres: []
		}
	},
	methods: {
		addBand() {
			this.loading = true;
			this.submitStatus = '';
			
			var vm = this;

			if(this.newBand.name && this.newBand.genre[0] != '' && this.newBand.origin) {
				for(let genre in this.newBand.genre) {
					if(this.newBand.genre[genre] == '') 
						this.newBand.genre.splice(genre, 1);
					else 
						this.newBand.genre[genre] = this.newBand.genre[genre].name;
				}
				//Check if an location is currently edited or a new one is created and update the request routes + parameters accordingly.
				let requestType = this.edit?'put':'post'
				let editBand = this.edit?'/' + this.newBand._id: '';

				this.$http[requestType](backendUrl + this.apiRoute + editBand, this.newBand)
					.then(response => {	
						this.emitSuccess();
						vm.loading = false;
						this.emptyFormFields();

					})
					.catch(err => {
						this.loading = false;
						this.submitStatus = err.body.message;
						this.$refs.snackbar.open();
					});
			}
			else {
				this.submitStatus = 'All required input fields have to be filled out!';
				this.$refs.snackbar.open();
				this.loading = false;
			}
    	},
		emitSuccess() {
			this.$emit('success');
		},
		emitClose() {
			this.$emit('close');
		},
	  	emptyFormFields() {
			this.$store.commit('setCurrentBand', JSON.parse(JSON.stringify(this.blankBand)));
		},
		getSimilar() {
			this.similarBandFound = false;
			
			if(this.newBand.name && this.newBand.origin.country && this.$route.path.toLowerCase().indexOf('/band/') == -1) {
				
				this.$http.get(backendUrl + '/api/bands/similar?country=' + this.newBand.origin.country + '&name=' + this.newBand.name)
				.then(response => {		
						console.log("anfrage an:", backendUrl + '/api/bands/similar?country=' + this.newBand.origin.country + '&name=' + this.newBand.name);
					if (response.body.data) {
						this.similarBands = response.body.data;
						this.similarBandFound = true;
						this.$refs.similarBandDialog.open()
					}
				}).catch(err => console.log(err));
			}
		},
		checkSimilar(accept) {
			if(accept)
				this.emitClose();

			this.similarBandFound = false;
			this.$refs.similarBandDialog.close();
		},
		addRelease() {
			this.newBand.releases.push({
				releaseName: '',
				releaseYear: ''
			});
		},
		onSelectGenre(selected, index) {
			this.newBand.genre[index] = selected;
			if(selected != '') {
				if(this.newBand.genre.reduce((acc, cur) => (acc != '' && cur != ''))) {
					if(this.newBand.genre.length < 3)
						this.newBand.genre.push('');
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
		this.emptyFormFields();

		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.apiRoute = '/api/bands';
			})
			.catch(err => console.log(err));

		this.$http.get(backendUrl + '/api/genres')
		.then(response => {				
			this.backendGenres = response.body.data;
		})
		.catch(err => console.log("Error in BandForm:", err));
		
		this.placesAutocomplete = places({container: this.$refs.address_input, type: 'city', language: 'en'});
		this.placesAutocomplete.on('change', e => {
			
			this.newBand.origin.city = e.suggestion.name;
			this.newBand.origin.administrative = e.suggestion.administrative;
			this.newBand.origin.country = e.suggestion.country;
			this.newBand.origin.countryCode = e.suggestion.countryCode;
			this.newBand.origin.postcode = e.suggestion.postcode;
			this.newBand.origin.lat = e.suggestion.latlng.lat;
			this.newBand.origin.lng = e.suggestion.latlng.lng;
			this.newBand.origin.value = e.suggestion.value;
			this.value = e.suggestion.value;
		});	
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newBand.scss";
</style>
