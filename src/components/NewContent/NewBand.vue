<template>
	<div id="new_band">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
  			<md-icon>clear</md-icon>
		</md-button>
		
		<div class="content">
			<h1>{{edit? 'EDIT BAND' :'NEW BAND'}}</h1>
		
			<band-form :data="newBand"></band-form>

			<md-button type="submit" v-on:click="addBand" class="md-raised md-accent">{{edit ?'Update Band' :'Add Band'}}</md-button>
		</div>
		
		<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		
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
					<a :href="`/#/band/${band.url}`" target="_blank">
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
import BandForm from '@/Components/ContentForms/BandForm';
import ConfirmDialog from '@/Components/ConfirmDialog';

import {backendUrl} from '@/secrets.js';

export default {
	name: 'new-band',
	components: {
		BandForm,
		ConfirmDialog
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
			if(this.edit) {
				return JSON.parse(JSON.stringify(this.$store.getters.currentBand));
			}
			else {
				return this.blankBand
			}
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
				websiteUrl: '',
				bandcampUrl: '',
				soundcloudUrl: '',
				facebookUrl: ''
			},
			similarBandFound: false,
			similarBands: []
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
						this.submitStatus = this.edit ?'An error occurred while updating the Band. Please try again!'
										:'An error occurred while creating the Band. Please try again!';
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
			this.blankBand = {
				name: '',
				genre: [''],
				origin: {},
				history: '',
				label: '',
				releases: [{
					releaseName: '',
					releaseYear: ''
				}],
				foundingDate: '',
				websiteUrl: '',
				bandcampUrl: '',
				soundcloudUrl: '',
				facebookUrl: ''
			};
			this.newBandValue = '';
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
				}).catch(err => {console.log(err);});
			}
		},
		checkSimilar(accept) {
			if(accept)
				this.emitClose();

			this.similarBandFound = false;
			this.$refs.similarBandDialog.close();
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.apiRoute = '/api/bands';
			})
			.catch(err => {});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newBand.scss";
</style>
