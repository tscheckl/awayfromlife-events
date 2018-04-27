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

			<md-button class="md-raised create-content-btn" v-on:click="openNewEvent"><md-icon>add</md-icon>Create new Event</md-button>
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
				<p class="location-name" v-on:click="sortBy('location')">
					<span>Where? 
						<md-icon v-if="currentlySorted == 'location'">{{!sortingAsc.location? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
					</span>
				</p>
				<md-icon class="hidden-icon"></md-icon>
			</div>

			<div class="list-item" v-for="(event, index) in events" :key="index" v-on:click="showEvent(event, index)">
				<p class="event-date">{{event.formattedDate}}</p>
				<h3 class="item-title">{{event.title}}</h3>
				<p class="location-name" v-if="event.location"><b>{{event.location.name}}</b> {{event.location.address.city}}</p>
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

		<md-dialog ref="newEventDialog">
			<new-event v-on:close="handleDialogClose('newEventDialog')"></new-event>
		</md-dialog>

		<md-dialog ref="singleEventDialog" class="content-dialog">
			<event-page :event="displayEvent" v-on:close="handleDialogClose('singleEventDialog')"></event-page>
		</md-dialog>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import moment from 'moment';
import NewEvent from "@/components/NewContent/NewEvent";
import EventPage from '@/Components/SingleContentPages/EventPage';
import FollowButtons from '@/Components/FollowButtons';

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
			locations: [],
			sortingAsc: {
				startDate: false,
				title: false,
				location: false
			},
			currentlySorted: 'startDate',
			currentPage: 1,
			availablePages: 1,
			itemsPerPage: '20',
			displayEvent: {},
			resetForm: false
		}
	},
	methods: {
		openNewEvent() {
			this.$store.commit('setCurrentEvent', {
				title: '',
				description: '',
				location: '',
				bands: [''],
				startDate: '',
				endDate: '',
				time: ''
			});
			this.$refs['newEventDialog'].open();	
		},
		//Function for giving the Single-Event dialog the data of the clicked event and opening it.
		showEvent(event, index) {
			this.$store.commit('setCurrentEvent', event);
			this.displayEvent = event;
			
			this.$refs.singleEventDialog.open();
		},
		sortBy(sortCrit) {
			this.currentlySorted = sortCrit;
			//Save the current state of the category that is to be sorted.
			let currentlySortedSortingAscTemp = this.sortingAsc[sortCrit];
			//Reset all other categories direction
			for(let key in this.sortingAsc) {
				this.sortingAsc[key] = false;
			}
			//Assign the category to be sorted the negative value of its former value.
			this.sortingAsc[sortCrit] = !currentlySortedSortingAscTemp;

			this.$router.push({query: {
				page: this.currentPage, 
				itemsPerPage: this.itemsPerPage, 
				sortBy: this.currentlySorted, 
				ascending: this.sortingAsc[this.currentlySorted]
			}});

			this.getEventsPage(this.currentPage);
		},
		getEventsPage(page) {
			this.currentPage = page;
			
			this.$router.push({query: {
				page: this.currentPage, 
				itemsPerPage: this.itemsPerPage, 
				sortBy: this.currentlySorted, 
				ascending: this.sortingAsc[this.currentlySorted]
			}});

			let sortingDirection = this.sortingAsc[this.currentlySorted] ? 1 : -1;

			this.$http.get(backendUrl + '/api/events/page?page=' + page + '&perPage=' + this.itemsPerPage + '&sortBy=' + this.currentlySorted + '&order=' + sortingDirection)
			.then(response => {
				
				this.events = response.body.data.slice(0);
				this.availablePages = response.body.pages;
				this.currentPage = response.body.current;
				

				for(let event of this.events) {
					//Add formatted date Attribute to each event for displaying the date in the list.
					event.formattedDate = moment(event.startDate).format('LL');
				}
			})
			.catch(err => {});
		},
		smallerPages() {
			let smallerPages = [];
			let counter = 0;
			for(let i = 1; i < this.currentPage; i++) {
				smallerPages[counter] = i;
				counter++;
			}

			if(smallerPages.length > 3) {
				return smallerPages.slice(smallerPages.length-3);
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

			return biggerPages.slice(0,3);
		},
		handleDialogClose(ref) {
			this.$refs[ref].close();
			this.getEventsPage(this.currentPage);
		}
	},
	created() {
		if(this.$router.currentRoute.query.page) {
			this.currentPage = this.$router.currentRoute.query.page;
		}

		if(this.$route.query.itemsPerPage) {
			this.itemsPerPage = this.$route.query.itemsPerPage;
		}
		
		if(this.$route.query.sortBy && this.$route.query.ascending) {
			this.currentlySorted = this.$route.query.sortBy;
			this.sortingAsc[this.$route.query.sortBy] = (this.$route.query.ascending == 'true');
			this.getLocationsPage(this.currentPage);
		}
		else {
			this.sortingAsc.startDate = true;
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsList.scss";
</style>
