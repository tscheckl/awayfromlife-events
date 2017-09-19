<template>
  	<div id="new_event">
		<h1>Neues Event anlegen</h1>
		
		<form v-on:submit.prevent >
			<div class="form-content">
			<md-layout md-gutter>
				<md-layout md-flex="50" md-flex-small="100">
					<md-input-container>
						<label>Title</label>
						<md-input v-model="newEvent.title" required></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<md-input-container>
						<label>Description</label>
						<md-textarea v-model="newEvent.description" required></md-textarea>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="50" md-flex-small="100">
					<div class="picker">
						<label>Date</label>
			 			<datepicker :option="timeoption" :date="newEvent.startTime"></datepicker>
					</div>
				</md-layout>
			</md-layout>

			<md-button type="submit" v-on:click="addEvent" class="md-raised">Absenden</md-button>
			<span class="message" :class="this.success? 'success': 'error'">{{this.submitStatus}}</span>
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
			},
			submitStatus: '',
			success: false
		}
	},
	methods: {
		print() {
			console.log(this.startTime.time);
		},
		addEvent: function () {
			this.submitStatus = '';
			var vm = this;
			if(this.newEvent.title.length != 0 && this.newEvent.description != 0 && this.newEvent.startTime.time != 0) {
				eventsRef.push(this.newEvent, function() {
					console.log("done");
					vm.submitStatus = "New Event was successfully created.";
					vm.success = true;
				});
				this.newEvent.title = '';
				this.newEvent.description = '';
				this.newEvent.startTime.time = '';
			}
			else {
				vm.submitStatus = "All fields have to be filled out!";
				vm.success = false;
			}
      },
	}
}
</script>

<style lang="scss">
	@import "../scss/_newEvent";
</style>
