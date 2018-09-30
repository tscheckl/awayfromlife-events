<template>
	<div id="admin">
		<div class="admin-content">
			<div class="verify-list">
				<div class="admin-buttons">
					<md-button v-on:click="openDialog('changePwdDialog')">
						<md-icon>lock_outline</md-icon>
						<md-tooltip md-direction="bottom">Change password</md-tooltip>
					</md-button>

					<md-button v-on:click="logout">
						<md-icon>exit_to_app</md-icon>
						<md-tooltip md-direction="bottom">Logout</md-tooltip>
					</md-button>
				</div>
				
				<h1>Admin Console</h1>
				
				<md-input-container>
					<md-select name="content-type" v-model="currentCategory" v-on:selected="getUnvalidatedData">
						<md-option value="unverified Events">Events</md-option>
						<md-option value="unverified Festivals">Festivals</md-option>
						<md-option value="unverified Locations">Locations</md-option>
						<md-option value="unverified Bands">Bands</md-option>
						<md-option value="reports">Reported content</md-option>
						<md-option value="cancellations">Cancelled events</md-option>
					</md-select>
				</md-input-container>

				<md-list>
					<div v-if="unverifiedContent.length > 0">
						<md-list-item v-for="(data, index) in unverifiedContent" :key="index" @click="showInfo(unverifiedContent, index)">
							<h4 v-if="currentCategory != 'reports' && currentCategory != 'unverified Festivals'">{{data.title ?data.title :data.name}}</h4>
							<h4 v-if="currentCategory == 'unverified Festivals'">{{data.event.title}}</h4>
							<span v-if="currentCategory != 'reports' && currentCategory != 'unverified Festivals'">{{currentCategory}}</span>
							<span v-if="currentCategory == 'unverified Festivals'">{{data.validated ?'unverified Festival Events' :'unverified Festivals'}}</span>
							
							<h4 v-if="currentCategory == 'reports'">{{data.item.title ?data.item.title :data.item.name}}</h4>
							<span v-if="currentCategory == 'reports'">{{data.category}}</span>
						</md-list-item>		
					</div>
					<h4 class="nothing-found-msg" v-if="unverifiedContent.length == 0">No {{currentCategory}} available!</h4>
					
					<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>
				</md-list>
			</div>

			<div class="verify-info">
				<md-button class="md-icon-button md-accent close-btn" v-on:click="closeInfo">
					<md-icon>clear</md-icon>
				</md-button>

				<h1>Given data</h1>
				<event-form v-if="currentCategory == 'unverified Events' && unverifiedContent.length > 0" :event="verifyData" :edit="false"></event-form>

				<div class="verify-festival" v-if="currentCategory == 'unverified Festivals' && unverifiedContent.length > 0">
					<h2 v-if="!verifyData.validated">Unvalidated Festival</h2>
					<festival-form v-if="!verifyData.validated" :data="verifyData.festival"></festival-form>
					<h2 v-if="verifyData.validated">Associated Festival</h2>
					<div class="report-target" v-if="verifyData.validated">
						<a :href="`/festivals/${verifyData.festival.url}`" target="_blank">
							{{verifyData.festival.title}} <md-icon>keyboard_arrow_right</md-icon>
							<md-tooltip>open festival's page in new tab</md-tooltip>
						</a>
					</div>
					<h2>Unverified Festival Instance</h2>
					<festival-event-form :data="verifyData.event"></festival-event-form>
				</div>

				<location-form v-if="currentCategory == 'unverified Locations' && unverifiedContent.length > 0" :data="verifyData"></location-form>

				<band-form v-if="currentCategory == 'unverified Bands' && unverifiedContent.length > 0" :data="verifyData"></band-form>

				<div class="report-form" v-if="currentCategory == 'reports' && unverifiedContent.length > 0">
					<h2>Reported {{verifyData.category}}:</h2>
					<div class="report-target">
						<a :href="`/${verifyData.category}/${verifyData.item.url}`" target="_blank">
							{{verifyData.item.title ?verifyData.item.title :verifyData.item.name}} <md-icon>keyboard_arrow_right</md-icon>
							<md-tooltip>open {{verifyData.category}}'s page in new tab</md-tooltip>
						</a>
					</div>
					<h2>User's reason for report:</h2>
					<p>{{verifyData.description}}</p>

					<div class="control-buttons">
						<button class="md-button md-raised dismiss-btn" v-on:click="handleVerify(false)">dismiss report</button>
						<button class="md-button md-raised delete-btn" v-on:click="handleVerify(true)">delete {{verifyData.category}}</button>
					</div>
				</div>

				<div class="cancellation-form" v-if="currentCategory == 'cancellations' && unverifiedContent.length > 0">
					<h2>Event that was reported as cancelled:</h2>
					
					<event-page></event-page>
					<div class="control-buttons">
						<button class="md-button md-raised dismiss-btn" v-on:click="confirmCancellation(true)">confirm cancellation</button>
						<button class="md-button md-raised delete-btn" v-on:click="confirmCancellation(false)">dismiss cancellation</button>
					</div>
				</div>
				
				<div v-if="unverifiedContent.length > 0 && currentCategory != 'reports' && currentCategory != 'cancellations'" >
					<md-button type="submit" v-on:click="handleVerify(true)" class="md-accent verify-btn">
						<md-icon>check</md-icon>
						<md-tooltip md-direction="top">Keep and activate entry</md-tooltip>
					</md-button>

					<md-button type="submit" v-on:click="handleVerify(false)" class="md-accent delete-btn">
						<md-icon>clear</md-icon>
						<md-tooltip md-direction="top">Decline and delete entry</md-tooltip>
					</md-button>
				</div>
			</div>
		</div>

		<md-dialog ref="changePwdDialog">
			<change-password-form v-on:pwdChanged="closeDialog('changePwdDialog')"></change-password-form>
		</md-dialog>
	</div>
</template>

<script>
import moment from 'moment';

import EventForm from '@/Components/ContentForms/EventForm';
import FestivalForm from '@/Components/ContentForms/FestivalForm';
import FestivalEventForm from '@/Components/ContentForms/FestivalEventForm';
import LocationForm from '@/Components/ContentForms/LocationForm';
import BandForm from '@/Components/ContentForms/BandForm';
import EventPage from '@/Components/SingleContentPages/EventPage';
import ChangePasswordForm from './ChangePasswordForm';

import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'admin',
	components: {
		EventForm,
		FestivalForm,
		FestivalEventForm,
		LocationForm,
		BandForm,
		EventPage,
		ChangePasswordForm
	},
	data() {
		return {
			error: false,
			errorMsg: '',
			loading: false,
			currentCategory: 'unverified Events',
			verifyIndex: Number,
			unvalidatedRoute: '/api/unvalidated-events/',
			validatedRoute: '/api/events',
			verifyData: {},
			unverifiedContent: []
		}
	},
	methods: {
		handleVerify(keepData) {
			if(this.currentCategory != 'unverified Festivals')
				this.removeEmptyObjectFields(this.verifyData);
			else {
				this.removeEmptyObjectFields(this.verifyData.festival);
				this.removeEmptyObjectFields(this.verifyData.event);				
			}


			let requestID = this.verifyData._id;
			let requestEndpoint = this.currentCategory == 'reports' ?'accept/' :'validate/';
			let requestBody = this.verifyData;
		
			if(this.currentCategory == 'unverified Festivals') {
				requestID = this.verifyData.festival._id + '/' + this.verifyData.event._id;
				
				if(this.verifyData.validated) {
					this.unvalidatedRoute = '/api/unvalidated-festival-events/';
					requestBody = JSON.parse(JSON.stringify(this.verifyData.event));
				}
				else
					this.unvalidatedRoute = '/api/unvalidated-festivals/';
			}

			if(keepData) {				
				this.$http.post(`${backendUrl}${this.unvalidatedRoute}${requestEndpoint}${requestID}`, requestBody)
					.then(response => {
						this.showNextItem();
					})
					.catch(err => console.log(err));
			}
			else {
				//Delete the currently viewed data from the respective unvalidated-route.
				this.$http.delete(`${backendUrl}${this.unvalidatedRoute}${requestID}`)
					.then(response => {					
						this.showNextItem();
					})
					.catch(err => {});
			}
		},
		//Function that removes empty strings from all array-attributes of a given object.
		removeEmptyObjectFields(object) {
			for(let attrib in object) {					
				if(Array.isArray(object[attrib])) {
					for(let element in object[attrib])
						if(object[attrib][element] == '') {
							object[attrib].splice(element, 1);
						}
				}
			}
		},
		showInfo(content, index) {			
			
			document.getElementsByClassName('verify-info')[0].classList.add('show-info');

			if(this.currentCategory == 'cancellations')
				this.$store.commit('setCurrentEvent', content[index]);
			
			if(this.currentCategory == 'unverified Events' || this.currentCategory == 'cancellations') {
				this.verifyData = JSON.parse(JSON.stringify(content[index]));
				
				this.verifyData.bands.forEach(band => {
					band.label = band.origin ?band.name + ' - ' + band.origin.country :'';
				});

				this.verifyData.location.label = this.verifyData.location.address ?this.verifyData.location.name + ' - ' + this.verifyData.location.address.city :'';				
			}
			else if(this.currentCategory == 'unverified Festivals') {
				this.verifyData = JSON.parse(JSON.stringify(content[index]));
				
				this.verifyData.event.bands.forEach(band => {
					band.label = band.origin ?band.name + ' - ' + band.origin.country :'';
				});
			}
			else {
				this.verifyData = content[index];
			}
			this.verifyIndex = index;
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		closeDialog(ref) {
			this.$refs[ref].close();
		},
		//Function for setting the currently selected category in the verify-list and set all variables for handling data for the respective category
		categoryChange(category) {
			if(category == 'unverified Events') {
				this.unvalidatedRoute = '/api/unvalidated-events/';
				this.validatedRoute = '/api/events';
			}
			else if (category == 'unverified Festivals') {
				this.unvalidatedRoute = '/api/unvalidated-festivals/unvalidated';
				this.validatedRoute = '/api/festivals';
			}
			else if (category == 'unverified Locations') {
				this.unvalidatedRoute = '/api/unvalidated-locations/';
				this.validatedRoute = '/api/locations';
			}
			else if (category == 'reports') {
				this.unvalidatedRoute = '/api/reports/';
				this.validatedRoute = '/api/reports';
			}
			else if(category == 'cancellations') {
				this.unvalidatedRoute = '/api/events/canceled/';
				this.validatedRoute = 'api/events/';
			}
			else {
				this.unvalidatedRoute = '/api/unvalidated-Bands/';
				this.validatedRoute = '/api/bands';
			}

		},
		//Function for getting the unvalidated data for the currently selected category
		getUnvalidatedData(category) {
			this.loading = true;
			this.unverifiedContent = [];

			this.categoryChange(category);			
			
			this.$http.get(backendUrl + this.unvalidatedRoute)
				.then(response => {
					
					this.currentCategory = category;					

					//Check if there is a message in the response (= error)
					if(!response.body.message) {
						//Set the array of unvalidated events for the currently selected category to the data from the reponse
						this.unverifiedContent = response.body.data;
						console.log("current unverifiedContent:", this.unverifiedContent);
						

						this.loading= false;
						//Display the first element of the array of unvalidated data for the currently selected category.
						this.showInfo(this.unverifiedContent, 0);
					}
					else {
						//If there was an error or no data was found, set the array of unvalidated data for the current category to an empty array.
						this.unverifiedContent = [];
						this.loading = false;
					}
				})
				.catch(err => {
					this.loading = false;
				});
		},
		confirmCancellation(keepData) {
			if(keepData)
				this.verifyData.canceled = 2;
			else 
				this.verifyData.canceled = 0;

			this.$http.put(backendUrl + `/api/events/${this.verifyData._id}`, this.verifyData)
				.then(response => {
					this.showNextItem();
				})
				.catch(err => console.log(err));
		},
		showNextItem() {
			//Delete the currently verified data-element from the array of unverified elements of the currently selected category.
			this.unverifiedContent.splice(this.verifyIndex, 1);
			
			//If there are still unverified elements of the current category left, show the first one of them.
			if(this.unverifiedContent[0]) {
				this.showInfo(this.unverifiedContent, 0)
			}

			document.getElementsByClassName('verify-info')[0].classList.remove('show-info');
		},
		closeInfo() {
			document.getElementsByClassName('verify-info')[0].classList.remove('show-info');
		},
		logout() {
			this.$http.get(backendUrl + '/api/users/logout')
				.then(response => {
					this.$router.push('/');
				})
				.catch((err) => {
					console.log(err);
				});
			
		},
	},
	mounted() {
		this.getUnvalidatedData(this.currentCategory);
	}
}
</script>

<style lang="scss">
	@import "src/scss/Admin/_admin.scss";
</style>
