<template>
  	<div id="new_event">
		<h1>Neues Event anlegen</h1>
		
		<form v-on:submit.prevent >
			<div class="form-content">
			<md-layout md-gutter>
				<md-layout md-flex="50" md-flex-small="100">
					<md-input-container>
						<label>Title</label>
						<md-input v-model="newEvent.title"></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<md-input-container>
						<label>Description</label>
						<md-textarea v-model="newEvent.description"></md-textarea>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="50" md-flex-small="100">
					<div class="picker">
						<label>Date</label>
			 			<datepicker :option="timeoption" :date="newEvent.startTime"></datepicker>
					</div>
				</md-layout>
			</md-layout>

			<md-button type="submit" v-on:click="addEvent" class="md-raised md-accent">Absenden</md-button>
		</div>
		</form>
  	</div>
</template>

<script>
import Firebase from 'firebase'

let config = {
    apiKey: "AIzaSyDAE4ZdR9N8Ep5gY9qSGZvIsab_xaZ4M-c",
    authDomain: "away-from-life-3bb5b.firebaseapp.com",
    databaseURL: "https://away-from-life-3bb5b.firebaseio.com",
    projectId: "away-from-life-3bb5b",
    storageBucket: "",
    messagingSenderId: "175709487980"
  };
  
let app = Firebase.initializeApp(config)
let db = app.database()

let eventsRef = db.ref('Events');


export default {
	name: 'new-event',
	data() {
		return {
			newEvent: {
				title: '',
				description: '',
				startTime : {
					time: ''
				},
			},
			timeoption: {
				type: 'min',
				week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
				month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				format: 'YYYY-MM-DD HH:mm'
			}
		}
	},
	methods: {
		print() {
			console.log(this.startTime.time);
		},
		addEvent: function () {
			eventsRef.push(this.newEvent);
			this.newEvent.title = '';
			this.newEvent.description = '';
			this.newEvent.date = '';
      },
	}
}
</script>

<style lang="scss">
	@import "../scss/_newEvent";
</style>
