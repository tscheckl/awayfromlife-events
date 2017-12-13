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
							<list-select :list="locations"
												option-value="_id"
												option-text="name"
												:custom-text="nameAndAddress"
												:selected-item="selectedLocation"
												placeholder="Select event location*"
												@select="onSelect">
							</list-select>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-band" v-for="(band, index) in bands" :key="index">
							<md-input-container>
								<label>Bandname</label>
								<md-input v-on:blur="updateBands" v-model="band.name"></md-input>
							</md-input-container>
							<md-button v-on:click="removeBand(index)" class="md-icon-button md-raised">
								<md-icon>remove</md-icon>
							</md-button>
						</div>

						<md-button v-on:click="addBand" class="md-icon-button md-raised md-accent add-band-btn">
							<md-icon>add</md-icon>
						</md-button>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Description</label>
							<md-textarea v-model="data.description" required></md-textarea>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<div class="picker">
							<label>Date</label>
							<datepicker :option="timeoption" :date="data.startDate"></datepicker>
						</div>
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
	watch: {
		data() {
			if(this.data.bands) {
				for(let i = 0; i < this.data.bands.length; i++) {
					this.bands[i] = {
						name: this.data.bands[i]
					};
				}
			}
			else {
				return {
					name: ''
				}
			}
		}
	},
	props: {
		data: Object,
		selectedLocation: {}
	},
	data() {
		return {
			locations: [],
			//Variable for the search-select that contains the currently selected item/location
			//selectedLocation: {},
			//Time options for the datepicker
			timeoption: {
				type: 'min',
				week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
				month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				format: 'YYYY/MM/DD HH:mm'
			},
			bands: []
		}
	},
	methods: {
		nameAndAddress(selectedLocation) { //Function to format the value that is displayed in the search-select
			return `${selectedLocation.name} - ${selectedLocation.address}`;
		},
		onSelect(selected) {
			//Set the value for the item that will be displayed in the search select input
			this.selectedLocation = selected;
			//Set the new Event's location attribute to the ID of the selected location
			this.data.location = selected['_id'];
		},
		addBand() {
			this.bands.push({
				name: ''
			});
			
			this.updateBands();
		},
		removeBand(index) {
			this.bands.splice(index, 1);
			
			if(this.bands.length == 0) {
				this.bands[0] = {
					name: ''
				};
			}

			this.updateBands();
		},
		updateBands() {
			this.data.bands = [''];
			for(let i = 0; i < this.bands.length; i++) {
				this.data.bands[i] = this.bands[i].name;
			}
		}
	},
	mounted() {
		this.$http.get(backendUrl + "/api/locations")
			.then(response => {
				this.locations = response.body;
			})
			.catch(err => {
				console.log(err);
			});
		console.log("Eventform data: ", this.data);
	}
}
</script>

<style lang="scss">
	@import "../scss/_eventForm.scss";
</style>
