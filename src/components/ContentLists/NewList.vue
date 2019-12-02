<template>
	<div id="new_list">
		<div class="color-block"></div>
		
		<div class="list-header">
			<h1>Events</h1>

			<router-link to="new-event" class="create-new">
				<div class="left-container">
					<h3>Create a new Event!</h3>
					<p>and contribute to AWAY FROM LIFE Streets</p>
				</div>
				<div class="right-container">
					<md-icon>arrow_forward</md-icon>
				</div>
			</router-link>

			<div class="filters">
				<button v-if="isMobile"  class="md-button close-filters-btn" v-on:click="closeMobileFiltersMenu"><md-icon>close</md-icon></button>
				<h3>Filter by: </h3>
				<div class="starting-letter-filter">
					<h4>Starting letter</h4>
					<loading-skeleton-element v-if="mounting" width="800px" height="25px"></loading-skeleton-element>
					<starting-letter-filter 
						v-else
						:available-letters="filterCriteria.startWith"
						v-on:letter-selected="(letter) => appliedFilters.startWith = letter">
					</starting-letter-filter>
				</div>

				<div class="additional-filters">
					<div class="genre-filter">
						<h4>Genre</h4>
						<loading-skeleton-element v-if="mounting" width="160px" height="30px"></loading-skeleton-element>
						<search-select
						 		v-else
								:options="filterCriteria.genres"
								v-model="appliedFilters.genre"
								placeholder="Select Genre">
							<span slot="no-options">Sorry, no matching options..</span>
						</search-select>
					</div>

					<div class="date-filter">
						<h4>Date</h4>
						<div class="datepickers">
							<loading-skeleton-element v-if="mounting" class="first-date" width="160px" height="30px"></loading-skeleton-element>
							<div class="datepicker-trigger first-date" v-else>
								<span v-if="appliedFilters.firstDate != ''" v-on:click="appliedFilters.firstDate = undefined">
									<md-icon class="clear-selection">close</md-icon>
								</span>
								<label class="input-label" for="first-date-trigger">From</label>
								<input id="first-date-trigger" placeholder="first date" type="text" v-model="appliedFilters.firstDate">
								<md-icon>date_range</md-icon>

								<AirbnbStyleDatepicker
									:trigger-element-id="'first-date-trigger'"
									:minDate="filterCriteria.firstDate" 
									:endDate="appliedFilters.lastDate && (appliedFilters.lastDate < filterCriteria.lastDate) 
										? appliedFilters.lastDate
										: filterCriteria.lastDate" 
									:mode="'single'"
									:showActionButtons="false"
									:date-one="appliedFilters.firstDate"									
									@date-one-selected="(val) => appliedFilters.firstDate = val"
								/>
							</div>
							<loading-skeleton-element v-if="mounting" class="last-date" width="160px" height="30px"></loading-skeleton-element>
							<div class="datepicker-trigger last-date" v-else>
								<label class="input-label" for="last-date-trigger">To</label>
								<input id="last-date-trigger" placeholder="last date" type="text" v-model="appliedFilters.lastDate">
								<span v-if="appliedFilters.lastDate != ''" v-on:click="appliedFilters.lastDate = undefined">
									<md-icon class="clear-selection">close</md-icon>
								</span>
								<md-icon>date_range</md-icon>

								<AirbnbStyleDatepicker
									:trigger-element-id="'last-date-trigger'"
									:minDate="appliedFilters.firstDate > filterCriteria.firstDate 
										? appliedFilters.firstDate 
										: filterCriteria.firstDate" 
									:endDate="filterCriteria.lastDate"
									:mode="'single'"
									:showActionButtons="false"
									:date-one="appliedFilters.lastDate"
									@date-one-selected="(val) =>  appliedFilters.lastDate = val"
								/>
							</div>
						</div>
					</div>

					<div class="city-filter">
						<h4>City</h4>
						<loading-skeleton-element v-if="mounting" width="160px" height="30px"></loading-skeleton-element>
						<div class="filter-dummy dummy-element" v-if="mounting"></div>
						<search-select 
								v-else
								:options="filterCriteria.cities"
								v-model="appliedFilters.city"
								placeholder="Select City">
							<span slot="no-options">Sorry, no matching options..</span>
						</search-select>
					</div>
				</div>

				<button class="md-button md-raised mobile-apply-button" v-on:click="applyMobileFilters">Apply</button>
			</div>
			
			<div class="sorting">
				<h4>Sort by: </h4>
				<div class="filter-dummy dummy-element" v-if="mounting"></div>
				<selector
					v-else
					v-model="currentlySorted"
					label="pretty"
					:options="sortingOptions">
				</selector>
			</div>

			<div class="mobile-list-header">
				<div class="mobile-menu-buttons">
					<button class="md-button md-raised mobile-filter-button" v-on:click="openMobileFiltersMenu">Filter <md-icon>keyboard_arrow_down</md-icon></button>
					<selector
						class="mobile-sorting-button"
						fixedLabel
						selectLabel="Sort by"
						label="pretty"
						v-model="currentlySorted"
						:options="sortingOptions">
					</selector>
				</div>

				<div class="applied-filter-chips" v-if="isMobile">
					<chip v-for="(appliedFilter, key) in actuallyAppliedFilters" :key="key" v-on:remove="clearFilter(key)">
						{{prettierFilterLabel(key).key}}:
						<span class="bold">{{prettierFilterLabel(key).value}}</span>
					</chip>
				</div>
			</div>
		</div>

		
		<div class="initial-loading-message" v-if="mounting || completelyReloading">
			<div class="dummy-elements list-elements">
				<loading-skeleton-element  v-for="(item, index) in 10" :key="index" class="dummy-element list-element" height="120px">
					<loading-skeleton-element class="dummy-image" height="100%" width="140px"></loading-skeleton-element>
					<loading-skeleton-element class="dummy-information">
						<loading-skeleton-element class="dummy-title" width="60%" height="25px"></loading-skeleton-element>
						<loading-skeleton-element class="dummy-description" height="15px"></loading-skeleton-element>
						<loading-skeleton-element class="dummy-additional" height="15px"></loading-skeleton-element>
					</loading-skeleton-element>
				</loading-skeleton-element>
			</div>
			<md-spinner md-indeterminate></md-spinner>
		</div>
		<div class="list-body" v-if="!mounting && !completelyReloading">
			<div v-if="previousLoadable || loadingPrevious" class="load-more load-less">
				<md-button  v-if="!loadingPrevious" v-on:click="getPreviousEvents">Show previous</md-button>
				<md-spinner v-else md-indeterminate></md-spinner>
			</div>
			
			<div class="list-elements">
				<router-link v-for="(event, index) in events" :to="`/${event.isFestival ?'festival' :'event'}/${event.url}`" class="list-element" :key="index">
					<div class="image-container">
						<div class="image" :style="'background-image:url(' + getFullImageRoute(event) + ')'"></div>
						<div class="color-seperator"></div>
					</div>
					<div class="element-info">
						<h4 class="event-date">{{event.formattedDate}}</h4>
						<h3 class="event-name">{{event.name}}</h3>
						<p class="event-location">{{event.location.name}}, {{event.location.address.city}}, {{event.location.address.country}}</p>
						<p class="event-bands">
							<span v-for="(band, index) in event.bands" :key="index">{{band.name}}</span>
						</p>
					</div>
				</router-link>

				<div v-if="events.length == 0" class="no-events">
					<h3>:(</h3>
					<h3>No events found...</h3>
				</div>
			</div>

			<div class="load-more">
				<p>Showing {{events.length}} of {{totalItemsCount}} available events</p>
				<div v-if="events.length < totalItemsCount && !loadingNext">
					<md-button v-on:click="getNextEvents">Show more</md-button>
					<p>or <a pre href="" v-on:click.prevent="scrollToTop">narrow down the results</a></p>
				</div>				
				<md-spinner v-if="loadingNext" md-indeterminate></md-spinner>
			</div>
		</div>

		<div class="not-found-message">
			<p>Didn't find what you were looking for?</p>
			<p>If you feel like something is missing, you can contribute to this platform and <router-link to="">create a new !</router-link></p>
		</div>
	</div>
</template>

<script>
import {backendUrl} from '@/secrets.js';

import moment from 'moment';

import StartingLetterFilter from './StartingLetterFilter';
import SearchSelect from '@/components/Utilities/SearchSelect';
import Selector from '@/components/Utilities/Selector';
import LoadingSkeletonElement from '@/components/Utilities/LoadingSkeletonElement';
import Chip from '@/components/Utilities/Chip';

export default {
	name: 'new-list',
	components: {
		StartingLetterFilter,
		SearchSelect,
		Selector,
		LoadingSkeletonElement,
		Chip
	},
	data() {
		return {
			events: [],
			locations: [],
			totalItemsCount: 0,
			previousLoadable: false,
			previousPageLoadedTo: 0,
			sortingOptions: [
				{
					name: 'date',
					direction: 1,
					pretty: 'Date ascending'
				},
				{
					name: 'date',
					direction: -1,
					pretty: 'Date descending'
				},
				{
					name: 'lastModified',
					direction: -1,
					pretty: 'Latest'
				},
				{
					name: 'name',
					direction: 1,
					pretty: 'Name ascending'
				},
				{
					name: 'date',
					direction: -1,
					pretty: 'Name descending'
				}
			],
			currentlySorted: {
				name: 'date',
				direction: 1,
				pretty: 'Date ascending'
			},
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
				firstDate: undefined,
				lastDate: undefined,
				genre: undefined
			},
			currentPage: Number,
			availablePages: 1,
			itemsPerPage: '20',
			loadingNext: false,
			loadingPrevious: false,
			completelyReloading: false,
			mounting: false,
			isMobile: false
		}
	},
	computed: {
		actuallyAppliedFilters() {
			let actuallyAppliedFilters = {};
			for(let key in this.appliedFilters) {
				if(this.appliedFilters[key])
					actuallyAppliedFilters[key] = this.appliedFilters[key];
			}
			return actuallyAppliedFilters;
		},
		prettySortingOptions() {
			return this.sortingOptions.map(sortingOption => sortingOption.pretty);
		}
	},
	watch: {
		appliedFilters: {
			handler: function() {
				this.buildUrl();
			},
			deep: true
		},
		currentlySorted: {
			handler: function() {
				this.buildUrl();
			},
			deep: true
		},
	},
	methods: {
		async getEventsPage(page) {
			let response = {};

			const appliedFilters = this.appliedFilters;
			let requestRoute = 
				backendUrl + '/api/events/page'
				+ '?page=' + page
				+ '&perPage=50'
				+ '&sortBy=' + this.currentlySorted.name
				+ '&order=' + this.currentlySorted.direction
				+ (appliedFilters.startWith ? '&startWith=' + encodeURIComponent(appliedFilters.startWith) : '')
				+ (appliedFilters.genre ?('&genre=' + appliedFilters.genre) :'')
				+ (appliedFilters.city ?('&city=' + appliedFilters.city) :'')
				+ (appliedFilters.firstDate ?('&startDate=' + appliedFilters.firstDate) :'')
				+ (appliedFilters.lastDate ?('&endDate=' + appliedFilters.lastDate) :'')
				+ '&includeFestivals=true';

			try {
				response = await this.$http.get(requestRoute);
			}
			catch(err) {
				return [];
			}
			let newEvents = [];
			if(response.body.data) {
				newEvents = response.body.data;
			}
			this.availablePages = response.body.pages;
			this.totalItemsCount = response.body.totalCount;			

			for(let event of newEvents) {
				//Add formatted date Attribute to each event for displaying the date in the list.
				event.formattedDate = moment(event.date).format('LL');
			}

			// this.loading = false;
			//Fade filters out on mobile
			// document.getElementsByClassName('show-filters-button')[0].classList.remove('opened');
			// document.getElementsByClassName('filters')[0].classList.remove('show-filters');
			
			return newEvents;
		},
		async getNextEvents() {
			this.currentPage++;
			this.loadingNext = true;

			this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
			
			if(this.currentPage == 1)
				this.previousLoadable = false;
				
			let nextEvents = await this.getEventsPage(this.currentPage);
			this.events = this.events.concat(nextEvents);
			this.loadingNext = false;
		},
		async getPreviousEvents() {
			this.loadingPrevious = true;

			this.previousPageLoadedTo--;
			if(this.previousPageLoadedTo == 1)
				this.previousLoadable = false;

			let previousEvents = await this.getEventsPage(this.previousPageLoadedTo);

			this.events = previousEvents.concat(this.events);				
			
			this.loadingPrevious = false;
		},
		async applyNewFilters() {
			this.completelyReloading = true;
			if(!this.mounting) {
				this.currentPage = 1;
				this.previousLoadable = false;
				this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
			}
			this.events = await this.getEventsPage(this.currentPage);
			this.completelyReloading = false;
		},
		getFullImageRoute(event) {
			return backendUrl + '/' + event.image[1];
		},
		scrollToTop() {
			window.scrollTo({top: 0, behavior: 'smooth'});
		},
		openMobileFiltersMenu() {
			document.getElementsByClassName('filters')[0].classList.add('opened');
		},
		closeMobileFiltersMenu() {			
			document.getElementsByClassName('filters')[0].classList.remove('opened');
		},
		async applyMobileFilters() {
			this.closeMobileFiltersMenu();
			await this.applyNewFilters();
		},
		prettierFilterLabel(key) {
			let prettierKey = key;
			switch(key) {
				case 'startWith':
					prettierKey = 'starting letter';
					break;
				case 'firstDate':
					prettierKey = 'first date';
					break;
				case 'lastDate': 
					prettierKey = 'last date';
			}

			let prettierValue = this.actuallyAppliedFilters[key];
			if(this.actuallyAppliedFilters[key].label)
				prettierValue = this.actuallyAppliedFilters[key].label;

			return {
				key: prettierKey,
				value: prettierValue
			};
		},
		async clearFilter(key) {
			this.appliedFilters[key] = undefined;
			
			
			await this.applyNewFilters();
		},
		async buildUrl() {
			let query = {};

			if(this.currentPage)
				query.page = this.currentPage;
			if(this.appliedFilters.startWith)
				query.startWith = this.appliedFilters.startWith;
			if(this.appliedFilters.genre)
				query.genre = this.appliedFilters.genre.label
			if(this.appliedFilters.firstDate)
				query.firstDate = this.appliedFilters.firstDate
			if(this.appliedFilters.lastDate)
				query.lastDate = this.appliedFilters.lastDate
			if(this.appliedFilters.city)
				query.city = this.appliedFilters.city.label
			if(!(this.currentlySorted.name == 'date' && this.currentlySorted.direction == 1)) {
				query.sortBy = this.currentlySorted.name;
				query.sortingDirection = this.currentlySorted.direction;
			}

			if(query != this.$route.query)
				this.$router.push({query: query});

			if(!this.isMobile)
				await this.applyNewFilters();
		},
		applyQuerySorting(sortBy, direction) {
			this.currentlySorted = this.sortingOptions.find(sortingOption => sortingOption.name == sortBy && sortingOption.direction == parseInt(direction));
		}
	},
	async mounted() {
		this.mounting = true;

		const pageFromRoute = this.$route.query.page || 1;
		
		
		//Check if you're currently on the archive page or not and change the backend-endpoint for the request accordingly. 
		let endpoint = this.archive ?'archived-events' :'events';
		this.$http.get(backendUrl + '/api/' + endpoint + '/filters?includeFestivals=true')
			.then(response => { 				
				this.filterCriteria = response.body.data;
				let newGenres = this.filterCriteria.genres.map(genre => {
					return {label: genre};
				});
				this.filterCriteria.genres = newGenres;

				let newCities = this.filterCriteria.cities.map(city => {
					return {label: city};
				});
				this.filterCriteria.cities = newCities;
				console.log(this.filterCriteria);
			})
			.catch(err => console.log(err));

		const query = this.$route.query;
		if(query.startWith)
			this.appliedFilters.startWith = query.startWith;
		if(query.firstDate)
			this.appliedFilters.firstDate = query.firstDate;
		if(query.lastDate)
			this.appliedFilters.lastDate = query.lastDate;
		if(query.genre)
			this.appliedFilters.genre = {label: query.genre};
		if(query.city)
			this.appliedFilters.city = {label: query.city};
		if(query.sortBy && query.sortingDirection)
			this.applyQuerySorting(query.sortBy, query.sortingDirection);

		this.currentPage = pageFromRoute;
		this.events = await this.getEventsPage(this.currentPage);
		if(this.currentPage != 1) {			
			this.previousLoadable = true; 
			this.previousPageLoadedTo = this.currentPage;
		}
		
		if(window.innerWidth <= 768)
			this.isMobile = true;

		this.mounting = false;
	},
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_newList.scss";
</style>