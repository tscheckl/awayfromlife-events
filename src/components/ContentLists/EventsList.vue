<template>
	<div id="events_list">
		<div class="list-header">
			<div class="header-line">	
				<div class="left-container">
					<h1>{{archive ?'Events Archive' :'All Events'}}</h1>
				</div>

				<router-link to="new-event">
					<md-button class="md-raised create-content-btn"><md-icon>add</md-icon>Create new Event</md-button>
				</router-link>				
			</div>

			
			<h3 class="show-filters-button" v-on:click="toggleFilters">
				<md-icon>filter_list</md-icon> 
				<span>Filter Results</span> 
				<md-icon>keyboard_arrow_right</md-icon>
			</h3>
			<div class="filters">
				<h3>Events from A to Z: </h3>
				<ul class="starting-letter-filter">
					<li v-for="i in 26" :key="i" :class="buildLetterCssClasses((i+9).toString(36).toUpperCase())">
						<span v-on:click="filterCriteria.startWith.indexOf((i+9).toString(36).toUpperCase()) != -1 ?filterByStartingLetter((i+9).toString(36).toUpperCase()) :''"> 
							{{(i+9).toString(36).toUpperCase()}}
						</span>
						<div v-on:click="clearStartLetter">
							<md-icon v-if="appliedFilters.startWith == (i+9).toString(36).toUpperCase()">clear</md-icon>
						</div>
					</li>
					<li :class="buildLetterCssClasses('#')">
						<span v-on:click="filterCriteria.startWith.indexOf('#') != -1 ?filterByStartingLetter('#') :''">
							#
						</span>
						<div v-on:click="clearStartLetter">
							<md-icon v-if="appliedFilters.startWith == '#'">clear</md-icon>
						</div>
					</li>
				</ul>

				<h3 class="filters-header">Additional Filters: </h3>
				<div class="additional-filters">
					<md-input-container class="genre-select">
						<span class="input-label" v-if="appliedFilters.genre && appliedFilters.genre != ''">Genre</span>
						<v-select class="form-v-select"
								  :options="filterCriteria.genres"
								  v-model="appliedFilters.genre"
								  placeholder="Genre">
						</v-select>
					</md-input-container>
					<!-- <md-input-container class="date-select">
						<span class="input-label" v-if="appliedFilters.firstDate != ''">From</span>						 -->
					<div class="datepicker-trigger">
						<md-input-container>
							<label>From</label>
							<md-input id="first-date-trigger" v-model="appliedFilters.firstDate" required></md-input>
						</md-input-container>

						<AirbnbStyleDatepicker
							:trigger-element-id="'first-date-trigger'"
							:minDate="appliedFilters.firstDate" 
							:endDate="appliedFilters.lastDate && (appliedFilters.lastDate < filterCriteria.lastDate) 
								? appliedFilters.lastDate
								: filterCriteria.lastDate" 
							:offsetY="0"
							:mode="'single'"
							:showActionButtons="false"
							:date-one="appliedFilters.firstDate"
							@date-one-selected="(val) =>  appliedFilters.firstDate = val"
						/>
					</div>
					<!-- </md-input-container> -->
					<!-- <md-input-container class="date-select">
						<span class="input-label" v-if="appliedFilters.lastDate != ''">To</span>				 -->
						<div class="datepicker-trigger">
							<md-input-container>
								<label>To</label>
								<md-input id="last-date-trigger" v-model="appliedFilters.lastDate" required></md-input>
							</md-input-container>

							<AirbnbStyleDatepicker
								:trigger-element-id="'last-date-trigger'"
								:minDate="appliedFilters.firstDate > filterCriteria.firstDate 
								  	? appliedFilters.firstDate 
									: filterCriteria.firstDate" 
								:endDate="filterCriteria.lastDate"
								:offsetY="-300"
								:mode="'single'"
								:showActionButtons="false"
								:date-one="appliedFilters.lastDate"
								@date-one-selected="(val) =>  appliedFilters.lastDate = val"
							/>
						</div>
						<!-- <datetime v-model="appliedFilters.lastDate" 
								  type="date" 
								  :min-datetime="appliedFilters.firstDate > filterCriteria.firstDate 
								  	? appliedFilters.firstDate 
									: filterCriteria.firstDate" 
								  :max-datetime="filterCriteria.lastDate"
								  placeholder="To" 
								  input-format="DD-MM-YYYY">
						</datetime> -->
					<!-- </md-input-container> -->

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
							<v-select class="form-v-select"
									  :options="filterCriteria.cities"
									  v-model="appliedFilters.city"
									  placeholder="City">
							</v-select>
						</md-input-container>

						<md-input-container class="country-select" v-if="!filterByCity">
							<span class="input-label" v-if="appliedFilters.country && appliedFilters.country != ''">Country</span>
							<v-select class="form-v-select"
									  :options="filterCriteria.countries"
									  v-model="appliedFilters.country"
									  placeholder="Country">
							</v-select>
						</md-input-container>
					</div>
				</div>
				
				<md-button v-if="appliedFilters.startWith || appliedFilters.genre || appliedFilters.country || appliedFilters.city || appliedFilters.firstDate || appliedFilters.lastDate" 
						   class="clear-filters-button" 
						   v-on:click="clearFilters">
						   		<md-icon>restore</md-icon> Reset Filters
				</md-button>
			</div>
		</div>

		<div class="color-block"></div>

		<div class="all-items">

			<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>

			<div class="list-content" v-if="!loading">
				<h3 class="no-items-title" v-if="events.length == 0">No Events found..</h3>

				<div class="list-item-header" v-if="events.length > 0">
					<p class="event-date" v-on:click="sortBy('date')">
						<span>When?
							<md-icon v-if="currentlySorted == 'date'">{{!sortingAsc.date? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p> 
					<p class="item-title" v-on:click="sortBy('name')">
						<span>What? 
							<md-icon v-if="currentlySorted == 'name'">{{!sortingAsc.name? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p>
					<p class="location-name" v-on:click="sortBy('location')">
						<span>Where? 
							<md-icon v-if="currentlySorted == 'location'">{{!sortingAsc.location? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p>
					<md-icon class="hidden-icon"></md-icon>
				</div>

				<div v-for="(event, index) in events" :key="index" v-on:click="showEvent(event, index)">
					<router-link :to="`/${event.isFestival ?'festival' :'event'}/${event.url}`" class="list-item">
						<p class="event-date">{{event.formattedDate}}</p>
						<h3 class="item-title">{{event.name}}</h3>
						<p class="location-name" v-if="event.location"><b>{{event.location.name}}</b> {{event.location.address.city}}</p>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</router-link>
				</div>
			</div>

			<div class="list-footer">
				<div class="pages">
					<span class="page-btn" v-on:click="currentPage > 1 ? changeCurrentPage(currentPage-1): ''"><md-icon>keyboard_arrow_left</md-icon></span>
					<span v-for="number in smallerPages()" :key="number" v-on:click="changeCurrentPage(number)">{{number}}</span>
					<span class="current-page">{{currentPage}}</span>
					<span v-for="number in biggerPages()" :key="number" v-on:click="changeCurrentPage(number)">{{number}}</span>
					<span class="page-btn" v-on:click="(currentPage < availablePages)? changeCurrentPage(currentPage+1): ''"><md-icon>keyboard_arrow_right</md-icon></span>
				</div>
				
				<selector
					v-model="itemsPerPage"
					selectLabel="Items per Page"
					:options="[5,10,20,50]">
				</selector>
			</div>
		</div>

		<md-dialog ref="newEventDialog">
			<new-event 
					v-on:success="handleDialogClose('newEventDialog', true)" 
					v-on:close="$refs['newEventDialog'].close();">
			</new-event>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span>New event(s) successfully created! <br> <b>It will be visible for everyone after it was verified by us.</b></span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import {backendUrl} from '@/secrets.js';

import moment from 'moment';

import NewEvent from "@/components/NewContent/NewEvent";
import Selector from '@/components/Utilities/Selector';


export default {
	name: 'events-list',
	components: {
		NewEvent,
		Selector
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
				date: false,
				name: false,
				location: false
			},
			currentlySorted: 'date',
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
				this.buildUrl();
				this.getEventsPage(this.currentPage);
			},
			deep: true
		},
		$route(to, from) {
				this.getEventsPage(to.query.page);		
		},
		itemsPerPage() {
			this.buildUrl();
		}
	},
	methods: {
		//Function for giving the Single-Event dialog the data of the clicked event and opening it.
		showEvent(event, index) {
			this.$store.commit('setCurrentEvent', event);
			
			if(!event.isFestival)
				this.$router.push({path: `/event/${event.url}`});
			else
				this.$router.push({path: `/festival/${event.url}`});
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
		},
		//Get all events for the given page number.
		getEventsPage(page) {
			this.loading = true;
			this.checkUrlParams();

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
							'&includeFestivals=true' + 
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
					event.formattedDate = moment(event.date).format('LL');
				}
				this.loading = false;

				//Fade filters out on mobile
				document.getElementsByClassName('show-filters-button')[0].classList.remove('opened');
				document.getElementsByClassName('filters')[0].classList.remove('show-filters');
			})
			.catch(err => {
				this.loading = false;
			});
		},
		//Function for building the current route with all query-parameters.
		buildUrl() {
			let query = {
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
			};
			if(query != this.$route.query)
				this.$router.push({query: query});
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
			this.$refs.snackbar.open();
			this.getEventsPage(this.currentPage);
		},
		//Function for adding a starting-letter filter to the list.
		filterByStartingLetter(letter) {
			if(this.appliedFilters.startWith)
				document.getElementsByClassName('start-letter-' + this.appliedFilters.startWith)[0].classList.remove('active-start-letter');

			this.appliedFilters.startWith = letter;
			document.getElementsByClassName('start-letter-' + letter)[0].classList.add('active-start-letter');
		},
		//Function for clearing the starting-letter-filter.
		clearStartLetter() {
			document.getElementsByClassName('start-letter-' + this.appliedFilters.startWith)[0].classList.remove('active-start-letter');
			this.appliedFilters.startWith = undefined;
		},
		//Function for clearing all additional filters.
		clearFilters() {
			this.appliedFilters = {
				startWith: undefined,
				city: undefined,
				country: undefined,
				firstDate: '',
				lastDate: '',
				genre: undefined
			}
		},
		//Function for returning the css classes of one letter of the starting-letters filter.
		buildLetterCssClasses(letter) {
			return 'start-letter-' + letter 
					+ (this.filterCriteria.startWith.indexOf(letter) != -1 ?' available' :' ') //Check if there are events starting with that letter and add respective class.
					+ (this.$route.query.startWith == letter ?' active-start-letter' :''); //Check if the letter is currently selected and add respective class.
		},
		toggleFilters() {
			document.getElementsByClassName('show-filters-button')[0].classList.toggle('opened');
			document.getElementsByClassName('filters')[0].classList.toggle('show-filters');
		},
		changeCurrentPage(page) {
			this.currentPage = page;
			this.buildUrl();
		},
		checkUrlParams() {
			if(this.$route.query.itemsPerPage) {
				this.itemsPerPage = this.$route.query.itemsPerPage;
			}
			else {
				this.itemsPerPage = 20;
			}

			if(this.$route.query.startWith) {
				this.appliedFilters.startWith = this.$route.query.startWith;
			}
			else {
				this.appliedFilters.startWith = '';
			}

			if(this.$route.query.genre) {
				this.appliedFilters.genre = this.$route.query.genre;
			}
			else {
				this.appliedFilters.genre = '';
			}

			if(this.$route.query.firstDate) {
				this.appliedFilters.firstDate = this.$route.query.firstDate;
			}
			else {
				this.appliedFilters.firstDate = '';
			}

			if(this.$route.query.lastDate) {
				this.appliedFilters.lastDate = this.$route.query.lastDate;
			}
			else {
				this.appliedFilters.lastDate = '';
			}

			if(this.$route.query.country) {
				this.filterByCity = false;
				this.appliedFilters.country = this.$route.query.country;
			}
			else {
				this.appliedFilters.country  = '';
			}

			if(this.$route.query.city) {
				this.filterByCity = true;
				this.appliedFilters.city = this.$route.query.city;
			}
			else {
				this.filterByCity = false;
				this.appliedFilters.city = '';
			}
		}
	},
	created() {
		//Check if you're currently on the archive page or not and change the backend-endpoint for the request accordingly. 
		let endpoint = this.archive ?'archived-events' :'events';
		//Get all the filter information from the backend.
		this.$http.get(backendUrl + '/api/' + endpoint + '/filters?includeFestivals=true')
			.then(response => { 
				this.filterCriteria = response.body.data;
				// this.appliedFilters.firstDate = response.body.data.firstDate;
				// this.appliedFilters.lastDate = response.body.data.lastDate;
			})
			.catch(err => console.log(err));


		/*CHECK ALL THE PARAMETERS OF THE CURRENT ROUTE AND SET THE RESPECTIVE VARIABLES */

		if(this.$router.currentRoute.query.page) {
			this.currentPage = this.$router.currentRoute.query.page;
		}
		
		if(this.$route.query.sortBy && this.$route.query.ascending) {
			this.currentlySorted = this.$route.query.sortBy;
			this.sortingAsc[this.$route.query.sortBy] = (this.$route.query.ascending == 'true');
		}
		else {
			this.sortingAsc.date = true;
		}
		
		this.getEventsPage(this.currentPage);
	},
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsList.scss";
</style>
