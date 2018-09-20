<template>
	<div id="new_festival">
		<md-button class="md-icon-button md-accent close-btn" v-on:click="$emit('close')">
  			<md-icon>clear</md-icon>
		</md-button>

		<stepper class="festival-form" :steps="4" v-on:submit="addFestival">
			<h1 slot="headline">New Festival</h1>
			<div slot="step-1">
				<h3>General information</h3>
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Name of the festival</label>
							<md-input v-model="newFestival.title" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h4>Address</h4>
						<p>Always pick one of the suggested cities instead of only writing it into the input field. If the exact city you were looking for does not appear in the suggestions please always pick the closest match.</p>
						<md-input-container>
							<input type="search" ref="address_input" v-model="newFestival.address.value" placeholder="Address of the festival*" required/>
						</md-input-container>
					</md-layout>

					<md-layout md-gutter md-flex="100">
						<md-layout md-flex="100">
							<h4>Genre</h4>
							<p>(You can add up to 3)</p>
						</md-layout>
						<md-layout class="single-genre single-form-field" v-for="(genre, index) in newFestival.genre" :key="index" md-flex="33" md-flex-small="100">
							<md-input-container>
								<v-select class="form-v-select"
										  label="name"
										  :on-change="(selected) => onSelectGenre(selected, index)"
										  :options="backendGenres"
										  v-model="newFestival.genre[index]"
										  placeholder="Select band's genre*">
								</v-select>
							</md-input-container>

							<md-button v-if="newFestival.genre.length > 1" v-on:click="removeFromArray(newFestival.genre,index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove genre</md-tooltip>
							</md-button>
						</md-layout>

						<md-button v-if="newFestival.genre.length < 3" v-on:click="newFestival.genre.push('')" class="md-icon-button md-raised md-accent add-field-btn add-genre-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another genre</md-tooltip>
						</md-button>
					</md-layout>
				</md-layout>
			</div>

			<div slot="step-2">
				<h3>Lineup</h3>
				<div class="single-form-field" v-for="(band, index) in newFestivalEvent.bands" :key="index">
					<md-input-container>
						<v-select class="form-v-select"
									:options="backendBands"
									:on-change="(selected) => onSelectBand(selected, index)"
									v-model="newFestivalEvent.bands[index]"
									placeholder="Select festival's bands*">

									<span slot="no-options">
										Looks like the band you're looking for doesn't exist yet. 
										<b v-on:click="$refs.newBandDialog.open()">Want to add it now?</b>
									</span>
						</v-select>
					</md-input-container>
					<md-button v-on:click="removeBand(index)" class="md-icon-button md-raised">
						<md-icon>clear</md-icon>
						<md-tooltip>Remove band</md-tooltip>
					</md-button>
				</div>
				
				<md-button v-if="newFestivalEvent.bands != null" v-on:click="newFestivalEvent.bands.push('')" class="md-icon-button md-raised md-accent add-field-btn">
					<md-icon>add</md-icon>
					<md-tooltip md-direction="right">Add another band</md-tooltip>
				</md-button>
			</div>

			<div slot="step-3">
				<h3>When does the festival happen?</h3>

				<!-- <p class="date-select">{{newFestival.title}} 
					<md-input-container>
						<label>Year</label>
						<md-input min="1960" max="3000" type="number" v-model="newFestival.description"></md-input>
					</md-input-container>
					is happening from
					<datetime v-model="newFestivalEvent.startDate"></datetime>
					to
					<datetime v-model="newFestivalEvent.endDate"></datetime>
				</p> -->
				<!-- <div class="datepickers">
					<div class="from-picker">
						<p>From</p>
						<datepicker v-model="newFestivalEvent.startDate"  :inline="true"></datepicker>
					</div>
					<div class="to-picker">
						<p>To</p>
						<datepicker v-model="newFestivalEvent.endDate" :inline="true" :disabledDates="disabledDates"></datepicker>
					</div>
				</div> -->

				<div class="datepicker-trigger">
					<input
						type="text"
						style="visibility:hidden;"
						id="datepicker-trigger"
						placeholder="Select dates"
						:value="'fisch'"
					>

					<AirbnbStyleDatepicker
						:trigger-element-id="'datepicker-trigger'"
						:mode="'range'"
						:inline="true"
						:showActionButtons="false"
						:date-one="newFestivalEvent.startDate"
						:date-two="newFestivalEvent.endDate"
						@date-one-selected="val => { newFestivalEvent.startDate = val }"
						@date-two-selected="val => { newFestivalEvent.endDate = val }"
					/>
				</div>
			</div>

			<div slot="step-4">
				<h3>Additional information</h3>
				<md-layout md-gutter>
					<md-layout md-flex="100">
						<md-input-container>
							<label>Description</label>
							<md-textarea v-model="newFestival.description"></md-textarea>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Ticket Link</label>
							<md-input v-model="newFestival.ticketLink"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Website</label>
							<md-input v-model="newFestival.websiteUrl"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Facebook page</label>
							<md-input v-model="newFestival.facebookUrl"></md-input>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>
		</stepper>
	</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import places from 'places.js';
import moment from 'moment';
import {frontEndSecret, backendUrl} from '@/secrets.js';
import Stepper from '@/Components/Stepper';

export default {
	name: 'new-festival',
	components: {
		Stepper,
		Datepicker
	},
	data() {
		return {
			newFestival: {
				title: '',
				description: '',
				genre: [''],
				address: {},
				ticketLink: '',
				website: '',
				facebookUrl: ''
			},
			newFestivalEvent: {
				title: '',
				startDate: '',
				endDate: '',
				bands: ['']
			},
			backendBands: [],
			backendGenres: [],
			festivalEventYear: '',
			dateRange: [],
		}
	},
	methods: {
		addFestival() {
			console.log(this.newFestivalEvent);
			return;
			this.newFestivalEvent.title = this.newFestival.title + ' ' + moment(this.newFestivalEvent.startDate).format('YYYY');

			for (let index in this.newFestival.genre) {
				if(this.newFestival.genre[index].name)
					this.newFestival.genre[index] = this.newFestival.genre[index].name;
				else
					this.newFestival.genre.splice(index, 1);
			}

			for(let index in this.newFestivalEvent.bands) {
				if(this.newFestivalEvent.bands[index]._id) 
					this.newFestivalEvent.bands[index] = this.newFestivalEvent.bands[index]._id
				else
					this.newFestivalEvent.bands.splice(index, 1)
			}

			let requestBody = {
				festival: this.newFestival,
				event: this.newFestivalEvent
			}			
 
			this.$http.post(backendUrl + '/api/unvalidated-festivals', requestBody)
				.then(response => {
					console.log(response);
					
				})
				.catch(err => {
					console.log(err);
					
				})
		},
		onSelectGenre(selected, index) {
			this.newFestival.genre[index] = selected;
			if(selected != '') {
				if(this.newFestival.genre.reduce((acc, cur) => (acc != '' && cur != ''))) {
					if(this.newFestival.genre.length < 3)
						this.newFestival.genre.push('');
				}
			}
		},
		onSelectBand(selected, index) {			
			this.newFestivalEvent.bands[index] = selected;
			if(selected != '') {
				if(this.newFestivalEvent.bands.reduce((acc, cur) => (acc != '' && cur != '')))
					this.newFestivalEvent.bands.push('');
			}
		},
		removeFromArray(array, index) {
			array.splice(index, 1);
			
			if(array.length == 0) {
				array[0] = '';
			}
		},
		getBandOptions() {
			this.$http.get(backendUrl + "/api/bands")
				.then(response => {
					this.backendBands = response.body.data;
					for(let band of this.backendBands) {
						band.label = band.name + ' - ' + band.origin.country;
					}
				})
				.catch(err => {});
		},
		getDisabledDates() {
			// disables every day of a month which is a multiple of 3
            if (date.getDate() % 3 === 0) {
              return true
            }
		}
	},
	mounted() {
		this.getBandOptions();

		this.$http.get(backendUrl + '/api/genres')
			.then(response => {				
				this.backendGenres = response.body.data;
			})
			.catch(err => console.log("Error in BandForm:", err));

		this.placesAutocomplete = places({container: this.$refs.address_input, type: 'address'});
		this.placesAutocomplete.on('change', e => {
			this.newFestival.address.street = e.suggestion.name;
			this.newFestival.address.city = e.suggestion.city;
			this.newFestival.address.administrative = e.suggestion.administrative;
			this.newFestival.address.country = e.suggestion.country;
			this.newFestival.address.postcode = e.suggestion.postcode;
			this.newFestival.address.lat = e.suggestion.latlng.lat;
			this.newFestival.address.lng = e.suggestion.latlng.lng;
			this.newFestival.address.value = e.suggestion.value;
			// this.value = e.suggestion.value ?e.suggestion.value :this.value;
		});
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_newFestival.scss";
</style>
