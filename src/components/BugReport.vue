<template>
	<div id="bug_report" class="center-ver-hor">
		<md-toolbar>
			<router-link to="/">
				<md-button>
					<md-icon>arrow_back</md-icon>
					<md-tooltip md-direction="bottom">Back to Calendar (You stay logged in)</md-tooltip>
				</md-button>
			</router-link>

			<h1>Report a Bug</h1>
		</md-toolbar>

		<form v-on:submit.prevent >
			<md-input-container>
				<label>In which part of the website did the error occur?</label>
				<md-select v-model="bug.component">
					<md-option :value="option" v-for="option in componentOptions" :key="option">{{option}}</md-option>
				</md-select>
			</md-input-container>
			
			<md-input-container>
				<label>What exactly doesn't work?</label>
				<md-textarea class="function-ta" v-model="bug.function"></md-textarea>
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

			<md-button type="submit" class="md-raised md-accent" v-on:click="sendBugReport">Bug melden</md-button>

			<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
		</form>
  	</div>
</template>

<script>
import {backendUrl} from '@/secrets.js';

export default {
	name: 'bug-report',
	data() {
		return {
			bug: {
				function: '',
				description: '',
				loggedIn: 2,
				component: ''
			},
			loading: false,
			componentOptions: [
				"Create new Event",
				"Create new Location",
				"Show Calender",
				"Admin Console"
			]
		}
	},
	methods: {
		sendBugReport() {
			this.loading = true;

			this.$http.post(backendUrl + '/api/bugs', this.bug)
				.then(response => {
					console.log("Bug was successfully reported!");
					console.log(response);
					this.bug.function = '';
					this.bug.description = '';
					this.bug.loggedIn = 2;

					this.loading = false;
				})
				.catch(err => {
					console.log("An error occurred, please try again!");
					this.loading = false;
				});
		}
	}
}
</script>

<style lang="scss">
	@import "../scss/_bugReport.scss";
</style>
