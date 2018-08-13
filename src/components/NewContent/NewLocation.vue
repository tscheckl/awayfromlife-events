<template>
	<div id="new_location">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
  			<md-icon>clear</md-icon>
		</md-button>
		
		<h1>{{edit ?'EDIT LOCATION' :'NEW LOCATION'}}</h1>
		
		<location-form :data="newLocation" :value="newLocationValue"></location-form>

		<md-button type="submit" v-on:click="addLocation" class="md-raised md-accent">{{edit ?'Update Location' :'Add Location'}}</md-button>
		<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		
		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>

		<md-dialog class="similar-dialog" 
				   ref="similarLocationDialog"
				   :md-click-outside-to-close="false" 
				   :md-esc-to-close="false">
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="84px" height="84px">
				<g>
					<g>
						<path d="M505.086,230.115L402.96,53.228c-9.218-15.966-26.398-25.885-44.834-25.885H153.874c-18.436,0-35.616,9.918-44.834,25.885    L6.914,230.115c-9.219,15.966-9.219,35.804,0,51.771L109.04,458.772c9.218,15.966,26.398,25.885,44.834,25.885h204.252    c18.437,0,35.616-9.918,44.834-25.885l102.126-176.887C514.305,265.919,514.305,246.081,505.086,230.115z M486.978,271.431    L384.852,448.317c-5.495,9.518-15.736,15.43-26.726,15.43H153.874c-10.99,0-21.231-5.912-26.726-15.43L25.023,271.431    c-5.495-9.518-5.495-21.343,0-30.861L127.148,63.683c5.495-9.518,15.736-15.43,26.726-15.43h204.252    c10.99,0,21.231,5.912,26.726,15.43l102.126,176.887C492.473,250.087,492.473,261.913,486.978,271.431z" fill="#ff5252"/>
					</g>
				</g>
				<g>
					<g>
						<path d="M469.738,249.974L368.087,73.909c-2.146-3.717-6.145-6.025-10.437-6.025H154.348c-4.292,0-8.291,2.308-10.437,6.026    L42.259,249.978c-2.143,3.715-2.143,8.33,0.002,12.049l101.651,176.065c2.146,3.717,6.145,6.025,10.437,6.025h129.879    c5.774,0,10.455-4.681,10.455-10.455s-4.681-10.455-10.455-10.455H159.463L62.926,255.999l96.537-167.208h193.075l96.537,167.209    l-99.094,171.636c-2.888,5-1.174,11.395,3.826,14.281c4.997,2.885,11.394,1.174,14.281-3.826L469.74,262.023    C471.884,258.309,471.884,253.693,469.738,249.974z" fill="#ff5252"/>
					</g>
				</g>
				<g>
					<g>
						<path d="M323.957,423.207h-4.182c-5.774,0-10.455,4.681-10.455,10.455s4.681,10.455,10.455,10.455h4.182    c5.774,0,10.455-4.681,10.455-10.455S329.731,423.207,323.957,423.207z" fill="#ff5252"/>
					</g>
				</g>
				<g>
					<g>
						<path d="M149.121,234.598c0-3.656,3.42-7.076,11.792-7.076c9.67,0,11.91,4.481,16.156,4.481c5.189,0,7.311-6.486,7.311-9.67    c0-9.198-17.217-10.377-23.467-10.377c-14.74,0-30.188,6.721-30.188,24.41c0,27.594,37.381,25.117,37.381,39.386    c0,5.66-6.014,7.782-11.437,7.784c-10.967,0-14.505-8.727-20.047-8.727c-4.481,0-8.019,5.896-8.019,9.906    c0,7.783,12.971,15.33,28.419,15.33c17.099,0,29.48-9.198,29.48-26.179C186.502,244.149,149.121,246.389,149.121,234.598z" fill="#ff5252"/>
					</g>
				</g>
				<g>
					<g>
						<path d="M246.644,212.664h-50.942c-3.891,0-5.542,4.246-5.542,8.137c0,4.481,2.004,8.372,5.542,8.372h16.273v64.032    c0,3.773,4.599,5.66,9.198,5.66c4.599,0,9.198-1.887,9.198-5.66v-64.032h16.273c3.538,0,5.542-3.891,5.542-8.372    C252.186,216.909,250.535,212.664,246.644,212.664z" fill="#ff5252"/>
					</g>
				</g>
				<g>
					<g>
						<path d="M286.151,212.664c-16.273,0-28.891,7.547-28.891,27.829v31.249c0,20.282,12.618,27.829,28.891,27.829    s29.009-7.547,29.009-27.829v-31.249C315.16,220.211,302.424,212.664,286.151,212.664z M296.765,271.742    c0,8.136-4.008,11.792-10.613,11.792s-10.495-3.655-10.495-11.792v-31.249c0-8.136,3.892-11.792,10.495-11.792    s10.613,3.655,10.613,11.792V271.742z" fill="#ff5252"/>
					</g>
				</g>
				<g>
					<g>
						<path d="M358.205,212.664h-24.41c-4.128,0-6.839,2.594-6.839,5.542h-0.001v74.998c0,3.773,4.599,5.66,9.198,5.66    c4.599,0,9.198-1.887,9.198-5.66v-25.471h11.675c16.273,0,29.009-7.547,29.009-27.358v-0.59    C386.035,219.975,373.771,212.664,358.205,212.664z M367.64,241.79c0,8.019-4.009,11.792-10.613,11.792h-11.675v-24.881h11.675    c6.603,0,10.613,3.773,10.613,11.792V241.79z" fill="#ff5252"/>
					</g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
				<g>
				</g>
			</svg>

			<h3>There already is a location at this address. Maybe you wanted to enter this one?</h3>
			<div class="similar-event" v-for="location in similarLocations" :key="location._id">
				<a :href="`/#/location/${location._id}`" target="_blank">
					<div class="similar-event-info">
						<h3>{{location.name}}</h3>
						<p>Address: <span>{{location.address.street}}</span></p>
						<p>City: <span>{{location.address.city}}</span></p>
					</div>
					<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
				</a>
			</div>
			<md-icon class="yes-icon">check</md-icon>
			<md-icon class="no-icon">clear</md-icon>
			<md-button class="yes" v-on:click="checkSimilar(true)">Yes</md-button>
			<md-button class="no" v-on:click="checkSimilar(false)">No</md-button>
		</md-dialog>
	</div>
</template>

<script>
import LocationForm from '@/Components/ContentForms/LocationForm';

import {backendUrl} from '@/secrets.js';

export default {
	name: 'new-location',
	components: {
		LocationForm
	},
	props: {
		edit: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		newLocationAddress() {
			this.getSimilar();
		},
		newLocationCity() {
			this.getSimilar();
		},
		newLocationName() {
			this.getSimilar();
		}
	},
	computed: {
		newLocation() {
			if(this.edit) {
				return Object.assign({},this.$store.getters.currentLocation);
			}
			else {
				return this.blankLocation
			}
		},
		newLocationAddress() {
			return this.newLocation.address.street;
		},
		newLocationCity() {
			return this.newLocation.address.city;
		},
		newLocationName() {
			return this.newLocation.name;
		}
	},
	data() {
		return {
			newLocationValue: 'wdwadaw',
			submitStatus: '',
			loading: false,
			apiRoute: '/api/unvalidated-locations',
			blankLocation: {
				name: '',
				address: {
					street: '',
					city: '',
					administrative: '',
					country: '',
					postcode: '',
					lat: 0,
					lng: 0,
					value: '',
				},
				information: '',
				website: '',
				facebook_page_url: ''
			},
			similarLocationFound: false,
			similarLocations: []

		}
	},
	methods: {
		addLocation() {
			this.loading = true;
			this.submitStatus = '';
			
			var vm = this;

			if(this.newLocation.name && this.newLocation.address) {
				//Check if an location is currently edited or a new one is created and update the request routes + parameters accordingly.
				let requestType = this.edit?'put':'post'
				let editLocation = this.edit?'/' + this.newLocation._id: '';

				this.$http[requestType](backendUrl + this.apiRoute + editLocation, this.newLocation)
					.then(response => {
						this.emitClose();
						vm.loading = false;
						this.emptyFormFields();

					})
					.catch(err => {
						this.loading = false;
						this.submitStatus = this.edit ?'An error occurred while updating the Location. Please try again!'
										:'An error occurred while creating the Location. Please try again!';
						this.$refs.snackbar.open();
					});
			}
			else {
				this.submitStatus = 'All required input fields have to be filled out!';
				this.$refs.snackbar.open();
				this.loading = false;
			}
    	},
		emitClose() {
			this.$emit('close');
		},
	  	emptyFormFields() {
			this.blankLocation = {
				name: '',
				address: {
					street: '',
					city: '',
					administrative: '',
					country: '',
					postcode: '',
					lat: 0,
					lng: 0,
					value: '',
				},
				information: '',
				website: '',
				facebook_page_url: ''
			};
			this.newLocationValue = '';
		},
		getSimilar() {
			this.similarLocationFound = false;
			if((this.newLocation.address.street || (this.newLocation.address.city && this.newLocation.name)) && this.$route.path.indexOf('/location/') == -1) {
				let requestParams = (this.newLocation.address.city && this.newLocation.name) 
					?`city=${this.newLocation.address.city}&name=${this.newLocation.name}` 
					:`address=${this.newLocation.address.street}`;

				this.$http.get(backendUrl + '/api/locations/similar?' + requestParams)
				.then(response => {
					if (response.body.data) {
						this.similarLocations = response.body.data;
						this.similarLocationFound = true;
						this.$refs.similarLocationDialog.open()
					}
				}).catch(err => {console.log(err);});
			}
		},
		checkSimilar(accept) {
			document.getElementsByClassName(accept ?'yes' :'no')[0].classList.add('selected');
			document.getElementsByClassName(accept ?'yes-icon' :'no-icon')[0].classList.add('selected');
			setTimeout(() => {
				if(accept)
					this.emitClose();

				this.similarLocationFound = false;
				setTimeout(() => {
					this.$refs.similarLocationDialog.close();
					setTimeout(() => {
						document.getElementsByClassName(accept ?'yes' :'no')[0].classList.remove('selected');
						document.getElementsByClassName(accept ?'yes-icon' :'no-icon')[0].classList.remove('selected');
					}, 200);
				},200);
			}, 500);
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.apiRoute = '/api/locations';
			})
			.catch(err => {
			});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newLocation";
</style>
