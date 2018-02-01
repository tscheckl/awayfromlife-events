<template>
	<div id="events_list">
		<div class="list-header">
			<h1>All Events</h1>

			<md-button class="md-raised" v-on:click="openDialog('new-event-dialog')"><md-icon>add</md-icon>Create new Event</md-button>
		</div>
		<div class="all-items">
			<div class="list-item list-item-header">
				<p class="event-date" v-on:click="sortByDate">
					<span>When?</span>
					<md-icon v-if="currentlySorted == 'date'">{{sortingAsc.date? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
				</p> 
				<p class="item-title" v-on:click="sortByTitle">
					<span>What?</span>
					<md-icon v-if="currentlySorted == 'title'">{{sortingAsc.title? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
				</p>
				<p class="location-name">Where?</p>
				<md-icon class="hidden-icon">keyboard_arrow_right</md-icon>
			</div>
			<div class="list-item" v-for="(event, index) in events" :key="index" v-on:click="showEvent(event)">
				<p class="event-date">{{event.formattedDate}}</p>
				<h3 class="item-title">{{event.title}}</h3>
				<p class="location-name"><b>{{event.locationName}}</b> {{event.locationCity}}</p>
				<md-icon>keyboard_arrow_right</md-icon>
			</div>
		</div>
		<div class="color-block"></div>

		<md-dialog ref="new-event-dialog">
			<new-event v-on:close="$refs['new-event-dialog'].close()"></new-event>
		</md-dialog>

		<md-dialog ref="singleEventDialog" class="content-dialog">
			<event-page :data="showEventData" v-on:close="$refs.singleEventDialog.close()"></event-page>
		</md-dialog>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import moment from 'moment';
import NewEvent from "@/components/NewContent/NewEvent";
import EventPage from '@/Components/SingleContentPages/EventPage';

export default {
	name: 'events-list',
	components: {
		NewEvent,
		EventPage
	},
	data() {
		return {
			events: [],
			showEventData: {},
			sortingAsc: {
				date: true,
				title: true
			},
			currentlySorted: 'date'
		}
	},
	watch: {
		events() {
			return this.events;
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		//Function for giving the Single-Event dialog the data of the clicked event and opening it.
		showEvent(event) {
			this.showEventData = event;
			this.$refs.singleEventDialog.open();
		},
		sortByDate() {
			this.currentlySorted = 'date';
			this.events.sort((a,b) => 
				this.sortingAsc.date
					? moment(a.startDate).format('X') - moment(b.startDate).format('X') 
					: moment(b.startDate).format('X') - moment(a.startDate).format('X')
			);

			this.sortingAsc.date = !this.sortingAsc.date;
		},
		sortByTitle() {
			this.currentlySorted = 'title';
			this.events.sort((a,b) => this.sortingAsc.title? a.title.localeCompare(b.title): b.title.localeCompare(a.title));
			this.sortingAsc.title = !this.sortingAsc.title;
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/events')
			.then(response => {
				this.events = response.body;

				this.events.forEach((event) => {
					//Get Name and city of each event's location.
					this.$http.get(backendUrl + '/api/locations/' + event.location)
						.then(response => {
							this.$set(event, 'locationName', response.body.name);
							this.$set(event, 'locationCity', response.body.city);
						})
						.catch(err => {
							console.log("Error while trying to get location for an event: ", err);
						});
						
					//Add formatted date Attribute to each event for displaying the date in the list.
					event.formattedDate = moment(event.startDate).format('L');
				});

				//Sort the events ascending by their date.
				this.sortByDate();
			})
			.catch(err => {
				console.log(err);
			});
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsList.scss";
</style>
