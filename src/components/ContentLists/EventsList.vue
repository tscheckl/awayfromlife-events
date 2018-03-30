<template>
	<div id="events_list">
		<follow-buttons></follow-buttons>

		<div class="list-header">
			<div class="left-container">
				<h1>All Events</h1>
				<router-link to="/calendar" class="switch-view-btn">
					Calendar View <md-icon>arrow_forward</md-icon>
				</router-link>
			</div>

			<md-button class="md-raised create-content-btn" v-on:click="openDialog('new-event-dialog')"><md-icon>add</md-icon>Create new Event</md-button>
		</div>
		<div class="all-items">

			<h3 class="no-items-title" v-if="events.length == 0">No Events found..</h3>

			<div class="list-item-header" v-if="events.length > 0">
				<p class="event-date" v-on:click="sortBy('startDate')">
					<span>When?
						<md-icon v-if="currentlySorted == 'startDate'">{{!sortingAsc.startDate? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
					</span>
				</p> 
				<p class="item-title" v-on:click="sortBy('title')">
					<span>What? 
						<md-icon v-if="currentlySorted == 'title'">{{!sortingAsc.title? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
					</span>
				</p>
				<p class="location-name"><span>Where?</span></p>
				<md-icon class="hidden-icon"></md-icon>
			</div>

			<div class="list-item" v-for="(event, index) in events" :key="index" v-on:click="showEvent(event)">
				<p class="event-date">{{event.formattedDate}}</p>
				<h3 class="item-title">{{event.title}}</h3>
				<p class="location-name"><b>{{event.locationName}}</b> {{event.locationCity}}</p>
				<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
			</div>

			<div class="list-footer">
				<div class="pages">
					<span class="page-btn" v-on:click="currentPage > 1 ? getEventsPage(currentPage-1): getEventsPage(currentPage)"><md-icon>keyboard_arrow_left</md-icon></span>
					<span v-for="number in smallerPages()" :key="number" v-on:click="getEventsPage(number)">{{number}}</span>
					<span class="current-page">{{currentPage}}</span>
					<span v-for="number in biggerPages()" :key="number" v-on:click="getEventsPage(number)">{{number}}</span>
					<span class="page-btn" v-on:click="(currentPage < availablePages)? getEventsPage(currentPage+1): getEventsPage(currentPage)"><md-icon>keyboard_arrow_right</md-icon></span>
				</div>
				
				<md-input-container>
					<p>Items per Page</p>
					<md-select name="itemsPerPage" v-model="itemsPerPage" v-on:change="getEventsPage(currentPage)">
						<md-option value="5">5</md-option>
						<md-option value="10">10</md-option>
						<md-option value="20">20</md-option>
						<md-option value="50">50</md-option>
					</md-select>
				</md-input-container>
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
import FollowButtons from '@/components/FollowButtons';

export default {
	name: 'events-list',
	components: {
		NewEvent,
		EventPage,
		FollowButtons
	},
	data() {
		return {
			events: [],
			showEventData: {},
			sortingAsc: {
				startDate: false,
				title: false
			},
			currentlySorted: 'startDate',
			currentPage: 1,
			availablePages: 1,
			itemsPerPage: '20'
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
		sortBy(sortCrit) {
			this.currentlySorted = sortCrit;
			this.sortingAsc[sortCrit] = !this.sortingAsc[sortCrit];
			this.getEventsPage(this.currentPage);
		},
		getEventsPage(page) {
			this.currentPage = page;

			let sortingDirection = this.sortingAsc[this.currentlySorted] ? 1 : -1;

			this.$http.get(backendUrl + '/api/events/page?page=' + page + '&perPage=' + this.itemsPerPage + '&sortBy=' + this.currentlySorted + '&order=' + sortingDirection)
			.then(response => {
				this.events = response.body.data;
				this.availablePages = response.body.pages;
				this.currentPage = response.body.current;

				this.events.forEach((event) => {
					//Get Name and city of each event's location.
					this.$http.get(backendUrl + '/api/locations/byid/' + event.location)
						.then(response => {
							this.$set(event, 'locationName', response.body.data.name);
							this.$set(event, 'locationCity', response.body.data.address.city);
						})
						.catch(err => {
							console.log("Error while trying to get location for an event: ", err);
						});
						
					//Add formatted date Attribute to each event for displaying the date in the list.
					event.formattedDate = moment(event.startDate).format('L');
				});
			})
			.catch(err => {
				console.log(err);
			});
		},
		smallerPages() {
			let smallerPages = [];
			let counter = 0;
			for(let i = 1; i < this.currentPage; i++) {
				smallerPages[counter] = i;
				counter++;
			}

			if(smallerPages.length > 10) {
				return smallerPages.slice(1,10);
			}
			else {
				return smallerPages;
			}
		},
		biggerPages() {
			let biggerPages = [];
			let counter = 0;
			for(let i = this.currentPage; i < this.availablePages; i++) {
				biggerPages[counter] = i+1;
				counter++;
			}
			if(biggerPages.length > 10) {
				return biggerPages.slice(1,10);
			}
			else {
				return biggerPages;
			}
		}
	},
	mounted() {
		this.getEventsPage(this.currentPage);		
		//Sort the events ascending by their date.
		this.sortingAsc.startDate = true;
		this.sortBy('startDate');
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsList.scss";
</style>
