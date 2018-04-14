<template>
  <div id="event_form">
	  <form v-on:submit.prevent>
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Title</label>
							<md-input v-model="data.title" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<v-select :options="locations"
									:on-change="onSelectLocation"
									v-model="selectedLocation"
									placeholder="Select event location*">
							</v-select>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Lineup for this event</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-band" v-for="(band, index) in data.bands" :key="index">
							<md-input-container>
								<v-select :options="backendBands"
											:on-change="(selected) => onSelectBand(selected, index)"
											v-model="selectedBands[index]"
											placeholder="Select event's bands*">
								</v-select>
							</md-input-container>
							<md-button v-on:click="removeBand(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove band</md-tooltip>
							</md-button>
						</div>

						<md-button v-if="data.bands != null" v-on:click="addBand" class="md-icon-button md-raised md-accent add-band-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another band</md-tooltip>
						</md-button>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Description</label>
							<md-textarea v-model="data.description"></md-textarea>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<div class="picker">
							<md-icon>date_range</md-icon>
							<datetime v-model="data.startDate" placeholder="Select date*" type="datetime" input-format="DD-MM-YYYY HH:mm"></datetime>
						</div>
					</md-layout>
				</md-layout>
			</div>
		</form>
  	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'event-form',
	props: {
		data: Object,
		selectedLocation: {},
		selectedBands: Array
	},
	data() {
		return {
			locations: [],
			//Variable for the search-select that contains the currently selected item/location
			//selectedLocation: {},
			bands: [],
			backendBands: []
		}
	},
	methods: {
		onSelectLocation(selected) {
			//Set the value for the item that will be displayed in the search select input
			this.selectedLocation = selected;
			//Set the new Event's location attribute to the ID of the selected location
			this.data.location = selected['_id'];
		},
		onSelectBand(selected, index) {
			//Set the value for the item that will be displayed in the search select input
			this.selectedBands[index] = selected;
			//Set the new Event's location attribute to the ID of the selected location
			
			if(selected._id) {
				this.data.bands[index] = selected._id;
			}
		},
		addBand() {
			this.data.bands.push('');
		},
		removeBand(index) {
			this.data.bands.splice(index, 1);
			
			if(this.data.bands.length == 0) {
				this.data.bands[0] = '';
			}
		},
	},
	mounted() {
		this.$http.get(backendUrl + "/api/locations")
			.then(response => {
				this.locations = response.body.data;
				for(let location of this.locations) {
					location.label = location.name + ' - ' + location.address.city;
				}
			})
			.catch(err => {});

		this.$http.get(backendUrl + "/api/bands")
			.then(response => {
				this.backendBands = response.body.data;
				for(let band of this.backendBands) {
					band.label = band.name + ' - ' + band.origin.country;
				}
			})
			.catch(err => {});

	},
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_eventForm.scss";
</style>
