<template>
	<div id="festival_event_form">
		<slot name="headline"></slot>
		
		<form class="new-festival-event-form" v-on:submit.prevent>
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Title</label>
							<md-input v-model="data.title" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>When does the festival happen? </h2>
					</md-layout>

					<div class="festival-date">
						<p class="heading-additional-info">(You can select a date range)</p>
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
								:date-one="data.startDate"
								:date-two="data.endDate"
								@date-one-selected="val => { data.startDate = val }"
								@date-two-selected="val => { data.endDate = val }"
							/>
						</div>
					</div>

					<md-layout md-flex="100">
						<h2>Lineup</h2>
					</md-layout>

					<md-layout md-flex="100">
						<div class="single-form-field" v-for="(band, index) in data.bands" :key="index">
							<md-input-container>
								<v-select class="form-v-select"
										  :options="backendBands"
										  :on-change="(selected) => onSelectBand(selected, index)"
										  v-model="data.bands[index]"
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
						</div>

						<md-button v-if="data.bands != null" v-on:click="addBand" class="md-icon-button md-raised md-accent add-field-btn">
							<md-icon>add</md-icon>
							<md-tooltip md-direction="right">Add another band</md-tooltip>
						</md-button>
					</md-layout>
				</md-layout>
			</div>

			<md-button v-if="canSubmit" type="submit" v-on:click="$emit('submit', data)" class="md-raised md-accent submit-button">Update Festival Event</md-button>
		</form>

		<md-dialog ref="newBandDialog">
			<new-band 
					v-on:close="$refs['newBandDialog'].close()"
					v-on:success="updateContent('newBandDialog')">
			</new-band>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span>New Band successfully created! <br> <b>It will be visible for everyone after it was verified by us.</b></span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import NewBand from "@/Components/NewContent/NewBand";

export default {
	name: 'festival-event-form',
	components: {
		NewBand
	},
	props: {
		data: Object,
		canSubmit: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			backendBands: [],
		}
	},
	methods : {		
		onSelectBand(selected, index) {			
			this.data.bands[index] = selected;
			if(selected != '') {
				if(this.data.bands.reduce((acc, cur) => (acc != '' && cur != '')))
					this.addBand();
			}
		},
		addBand() {
			this.data.bands.push('');
		},
		removeBand(index) {
			this.data.bands.splice(index, 1);
			
			if(this.localBands.length == 0)
				this.localBands[0] = '';
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
		updateContent(dialog) {
			this.$refs[dialog].close();
		
			this.getBandOptions();

			this.$refs.snackbar.open();
		},
	},
	mounted() {
		this.getBandOptions();
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_festivalEventForm.scss";
</style>
