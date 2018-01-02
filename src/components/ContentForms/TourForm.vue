<template>
  <div id="event_form">
	  <form v-on:submit.prevent>
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Titel</label>
							<md-input v-model="data.title" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Bands die bei diesem Event auftreten</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-band" v-for="(band, index) in data.bands" :key="index">
							<md-input-container>
								<label>Bandname</label>
								<md-input v-model="data.bands[index]"></md-input>
							</md-input-container>
							<md-button v-on:click="removeBand(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Diese Band entfernen</md-tooltip>
							</md-button>
						</div>

						<md-button v-if="data.bands != null" v-on:click="addBand" class="md-icon-button md-raised md-accent add-band-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Weitere Band hinzufügen</md-tooltip>
						</md-button>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Tourstopps</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="tourstop" v-for="(tourstop, index) in data.tourStops" :key="index">
							<list-select :list="locations"
												option-value="_id"
												option-text="name"
												:custom-text="nameAndAddress"
												:selected-item="selectedLocationsss[index]"
												placeholder="Select event location*"
												@select="selected => selectionHandler(selected, index)">
							</list-select>
							<div class="picker">
								<md-icon>date_range</md-icon>
								<datetime v-model="tourstop.startDate" placeholder="Datum wählen" type="datetime" input-format="DD-MM-YYYY HH:mm"></datetime>
							</div>
						</div>

						<md-button v-if="locations != null" v-on:click="addTourStop" class="md-icon-button md-raised md-accent add-band-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Weiteren Tourstop hinzufügen</md-tooltip>
						</md-button>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Beschreibung</label>
							<md-textarea v-model="data.description"></md-textarea>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>
		</form>
  	</div>
</template>

<script>
import { ListSelect  } from 'vue-search-select';

import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'event-form',
	components: {
		ListSelect
	},
	props: {
		data: Object,
		selectedLocations: [{name: 'fisch'}]
	},
	data() {
		return {
			locations: [],
			selectedLocationsss: [{}]
		}
	},
	methods: {
		nameAndAddress(selectedLocation) { //Function to format the value that is displayed in the search-select
			return `${selectedLocation.name} - ${selectedLocation.address}`;
		},
		selectionHandler(selected, index) {
			//Set the value for the item that will be displayed in the search select input
			this.selectedLocationsss[index] = selected;
			//Set the new Event's location attribute to the ID of the selected location
			this.data.tourStops[index].location = selected['_id'];
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
		addTourStop() {
			this.data.tourStops.push({
				location: '',
				startDate: ''
			})
		},
		removeTourStop(index) {
			this.data.tourStops.splice(index, 1);

			if(this.data.tourStops.length == 0) {
				this.data.tourStops[0] = {
					location: '',
					startDate: ''
				}
			}
		},
	},
	mounted() {
		this.$http.get(backendUrl + "/api/locations")
			.then(response => {
				this.locations = response.body;
			})
			.catch(err => {
				console.log(err);
			});
	},
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_eventForm.scss";
</style>
