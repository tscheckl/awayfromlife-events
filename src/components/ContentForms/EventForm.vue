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

					<md-layout class="event-location" md-flex="50" md-flex-small="100">
						<search-select :options="backendLocations"
										v-on:change="onSelectLocation"
										v-model="event.location"
										placeholder="Select event location*">

							<span slot="no-options">
								Looks like the location you're looking for doesn't exist yet. 
								<b v-on:click="$refs.newLocationDialog.open()">Want to add it now?</b>
							</span>
						</search-select>
						<p class="not-verified-warning" v-if="event.location && event.location.isValidated == false">
							<md-icon>error_outline</md-icon>
							This Location is not validated yet.
						</p>
					</md-layout>

					<image-step 
						v-model="value"						
						:imageSource="event.imageSource" 
						v-on:sourceChange="changeImageSource"
					></image-step>

					<md-layout md-flex="100">
						<h2>Lineup for this event</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-form-field" v-for="(band, index) in localBands" :key="index">
							<search-select :options="backendBands"
										  v-on:change="(selected) => onSelectBand(selected, index)"
										  v-model="localBands[index]"
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
							<p class="not-verified-warning" v-if="localBands[index] && localBands[index].isValidated == false">
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
						<md-layout md-flex="100" v-if="createEvent">
							<h2>Date of the event</h2>
						</md-layout>

						<md-layout md-flex="100">
							<div class="datepicker-trigger">
								<md-input-container>
									<label>Date</label>
									<md-input id="datepicker-trigger" v-model="event.date" required></md-input>
								</md-input-container>

								<AirbnbStyleDatepicker
									:trigger-element-id="'datepicker-trigger'"
									:offsetY="-300"
									:mode="'single'"
									:showActionButtons="false"
									:date-one="event.date"
									@date-one-selected="val => { event.date = val }"
								/>
							</div>
						</md-layout>
					</md-layout>
				</md-layout>
			</div>
		</form>

		<md-button v-if="canSubmit" :disabled="event.bands.every(band => !band.isValidated)" type="submit" v-on:click="$emit('submit', event)" class="md-raised md-accent submit-button">Update event</md-button>
		<span class="not-verifiable" v-if="event.bands.every(band => !band.isValidated)">Event can not be updated, as it only contains bands that are not verified yet.</span>

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
import ImageStep from "@/components/NewContent/ImageStep";
import SearchSelect from '@/components/Utilities/SearchSelect';

export default {
	name: 'event-form',
	components: {
		NewBand,
		NewLocation,
		ImageStep,
		SearchSelect
	},
	props: {
		event: Object,
		value: [String, Object, File],
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
		},
		value() {
			this.$emit('input', this.value);
		}
	},
	methods: {
		onSelectLocation(selected) {
			//Set the new Event's location attribute to the ID of the selected location
			this.event.location = selected;

			if(this.event.location.isValidated == false) {
				this.event.verifiable = false;
			}
			else {
				if(!this.localBands.every(band => band.isValidated == undefined || (band.isValidated != undefined && band.isValidated != false)))
					this.event.verifiable = false;
				else
					this.event.verifiable = true;
			} 
				
		},
		onSelectBand(selected, index) {		
			//Select band into localBands array so that Vue detects the change.
			this.localBands.splice(index, 1, selected);

			if(selected != '') {				
				if(!this.localBands.every(band => band.isValidated == undefined || (band.isValidated != undefined && band.isValidated != false))) {
					this.event.verifiable = false;
				}
				else {
					if(this.event.location.isValidated == false)
						this.event.verifiable = false;
					else
						this.event.verifiable = true;
				}

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
		changeImageSource(value) {
			this.event.imageSource = value;
		}
	},
	mounted() {
		let getUnverified = !this.edit;

		getLocationOptions(getUnverified)
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
