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
					<li v-for="i in 26" :key="i" 
						:class="buildLetterCssClasses((i+9).toString(36).toUpperCase())">
						<span v-on:click="filterCriteria.startWith.indexOf((i+9).toString(36).toUpperCase()) != -1 ?filterByStartingLetter((i+9).toString(36).toUpperCase()) :''">
							{{(i+9).toString(36).toUpperCase()}}
						</span>
						<div v-on:click="clearFilters">
							<md-icon v-if="appliedFilters.startWith == (i+9).toString(36).toUpperCase()">clear</md-icon>
						</div>
					</li>
					<li :class="buildLetterCssClasses('#')">
						<span v-on:click="filterCriteria.startWith.indexOf('#') != -1 ?filterByStartingLetter('#') :''">
							#
						</span>
						<div v-on:click="clearFilters">
							<md-icon v-if="appliedFilters.startWith == '#'">clear</md-icon>
						</div>
					</li>
				</ul>

				<h3 class="filters-header">Additional Filters: </h3>
				<div class="additional-filters">
					<md-input-container class="genre-select">
						<span class="input-label" v-if="appliedFilters.genre && appliedFilters.genre != ''">Genre</span>
						<v-select :options="filterCriteria.genres"
								  v-model="appliedFilters.genre"
								  placeholder="Genre">
						</v-select>
					</md-input-container>
					<md-input-container class="date-select">
						<span class="input-label" v-if="appliedFilters.firstDate != ''">From</span>
						<datetime v-model="appliedFilters.firstDate" 
								  type="date" 
								  :min-datetime="filterCriteria.firstDate" 
								  :max-datetime="appliedFilters.lastDate && (appliedFilters.lastDate < filterCriteria.lastDate) 
								  	? appliedFilters.lastDate
									: filterCriteria.lastDate" 
								  placeholder="From" 
								  input-format="DD-MM-YYYY">
						</datetime>
					</md-input-container>
					<md-input-container class="date-select">
						<span class="input-label" v-if="appliedFilters.lastDate != ''">To</span>
						<datetime v-model="appliedFilters.lastDate" 
								  type="date" 
								  :min-datetime="appliedFilters.firstDate > filterCriteria.firstDate 
								  	? appliedFilters.firstDate 
									: filterCriteria.firstDate" 
								  :max-datetime="filterCriteria.lastDate"
								  placeholder="To" 
								  input-format="DD-MM-YYYY">
						</datetime>
					</md-input-container>

					<div class="switch-select">
						<md-button-toggle md-single class="md-accent">
							<md-button :class="'md-button ' + (filterByCity ?'md-toggle' :'')" v-on:click="filterByCity = true">
								City
							</md-button>

							<md-button :class="'md-button ' + (!filterByCity ?'md-toggle' :'')" v-on:click="filterByCity = false">
								Country
							</md-button>
						</md-button-toggle>

						<md-input-container class="city-select" v-if="filterByCity">
							<span class="input-label" v-if="appliedFilters.city && appliedFilters.city != ''">City</span>
							<v-select :options="filterCriteria.cities"
										v-model="appliedFilters.city"
										placeholder="City">
							</v-select>
						</md-input-container>

						<md-input-container class="country-select" v-if="!filterByCity">
							<span class="input-label" v-if="appliedFilters.country && appliedFilters.country != ''">Country</span>
							<v-select :options="filterCriteria.countries"
										v-model="appliedFilters.country"
										placeholder="Country">
							</v-select>
						</md-input-container>
					</div>
				</div>
			</div>
		</div>

		<div class="color-block"></div>

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
				startWith: [],
				cities: undefined,
				countries: undefined,
				firstDate: undefined,
				lastDate: undefined,
				genres: undefined
			},
			appliedFilters: {
				startWith: undefined,
				city: undefined,
				country: undefined,
				firstDate: '',
				lastDate: '',
				genre: undefined
			},
			filterByCity: false,
			currentPage: 1,
			availablePages: 1,
			itemsPerPage: '20',
			displayEvent: {},
			resetForm: false,
			loading: false
		}
	},
	watch: {
		appliedFilters: {
			handler(val){
				this.getEventsPage(this.currentPage);
			},
			deep: true
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

			this.buildUrl();

			this.getEventsPage(this.currentPage);
		},
		//Get all events for the given page number.
		getEventsPage(page) {
			this.loading = true;

			this.currentPage = page;
			//Call function for building the router-queries and pushing them.
			this.buildUrl();

			let sortingDirection = this.sortingAsc[this.currentlySorted] ? 1 : -1;
			//Check if you're currently on the archive page or not and change the backend-endpoint for the request accordingly.
			let endpoint = this.archive ?'archived-events' :'events';
			//Catch problem if the starting letter is # and convert it so the backend can parse it.
			let startingLetter = this.appliedFilters.startWith == '#' ?'%23' :this.appliedFilters.startWith;

			this.$http.get(backendUrl + '/api/' + endpoint + '/page?page=' + page + 
							'&perPage=' + this.itemsPerPage + 
							'&sortBy=' + this.currentlySorted + 
							'&order=' + sortingDirection + 
							'&startWith=' + startingLetter + 
							(this.appliedFilters.genre ?('&genre=' + this.appliedFilters.genre) :'') + 
							(this.appliedFilters.firstDate ?('&startDate=' + this.appliedFilters.firstDate) :'') +
							(this.appliedFilters.lastDate ?('&endDate=' + this.appliedFilters.lastDate) :'') +
							((this.filterByCity && this.appliedFilters.city) ?('&city=' + this.appliedFilters.city) :'') +
							((!this.filterByCity && this.appliedFilters.country) ?('&country=' + this.appliedFilters.country) :''))
			.then(response => {
				//Check if backend sent data, i.e. not sending an error message.
				if(response.body.data) {
					this.events = response.body.data;
				}
				//If an error message is sent, set the events to be empty which will show a warning message in the list.
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
		//Function for building the current route with all query-parameters.
		buildUrl() {
			this.$router.push({query: {
				page: this.currentPage, 
				itemsPerPage: this.itemsPerPage, 
				sortBy: this.currentlySorted, 
				ascending: this.sortingAsc[this.currentlySorted],
				startWith: this.appliedFilters.startWith,
				genre: this.appliedFilters.genre,
				firstDate: this.appliedFilters.firstDate.length > 0 ?this.appliedFilters.firstDate :undefined,
				lastDate: this.appliedFilters.lastDate.length > 0 ?this.appliedFilters.lastDate :undefined,
				city: this.filterByCity ?this.appliedFilters.city :undefined,
				country: !this.filterByCity ?this.appliedFilters.country :undefined
			}});
		},
		//Function for getting all or the previous 3 smaller pages than the current one.
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
		//Function for getting all or the next 3 bigger pages than the current one.
		biggerPages() {
			let biggerPages = [];
			let counter = 0;
			for(let i = this.currentPage; i < this.availablePages; i++) {
				biggerPages[counter] = i+1;
				counter++;
			}

			return biggerPages.slice(0,3);
		},
		//Function for closing a dialog and refreshing the events.
		handleDialogClose(ref) {
			this.$refs[ref].close();
			this.getEventsPage(this.currentPage);
		},
		//Function for adding a starting-letter filter to the list.
		filterByStartingLetter(letter) {
			if(this.appliedFilters.startWith)
				document.getElementsByClassName('start-letter-' + this.appliedFilters.startWith)[0].classList.remove('active-start-letter');

			this.appliedFilters.startWith = letter;
			document.getElementsByClassName('start-letter-' + letter)[0].classList.add('active-start-letter');
			this.getEventsPage(this.currentPage);
		},
		//Function for clearing one or all filters.
		clearFilters() {
			document.getElementsByClassName('start-letter-' + this.appliedFilters.startWith)[0].classList.remove('active-start-letter');
			this.appliedFilters.startWith = undefined;
			this.getEventsPage(this.currentPage);
		},
		//Function for returning the css classes of one letter of the starting-letters filter.
		buildLetterCssClasses(letter) {
			return 'start-letter-' + letter 
					+ (this.filterCriteria.startWith.indexOf(letter) != -1 ?' available' :' ') //Check if there are events starting with that letter and add respective class.
					+ (this.$route.query.startWith == letter ?' active-start-letter' :''); //Check if the letter is currently selected and add respective class.
		}
	},
	created() {
		//Check if you're currently on the archive page or not and change the backend-endpoint for the request accordingly. 
		let endpoint = this.archive ?'archived-events' :'events';
		//Get all the filter information from the backend.
		this.$http.get(backendUrl + '/api/' + endpoint + '/filters')
			.then(response => { 
				this.filterCriteria = response.body.data;
				// this.appliedFilters.firstDate = response.body.data.firstDate;
				// this.appliedFilters.lastDate = response.body.data.lastDate;
			})
			.catch(err => {	});


		/*CHECK ALL THE PARAMETERS OF THE CURRENT ROUTE AND SET THE RESPECTIVE VARIABLES */

		if(this.$router.currentRoute.query.page) {
			this.currentPage = this.$router.currentRoute.query.page;
		}

		if(this.$route.query.itemsPerPage) {
			this.itemsPerPage = this.$route.query.itemsPerPage;
		}

		if(this.$route.query.startWith) {
			this.appliedFilters.startWith = this.$route.query.startWith;
		}

		if(this.$route.query.genre) {
			this.appliedFilters.genre = this.$route.query.genre;
		}

		if(this.$route.query.firstDate) {
			this.appliedFilters.firstDate = this.$route.query.firstDate;
		}

		if(this.$route.query.lastDate) {
			this.appliedFilters.lastDate = this.$route.query.lastDate;
		}

		if(this.$route.query.city) {
			this.filterByCity = true;
			this.appliedFilters.city = this.$route.query.city;
		}

		if(this.$route.query.country) {
			this.filterByCity = false;
			this.appliedFilters.country = this.$route.query.country;
		}
		
		if(this.$route.query.sortBy && this.$route.query.ascending) {
			this.currentlySorted = this.$route.query.sortBy;
			this.sortingAsc[this.$route.query.sortBy] = (this.$route.query.ascending == 'true');
		}
		else {
			this.sortingAsc.startDate = true;
		}
		
		
	},
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsList.scss";
</style>
