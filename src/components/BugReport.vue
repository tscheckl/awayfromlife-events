<template>
	<div id="bug_report" class="center-ver-hor">
		<h1>Feedback</h1>
		<div class="content">
			<h2 class="ideas-form-header" v-on:click="toggleReport('ideas-form')">Give us feedback or new ideas <md-icon>keyboard_arrow_right</md-icon></h2>
			<form class="ideas-form" v-on:submit.prevent >

				<md-input-container>
					<label>Your feedback or ideas on what we could add to the app</label>
					<md-textarea class="description-ta" v-model="feedback.text"></md-textarea>
				</md-input-container>

				<p>(Optional) Enter your Email address so we can contact you if we have any questions about your feedback.</p>
				<md-input-container>
					<label>Email address</label>
					<md-input v-model="feedback.email"></md-input>
				</md-input-container>

				<md-button type="submit" class="md-raised md-accent" v-on:click="sendFeedback">Send</md-button>

				<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
			</form>

			<hr>

			<h2 class="bug-form-header" v-on:click="toggleReport('bug-form')">Report a bug <md-icon>keyboard_arrow_right</md-icon></h2>
			<form class="bug-form" v-on:submit.prevent >
				<md-input-container>
					<label>In which part of the website did the error occur?</label>
					<md-select v-model="bug.component">
						<md-option :value="option" v-for="option in componentOptions" :key="option">{{option}}</md-option>
					</md-select>
				</md-input-container>
				
				<md-input-container>
					<label>What exactly doesn't work?</label>
					<md-textarea class="error-ta" v-model="bug.error"></md-textarea>
				</md-input-container>

				<md-input-container>
					<label>How did you cause the error to occur?</label>
					<md-textarea class="description-ta" v-model="bug.description"></md-textarea>
				</md-input-container>

				<h4>Were you logged in while the error occured?</h4>
				<div>
					<md-radio v-model="bug.loggedIn" md-value="1">Yes</md-radio>
					<md-radio v-model="bug.loggedIn" md-value="0">No</md-radio>
					<md-radio v-model="bug.loggedIn" md-value="2">Not sure</md-radio>
				</div>

				<p>(Optional) Enter your Email address so we can contact you if we have any questions about your report.</p>
				<md-input-container>
					<label>Email address</label>
					<md-input v-model="bug.email"></md-input>
				</md-input-container>

				<md-button type="submit" class="md-raised md-accent" v-on:click="sendBugReport">Send</md-button>

				<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
			</form>
		</div>
		<div class="color-block"></div>

		<md-snackbar ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
  	</div>
</template>

<script>
import {backendUrl} from '@/secrets.js';

export default {
	name: 'bug-report',
	data() {
		return {
			bug: {
				error: '',
				description: '',
				loggedIn: 2,
				component: '',
				email: ''
			},
			feedback: {
				text: '',
				email: ''
			},
			loading: false,
			componentOptions: [
				"Search/Start Page",
				"Events List",
				"Create new Event",
				"Locations List",
				"Create new Location",
				"Bands List",
				"Create new Band",
				"Show Calender",
				"Admin Console"
			],
			submitStatus: ''
		}
	},
	methods: {
		sendBugReport() {
			this.loading = true;

			this.$http.post(backendUrl + '/api/bugs', this.bug)
				.then(response => {
					this.submitStatus = 'Thank you for reporting your bug!';
					this.$refs.snackbar.open();
					this.bug.error = '';
					this.bug.description = '';
					this.bug.loggedIn = 2;
					this.bug.email = '';

					this.loading = false;
				})
				.catch(err => {
					this.submitStatus = 'An error occurred while trying to report your Bug. Please try again!';
					this.$refs.snackbar.open();
					this.loading = false;
				});
		},
		sendFeedback() {
			this.loading = true;
			this.$http.post(backendUrl + '/api/feedback', this.feedback)
				.then(response => {
					this.submitStatus = 'Thank you for your feedback!';
					this.$refs.snackbar.open();
					this.feedback.text = '';
					this.feedback.email = '';

					this.loading = false;
				})
				.catch(err => {
					this.loading = false;
				});
		},
		toggleReport(report) {
			document.getElementsByClassName(report)[0].classList.toggle('opened');
			document.getElementsByClassName(report + '-header')[0].classList.toggle('opened');
		},
	}
}
</script>

<style lang="scss">
	@import "../scss/_bugReport.scss";
</style>
