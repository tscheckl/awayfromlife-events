<template>
	<div id="bug_report" class="center-ver-hor">
		<md-toolbar>
			<router-link to="/">
				<md-button>
					<md-icon>arrow_back</md-icon>
					<md-tooltip md-direction="bottom">Zurück zum Kalender (du bleibst eingeloggt)</md-tooltip>
				</md-button>
			</router-link>

			<h1>Einen Bug melden</h1>
		</md-toolbar>

		<form v-on:submit.prevent >
			<md-input-container>
				<label>In welchem Teil der Website ist der Fehler aufgetreten?</label>
				<md-select v-model="bug.component">
					<md-option :value="option" v-for="option in componentOptions" :key="option">{{option}}</md-option>
				</md-select>
			</md-input-container>
			
			<md-input-container>
				<label>Was genau funktioniert nicht?</label>
				<md-textarea class="function-ta" v-model="bug.function"></md-textarea>
			</md-input-container>

			<md-input-container>
				<label>Wie genau hast du den Fehler herbeigeführt?</label>
				<md-textarea class="description-ta" v-model="bug.description"></md-textarea>
			</md-input-container>

			<h4>Warst du eingeloggt während der Fehler aufgetreten ist?</h4>
			<div>
				<md-radio v-model="bug.loggedIn" md-value="1">Ja</md-radio>
				<md-radio v-model="bug.loggedIn" md-value="0">Nein</md-radio>
				<md-radio v-model="bug.loggedIn" md-value="2">Nicht sicher</md-radio>
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
				"Neues Event anlegen",
				"Neue Location anlegen",
				"Show Kalender",
				"Admin Bereich"
			]
		}
	},
	methods: {
		sendBugReport() {
			this.loading = true;

			this.$http.post(backendUrl + '/api/bugs', this.bug)
				.then(response => {
					console.log("Bug erfolgreich gemeldet!");
					console.log(response);
					this.bug.function = '';
					this.bug.description = '';
					this.bug.loggedIn = 2;

					this.loading = false;
				})
				.catch(err => {
					console.log("Es ist ein Fehler aufgetreten, bitte versuche es erneut!");
					this.loading = false;
				});
		}
	}
}
</script>

<style lang="scss">
	@import "../scss/_bugReport.scss";
</style>
