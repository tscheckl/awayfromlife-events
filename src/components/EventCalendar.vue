<template>
  	<div id="event_calendar">
		<top-bar>
		  <md-button id="newEvent" class="md-flat new-event-btn" v-on:click="openDialog('newEventDialog')"> <i class="material-icons ">add</i> Create new Event</md-button>
		</top-bar>

		<div class="event-calendar-content-wrapper">
			<h1>Event Calendar</h1>
			<calendar language="de" :inline="true" v-model="date" v-on:selected="handle"></calendar>
			<div class="events">
				<h2>All Events</h2>

				<div class="event">
					<h3 class="event-title">Title</h3>
					<span class="event-date">29.08.2011</span>
					<p class="event-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos repellat quibusdam, harum iste sapiente ipsum hic laudantium. Nam dolor, obcaecati pariatur impedit, non accusamus sint, temporibus quae consequatur nobis cupiditate.</p>
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

export default {
	name: 'event-calendar',
	components: {
		TopBar,
		NewEvent
	},
	data() {
		return {
			date: new Date(2016, 9,  16)
		}
	},
	methods: {
		handle(date) {
			console.log(moment(date).format("YYYY/MM/DD"));
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		closeDialog(ref) {
			this.$refs[ref].close();
		},
	}
}
</script>

<style lang="scss">
	@import "src/scss/_eventCalendar.scss";
</style>
