<template>
  	<div id="event_calendar">
		<div class="color-block"></div>
		<div class="event-calendar-content-wrapper">
			<h1>Event Calendar</h1>
			<div class="calendar-content">
				<calendar language="de" :inline="true" v-model="date" v-on:selected="handle" v-on:changedMonth="handleChangedMonth"></calendar>
				<div class="events" id="all_events">
					<h2>All Events for {{formattedDate}}</h2>
					<h5 class="no-events" v-if="noEvents && foundEvents"> <i class="material-icons">warning</i> No events available for the selected date!</h5>
					<h5 class="next-events" v-if="noEvents && foundEvents">Next available events: </h5>
					<h5 class="no-events" v-if="noEvents && !foundEvents"> <i class="material-icons">warning</i> No more events found for this month!</h5>
					<div v-for="event in foundEvents" :key="event['_id']" v-on:click="showEvent(event)">
						<single-event :data="event"></single-event>
					</div>
				</div>
			</div>
		</div>

		<md-dialog ref="singleEventDialog" class="content-dialog">
			<event-page v-on:close="$refs.singleEventDialog.close()"></event-page>
		</md-dialog>
  	</div>
</template>

<script>
import moment from 'moment';
import SingleEvent from './SingleEvent';
import EventPage from '@/components/SingleContentPages/EventPage';

import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'event-calendar',
	components: {
		SingleEvent,
		EventPage,
	},
	data() {
		return {
			date: moment().format(),
			formattedDate: '',
			events: {},
			foundEvents: [],
			noEvents: false,
			showEventData: Object
		}
	},
	methods: {
		//Function for displaying events in the "all_events"-container for a given date.
		handle(date) {
			//Format the given date to fit the Object-key naming.
			date = moment(date).format('YYYY-MM-DD');
			this.formattedDate = moment(date).format('LL'); //Give the locally formatted date to the variable that is displays the selected date.
			this.foundEvents = []; //Array for the events that will be found for the date.

			//Check if there are events in the events object for the given date.
			if(this.events[date]) {
				this.foundEvents = this.events[date];
				this.noEvents = false;
			}
			else {
				//If there are no events for the exact given date, set noEvents flag true and search for the next smallest date that has events.
				this.noEvents = true;
				let smallestDate = null;

				for(let event in this.events) {
					//Check if the currently iterated event's date is bigger than given date.
					if(moment(event).format('DD') > moment(date).format('DD')) {
						//If so, check if there already is a smallest Date set.
						if(!smallestDate) {
							smallestDate = event;
						}
						//If there already is a smallest Date set, check if the currently iterated event's date is smaller than the currently smallest date
						//and set it to the smallest date if so.
						if(smallestDate != null && moment(event).format('DD') < moment(smallestDate).format('DD')) {
							smallestDate = event;
						}
					}
				}
				//Set the found events to the events of the smallest available date bigger than the given one.
				this.foundEvents = this.events[smallestDate];
			}

			//If the user is on mobile/small screens, make the screen focus the "all_events"-container when a date is selected.
			if(window.matchMedia("(max-width:1024px)").matches) {
				document.getElementById('all_events').scrollIntoView();
			}
		},
		//Function for getting all events from the Backend and creating the events-object from it.
		getEvents() {
			this.$http.get(backendUrl + '/api/events/date/' + moment(this.date).format('YYYY-MM'))
			.then((response) => {
				console.log("backend response:", response);
				
				this.events = {};
				//Check if there are any events in the body. (no error message in the body)
				if(!response.body.message) {
					//Iterate through all respnse events and make their date the key in the events object.
					//The events of one day are saved into an array of events.
					response.body.data.forEach(gottenEvent => {
						let gottenFormattedDate = moment(gottenEvent.date).format('YYYY-MM-DD');
						//If the day does not yet have any events, create a new Array for the day.
						if(!this.events[gottenFormattedDate]) {
							this.events[gottenFormattedDate] = [gottenEvent];
						}
						else { //Else push the found event to the array of the respective day.
							this.events[gottenFormattedDate].push(gottenEvent);
						}
						console.log("got events:",this.events);
						
					});
				}
				//Display all events for the currently selected date.
				this.handle(this.date);
			})
			.catch((err) => {}).bind(this);
		},
		//Function that is called when the user changes the month of the calendar
		handleChangedMonth(newDate) {
			//If the month is changed via the middle calendar-header-button, the newDate variable is an object with a timestamp attribute.
			//Therefore it is checked whether that attribute is available and the formatting is done accordingly.
			this.date = newDate.timestamp? moment(newDate.timestamp).format() : moment(newDate).format();
			this.getEvents();
		},
		//Function for giving the Single-Event dialog the data of the clicked event and opening it.
		showEvent(event) {
			this.$store.commit('setCurrentEvent', event);
			this.$refs.singleEventDialog.open();
		}
	},
	mounted() {
		document.getElementById('topbar').classList.remove('single-page');
		this.handle();
		this.getEvents();
	}
}
</script>

<style lang="scss">
	@import "src/scss/Calendar/_eventCalendar.scss";
</style>
