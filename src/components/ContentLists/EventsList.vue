<template>
	<div id="events_list">
		<div class="list-header">
			<div class="header-line">	
				<div class="left-container">
					<h1>{{archive ?'Events Archive' :'All Events'}}</h1>
				</div>

				<md-button class="md-raised create-content-btn" v-on:click="openNewEvent"><md-icon>add</md-icon>Create new Event</md-button>
			</div>

			<div class="filters">
				<h3>Events from A to Z: </h3>
				<ul class="starting-letter-filter">
					<li v-for="i in 26" :key="i" :class="'start-letter-' + (i+9).toString(36).toUpperCase()">
						<span v-on:click="filterByStartingLetter((i+9).toString(36))">{{(i+9).toString(36).toUpperCase()}}</span>
						<div v-on:click="clearFilters">
							<md-icon v-if="filterCriteria.startingLetter == (i+9).toString(36).toUpperCase()">clear</md-icon>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="all-items">

			<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>

			<div class="list-content" v-if="!loading">
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
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import moment from 'moment';
import NewEvent from "@/components/NewContent/NewEvent";

export default {
	name: 'events-list',
	components: {
		NewEvent,
	},
	props: {
		archive: {
			type: Boolean,
			default: false
		}
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
			filterCriteria: {
				startingLetter: undefined
			},
			currentPage: 1,
			availablePages: 1,
			itemsPerPage: '20',
			displayEvent: {},
			resetForm: false,
			loading: false
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
			this.$router.push({path: `/event/${event._id}`});
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
			this.loading = true;

			this.currentPage = page;

			this.buildUrl();

			let sortingDirection = this.sortingAsc[this.currentlySorted] ? 1 : -1;
			let endpoint = this.archive ?'archived-events' :'events'

			this.$http.get(backendUrl + '/api/' + endpoint + '/page?page=' + page + 
							'&perPage=' + this.itemsPerPage + 
							'&sortBy=' + this.currentlySorted + 
							'&order=' + sortingDirection + 
							'&startWith=' + this.filterCriteria.startingLetter)
			.then(response => {
				console.log(response);
				
				if(response.body.data) {
					this.events = response.body.data.slice(0);
				}
				else {
					this.events = [];
				}
				this.availablePages = response.body.pages;
				this.currentPage = response.body.current;
				

				for(let event of this.events) {
					//Add formatted date Attribute to each event for displaying the date in the list.
					event.formattedDate = moment(event.startDate).format('LL');
				}

				this.loading = false;
			})
			.catch(err => {
				this.loading = false;
			});
		},
		buildUrl() {
			this.$router.push({query: {
				page: this.currentPage, 
				itemsPerPage: this.itemsPerPage, 
				sortBy: this.currentlySorted, 
				ascending: this.sortingAsc[this.currentlySorted],
				startingLetter: this.filterCriteria.startingLetter
			}});
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
		},
		filterByStartingLetter(letter) {
			if(this.filterCriteria.startingLetter)
				document.getElementsByClassName('start-letter-' + this.filterCriteria.startingLetter)[0].classList.remove('active-start-letter');

			this.filterCriteria.startingLetter = letter.toUpperCase();
			document.getElementsByClassName('start-letter-' + letter.toUpperCase())[0].classList.add('active-start-letter');
			this.getEventsPage(this.currentPage);
		},
		clearFilters() {
			document.getElementsByClassName('start-letter-' + this.filterCriteria.startingLetter)[0].classList.remove('active-start-letter');
			this.filterCriteria.startingLetter = undefined;
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

		if(this.$route.query.startingLetter) {
			this.filterCriteria.startingLetter = this.$route.query.startingLetter;
		}
		
		if(this.$route.query.sortBy && this.$route.query.ascending) {
			this.currentlySorted = this.$route.query.sortBy;
			this.sortingAsc[this.$route.query.sortBy] = (this.$route.query.ascending == 'true');
			this.getEventsPage(this.currentPage);
		}
		else {
			this.sortingAsc.startDate = true;
		}
	},
	mounted() {
		if(this.$route.query.startingLetter) {
			document.getElementsByClassName('start-letter-' + this.$route.query.startingLetter)[0].classList.add('active-start-letter');
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsList.scss";
</style>
