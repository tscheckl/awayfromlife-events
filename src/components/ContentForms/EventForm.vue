<template>
  <div id="event_form">
		<md-button v-if="canSubmit" class="md-icon-button md-accent close-btn" v-on:click="$emit('close')">
			<md-icon>clear</md-icon>
		</md-button>

		<slot name="headline"></slot>
		
	  	<form class="new-event-form" v-on:submit.prevent>
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Title</label>
							<md-input v-model="event.name" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<v-select class="form-v-select"
							 		  :options="backendLocations"
									  :on-change="onSelectLocation"
									  v-model="event.location"
									  placeholder="Select event location*">

									  	<span slot="no-options">
											Looks like the location you're looking for doesn't exist yet. 
											<b v-on:click="$refs.newLocationDialog.open()">Want to add it now?</b>
										</span>
							</v-select>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Lineup for this event</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-form-field" v-for="(band, index) in localBands" :key="index">
							<md-input-container>
								<v-select class="form-v-select"
										  :options="backendBands"
										  :on-change="(selected) => onSelectBand(selected, index)"
										  v-model="localBands[index]"
										  placeholder="Select event's bands*">

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
							<p class="not-verified-warning" v-if="band.isValidated == false">
								<md-icon>error_outline</md-icon>
								This Band is not validated yet.
							</p>
						</div>

						<md-button v-if="event.bands != null" v-on:click="addBand" class="md-icon-button md-raised md-accent add-field-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another band</md-tooltip>
						</md-button>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Additional Information</h2>
					</md-layout>

					<md-layout md-flex="100">
						<md-input-container>
							<label>Ticket Link</label>
							<md-input v-model="event.ticketLink"></md-input>
						</md-input-container>
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
							<datetime v-if="!edit || edit && event.date" v-model="event.date" placeholder="Select date*" type="date"></datetime>
						</div>
					</md-layout>
				</md-layout>
			</div>
		</form>

		<md-button v-if="canSubmit" type="submit" v-on:click="$emit('submit', event)" class="md-raised md-accent submit-button">Update event</md-button>

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

export default {
	name: 'event-form',
	components: {
		NewBand,
		NewLocation,
	},
	props: {
		event: Object,
		edit: {
			type: Boolean,
			default: false
		},
		resetForm: {
			type: Boolean,
			default: false
		},
		canSubmit: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			backendLocations: [],
			backendBands: [],
			localBands: [],
			createdContent: ''
		}
	},
	watch: {
		event() {
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
			if(selected != '') {
				if(this.localBands.reduce((acc, cur) => (acc != '' && cur != '')))
					this.addBand();
			}
		},
		addBand() {
			this.localBands.push('');
		},
		removeBand(index) {
			this.localBands.splice(index, 1);
			
			if(this.localBands.length == 0)
				this.localBands[0] = '';
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
		},
	},
	mounted() {
		getLocationOptions()
			.then(data => this.backendLocations = data)
			.catch(err => console.log(err));
		
		getBandOptions()
				.then(data => this.backendBands = data)
				.catch(err => console.log(err));

		this.localBands = this.event.bands;
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_eventForm.scss";
</style>
