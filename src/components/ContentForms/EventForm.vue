<template>
  <div id="event_form">
	  <form class="new-event-form" v-on:submit.prevent>
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Title</label>
							<md-input v-model="event.title" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<v-select :options="locations"
									:on-change="onSelectLocation"
									v-model="event.location"
									placeholder="Select event location*">
							</v-select>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Lineup for this event</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-band" v-for="(band, index) in localBands" :key="index">
							<md-input-container>
								<v-select :options="backendBands"
											:on-change="(selected) => onSelectBand(selected, index)"
											v-model="localBands[index]"
											placeholder="Select event's bands*">
								</v-select>
							</md-input-container>
							<md-button v-on:click="removeBand(index)" class="md-icon-button md-raised">
								<md-icon>clear</md-icon>
								<md-tooltip>Remove band</md-tooltip>
							</md-button>
						</div>

						<md-button v-if="event.bands != null" v-on:click="addBand" class="md-icon-button md-raised md-accent add-band-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another band</md-tooltip>
						</md-button>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Description</label>
							<md-textarea v-model="event.description"></md-textarea>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<div class="picker">
							<md-icon>date_range</md-icon>
							<datetime v-if="!edit || edit && event.startDate" v-model="event.startDate" placeholder="Select date*" type="datetime"></datetime>
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
		event: Object,
		edit: {
			type: Boolean,
			default: false
		},
		resetForm: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			locations: [],
			backendBands: [],
			localBands: []
		}
	},
	watch: {
		event() {
			console.log("ÄNDERUNG");
			
			this.localBands = this.event.bands;
		}
	},
	methods: {
		onSelectLocation(selected) {
			//Set the new Event's location attribute to the ID of the selected location
			this.event.location = selected;
		},
		onSelectBand(selected, index) {
			this.localBands[index] = selected;
		},
		addBand() {
			this.localBands.push('');
		},
		removeBand(index) {
			this.localBands.splice(index, 1);
			
			if(this.localBands.length == 0) {
				this.localBands[0] = '';
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

		this.localBands = this.event.bands;
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_eventForm.scss";
</style>
