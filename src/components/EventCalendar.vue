<template>
  	<div id="event_calendar">
		<top-bar>
		</top-bar>

		<div class="event-calendar-content-wrapper">
			<h1>Event Kalender</h1>
			<calendar language="de" :inline="true" v-model="date" v-on:selected="handle" v-on:changedMonth="handleChangedMonth"></calendar>
			<div class="events" id="all_events">
				<h2>Alle events für {{formattedDate}}</h2>
				<h5 class="no-events" v-if="noEvents && foundEvents"> <i class="material-icons">warning</i> Keine Events für das augewählte Datum gefunden!</h5>
				<h5 class="next-events" v-if="noEvents && foundEvents">Die nächsten verfügbaren Events: </h5>
				<h5 class="no-events" v-if="noEvents && !foundEvents"> <i class="material-icons">warning</i> Keine weiteren Events für diesen Monat gefunden!</h5>
				<div v-for="event in foundEvents" :key="event['_id']">
					<single-event :data="event"></single-event>
				</div>
			</div>
		</div>
  	</div>
</template>

<script>
import moment from 'moment';
import TopBar from './TopBar';
import SingleEvent from './SingleEvent';

import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'event-calendar',
	components: {
		TopBar,
		SingleEvent
	},
	data() {
		return {
			date: moment().format(),
			formattedDate: '',
			events: {},
			foundEvents: [],
			noEvents: false
		}
	},
	methods: {
		handle(date) {
			date = moment(date).format('YYYY-MM-DD');
			this.formattedDate = moment(date).format('LL');
			this.foundEvents = [];

			if(this.events[date]) {
				this.foundEvents = this.events[date];
				this.noEvents = false;
			}
			else {
				this.noEvents = true;
				let smallestDate = null;

				for(let event in this.events) {
					if(moment(event).format('DD') > moment(date).format('DD')) {
						if(!smallestDate) {
							smallestDate = event;
						}
						if(smallestDate != null && moment(event).format('DD') < moment(smallestDate).format('DD')) {
							smallestDate = event;
						}
					}
				}
				this.foundEvents = this.events[smallestDate];
			}

			if(window.matchMedia("(max-width:768px)").matches) {
				document.getElementById('all_events').scrollIntoView();
			}
		},
		getEvents() {
			this.$http.get(backendUrl + '/api/events/date/' + moment(this.date).format('YYYY-MM'))
			.then((response) => {
				this.events = {};
				//Iterate through all respnse events and make their date the key in the events object
				//The events of one day are saved into an array of events
				for(let i=0; i < response.body.length; i++) {
					//If the day does not yet have any events, create a new Array for the day
					if(!this.events[moment(response.body[i].startDate).format('YYYY-MM-DD')]) {
						this.events[moment(response.body[i].startDate).format('YYYY-MM-DD')] = [response.body[i]];
					}
					else { //Else push the found event to the array of the respective day
						this.events[moment(response.body[i].startDate).format('YYYY-MM-DD')].push(response.body[i]);
					}
				}
				this.handle(this.date);
			})
			.catch((err) => {
				console.log(err);
			}).bind(this);
		},
		handleChangedMonth(newDate) {
			this.date = moment(newDate).format();
			this.getEvents();
			this.handle(this.date);
		},
	},
	mounted() {
		this.handle();
		this.getEvents();
	}
}
</script>

<style lang="scss">
	@import "src/scss/_eventCalendar.scss";
</style>
