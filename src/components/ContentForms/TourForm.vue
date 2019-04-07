<template>
  <div id="tour_form">
	  <form v-on:submit.prevent>
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Title</label>
							<md-input v-model="data.name" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Lineup for this event</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-form-field" v-for="(band, index) in data.bands" :key="index">
							<!-- <md-input-container>
								<v-select class="form-v-select"
										  :options="backendBands"
										  :on-change="(selected) => onSelectBand(selected, index)"
										  v-model="selectedBands[index]"
										  placeholder="Select event's bands*">

										  	<span slot="no-options">
												Looks like the band you're looking for doesn't exist yet. 
												<b v-on:click="$refs.newBandDialog.open()">Want to add it now?</b>
											</span>
								</v-select>
							</md-input-container> -->
							
							<search-select label="name"
										  :options="backendBands"
										  v-on:change="(selected) => onSelectBand(selected, index)"
										  v-model="selectedBands[index]"
										  placeholder="Select event's bands*">

								<span slot="no-options">
									Looks like the band you're looking for doesn't exist yet. 
									<b v-on:click="$refs.newBandDialog.open()">Want to add it now?</b>
								</span>
							</search-select>
							<md-button v-on:click="removeBand(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove band</md-tooltip>
							</md-button>
							<p class="not-verified-warning" v-if="band && band.isValidated == false">
								<md-icon>error_outline</md-icon>
								This Band is not validated yet.
							</p>
						</div>

						<md-button v-if="data.bands != null" v-on:click="addBand" class="md-icon-button md-raised md-accent add-field-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another band</md-tooltip>
						</md-button>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Tourstops</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="tourstop single-form-field" v-for="(tourstop, index) in data.tourStops" :key="index">
							<!-- <md-input-container>
								<v-select class="form-v-select"
										  :options="backendLocations"
										  :on-change="(selected) => selectionHandler(selected, index)"
										  v-model="selectedLocations[index]"
										  placeholder="Select event location*">
											
											<span slot="no-options">
												Looks like the location you're looking for doesn't exist yet. 
												<b v-on:click="$refs.newLocationDialog.open()">Want to add it now?</b>
											</span>
								</v-select>
							</md-input-container> -->
							<search-select :options="backendLocations"
										  v-on:change="(selected) => selectionHandler(selected, index)"
										  v-model="selectedLocations[index]"
										  placeholder="Select event location*">
								
								<span slot="no-options">
									Looks like the location you're looking for doesn't exist yet. 
									<b v-on:click="$refs.newLocationDialog.open()">Want to add it now?</b>
								</span>
							</search-select>
							<div class="picker">
								<md-icon>date_range</md-icon>
								<datetime v-model="tourstop.date" placeholder="Select date*" type="date"></datetime>
							</div>
							<md-button v-on:click="removeTourStop(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove tourstop</md-tooltip>
							</md-button>
						</div>

						<md-button v-if="backendLocations != null" v-on:click="addTourStop" class="md-icon-button md-raised md-accent add-field-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another tourstop</md-tooltip>
						</md-button>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Additional Information</h2>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Ticket Link</label>
							<md-input v-model="data.ticketLink"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Description</label>
							<md-textarea v-model="data.description"></md-textarea>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>
		</form>

		<md-dialog ref="newBandDialog">
			<new-band 
					v-on:close="$refs['newBandDialog'].close()"
					v-on:success="updateContent('newBandDialog')">
			</new-band>
		</md-dialog>

		<md-dialog ref="newLocationDialog">
			<new-location 
					v-on:close="$refs['newLocationDialog'].close()"
					v-on:success="updateContent('newLocationDialog')">
			</new-location>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span>New {{createdContent}} successfully created! <br> <b>It will be visible for everyone after it was verified by us.</b></span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
  	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import { getBandOptions, getLocationOptions } from '@/helpers/backend-getters.js';

import NewBand from "@/components/NewContent/NewBand";
import NewLocation from "@/components/NewContent/NewLocation";
import SearchSelect from '@/components/Utilities/SearchSelect';

export default {
	name: 'event-form',
	components: {
		NewBand,
		NewLocation,
		SearchSelect
	},
	props: {
		data: Object,
		selectedLocations: Array
	},
	data() {
		return {
			backendLocations: [],
			backendBands: [],
			selectedBands: [],
			createdContent: ''
		}
	},
	methods: {
		selectionHandler(selected, index) {
			//Set the value for the item that will be displayed in the search select input
			this.selectedLocations[index] = selected;
			//Set the new Event's location attribute to the ID of the selected location
			if(selected._id) {
				this.data.tourStops[index].location = selected._id;
			}
		},
		onSelectBand(selected, index) {
			//Set the value for the item that will be displayed in the search select input
			this.selectedBands[index] = selected;
			//Set the new Event's location attribute to the ID of the selected location
			
			if(selected._id) {
				this.data.bands[index] = selected._id;
			}

			if(selected != '') {
				if(this.selectedBands.reduce((acc, cur) => (acc != '' && cur != '')))
					this.addBand();
			}
		},
		addBand() {
			this.data.bands.push('');
			this.selectedBands.push('');
		},
		removeBand(index) {
			this.data.bands.splice(index, 1);
			this.selectedBands.splice(index,1);
			
			if(this.data.bands.length == 0) {
				this.data.bands[0] = '';
			}
		},
		addTourStop() {
			this.data.tourStops.push({
				location: '',
				date: ''
			});
		},
		removeTourStop(index) {
			this.data.tourStops.splice(index, 1);
			this.selectedLocations.splice(index, 1);

			if(this.data.tourStops.length == 0) {
				this.data.tourStops[0] = {
					location: '',
					date: ''
				};

				this.selectedLocations[0] = '';
			}
		},
		updateContent(dialog) {
			this.$refs[dialog].close();

			if(dialog == 'newBandDialog') {
				this.createdContent = 'band';
				getBandOptions()
					.then(data => this.backendBands = data)
					.catch(err => console.log(err));
			}
			else {
				this.createdContent = 'location';
				getLocationOptions()
					.then(data => this.backendLocations = data)
					.catch(err => console.log(err));
			}

			this.$refs.snackbar.open();
		}
	},
	mounted() {
		getLocationOptions()
			.then(data => this.backendLocations = data)
			.catch(err => console.log(err));
		
		getBandOptions()
			.then(data => this.backendBands = data)
			.catch(err => console.log(err));
	},
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_tourForm.scss";
</style>
