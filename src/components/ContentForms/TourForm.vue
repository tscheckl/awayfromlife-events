<template>
  <div id="tour_form">
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
							<md-input-container>
								<v-select :options="locations"
											:on-change="(selected) => selectionHandler(selected, index)"
											v-model="selectedLocations[index]"
											placeholder="Select event location*">
								</v-select>
							</md-input-container>
							<div class="picker">
								<md-icon>date_range</md-icon>
								<datetime v-model="tourstop.startDate" placeholder="Datum wählen*" type="datetime" input-format="DD-MM-YYYY HH:mm"></datetime>
							</div>
							<md-button v-on:click="removeTourStop(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Diesen Tourstop entfernen</md-tooltip>
							</md-button>
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
import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'event-form',
	props: {
		data: Object,
		selectedLocations: Array
	},
	data() {
		return {
			locations: [],
			template: LocationSelectionListItem,
			items: []
		}
	},
	methods: {
		selectionHandler(selected, index) {
			//Set the value for the item that will be displayed in the search select input
			this.selectedLocations[index] = selected;
			//Set the new Event's location attribute to the ID of the selected location
			this.data.tourStops[index].location = selected['_id'];
			this.items = this.locations;
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
			});
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
				console.log(this.locations);
				for(let location of this.locations) {
					location.label = location.name + ' - ' + location.address;
				}
			})
			.catch(err => {
				console.log(err);
			});
	},
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_tourForm.scss";
</style>
