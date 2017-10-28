<template>
  	<div id="event_calendar">
		<top-bar>
		  <md-button id="newEvent" class="md-flat new-event-btn" v-on:click="openDialog('newEventDialog')"> <i class="material-icons ">add</i> Create new Event</md-button>
		</top-bar>

		<div class="event-calendar-content-wrapper">
			<h1>Event Calendar</h1>
			<calendar language="de" :inline="true" v-model="date" v-on:selected="handle" v-on:changedMonth="handleChangedMonth"></calendar>
			<div class="events">
				<h2>All Events</h2>
				<h5 style="text-align:center;" v-if="noEvents">Keine Events für das augewählte Datum gefunden! Das nächste verfügbare Event ist:</h5>
				<div v-for="event in foundEvents" :key="event['_id']">
					<single-event :data="event"></single-event>
				</div>
			</div>
		</div>

		<md-dialog ref="newEventDialog"  md-open-from="#newEvent" md-close-to="#newEvent">
			<new-event></new-event>
		</md-dialog>
  	</div>
</template>

<script>
import moment from 'moment';
import TopBar from './TopBar';
import NewEvent from './NewEvent';
import SingleEvent from './SingleEvent';

export default {
	name: 'event-calendar',
	components: {
		TopBar,
		NewEvent,
		SingleEvent
	},
	data() {
		return {
			date: moment().format(),
			events: {},
			foundEvents: [],
			noEvents: false
		}
	},
	methods: {
		handle(date) {
			date = moment(date).format('YYYY-MM-DD');

			if(this.events[date]) {
				this.foundEvents = this.events[date];
				this.noEvents = false;
			}
			else {
				this.noEvents = true;
				this.foundEvents = [];
				let smallestDate = null;

				for(event in this.events) {
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
		},
		getEvents() {
			this.$http.get('http://localhost:3000/api/events/date/' + moment(this.date).format('YYYY-MM'))
			.then((response) => {
				this.events = {};
				//Iterate through all respnse events and make their date the key in the events object
				//The events of one day are saved into an array of events
				for(let i=0; i < response.body.length; i++) {
					//If the day does not yet have any events, create a new Array for the day
					if(!this.events[response.body[i].startDate]) {
						this.events[response.body[i].startDate] = [response.body[i]];
					}
					else { //Else push the found event to the array of the respective day
						this.events[response.body[i].startDate].push(response.body[i]);
					}
					
					this.handle(this.date);
				}
				console.log("events ", this.events);
			})
			.catch((err) => {
				console.log(err);
			}).bind(this);
		},
		handleChangedMonth(newDate) {
			console.log(newDate);
			this.date = moment(newDate).format();
			this.getEvents();
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		closeDialog(ref) {
			this.$refs[ref].close();
		},
	},
	mounted() {
		this.getEvents();
	}
}
</script>

<style lang="scss">
	@import "src/scss/_eventCalendar.scss";
</style>
