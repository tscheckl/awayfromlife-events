<template>
	<div id="event_list">
		<list
			contentType="Event"
			:data="events"
			:totalItemsCount="totalItemsCount"
			:page="currentPage"
			:completelyReloading="completelyReloading"
			:loading="loading"
			:dataMounting="mounting"
			:sortingOptions="sortingOptions"
			:currentlySorted="currentlySorted"
			:appliedFilters="appliedFilters"
			:prettierKey="prettierKey"
			v-on:loadMore="getNextEvents"
			v-on:loadPrevious="previousPage => getPreviousEvents(previousPage)"
			v-on:sortingChanged="newSorting => currentlySorted = newSorting"
			v-on:applyMobileFilters="applyNewFilters"
			v-on:filterCleared="key => clearFilter(key)"
		>
			<div class="passed-in-filters" slot="filters">
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
							<search-select 
									v-else
									:options="filterCriteria.cities"
									v-model="appliedFilters.city"
									placeholder="Select City">
								<span slot="no-options">Sorry, no matching options..</span>
							</search-select>
						</div>
					</div>					
				</div>

			<div slot="list-elements" class="list-element" v-for="(event, index) in events" :key="index" v-on:click="setCurrentEvent(event)">
				<router-link  :to="`/${event.isFestival ?'festival' :'event'}/${event.url}`">
					<div class="image-container">
						<img :src="getFullImageRoute(event)" @error="getPlaceholderImage" class="image" :alt="'preview image for ' + event.name">
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
			</div>
		</list>
	</div>
</template>

<script>
import {backendUrl} from '@/secrets.js';

import moment from 'moment';

import List from '@/components/ContentLists/List';
import StartingLetterFilter from '@/components/ContentLists/StartingLetterFilter';
import Selector from '@/components/Utilities/Selector';
import LoadingSkeletonElement from '@/components/Utilities/LoadingSkeletonElement';
import SearchSelect from '@/components/Utilities/SearchSelect';

export default {
	name: 'new-list',
	components: {
		List,
		StartingLetterFilter,
		Selector,
		LoadingSkeletonElement,
		SearchSelect
	},
	data() {
		return {
			events: [],
			locations: [],
			totalItemsCount: 0,
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
			currentPage: 0,
			availablePages: 1,
			itemsPerPage: '20',
			loading: false,
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
			handler: async function() {
				this.buildUrl();
				
				if(this.isMobile)
					await this.applyNewFilters();
			},
			deep: true
		},
	},
	methods: {
		setCurrentEvent(event) {			
			this.$store.commit('setCurrentEvent', event);
		},
		async getEventsPage(page) {
			this.loading = true;

			let response = {};

			const appliedFilters = this.appliedFilters;
			let requestRoute = 
				backendUrl + '/api/events/page'
				+ '?page=' + page
				+ '&perPage=50'
				+ '&sortBy=' + this.currentlySorted.name
				+ '&order=' + this.currentlySorted.direction
				+ (appliedFilters.startWith ? '&startWith=' + encodeURIComponent(appliedFilters.startWith) : '')
				+ (appliedFilters.genre ?('&genre=' + appliedFilters.genre.label) :'')
				+ (appliedFilters.city ?('&city=' + appliedFilters.city) :'')
				+ (appliedFilters.firstDate ?('&startDate=' + appliedFilters.firstDate) :'')
				+ (appliedFilters.lastDate ?('&endDate=' + appliedFilters.lastDate) :'')
				+ '&includeFestivals=true';

			console.log(appliedFilters.genre);
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
			
			this.loading = false;

			return newEvents;
		},
		async getNextEvents() {
			this.currentPage++;

			this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
				
			let nextEvents = await this.getEventsPage(this.currentPage);
			this.events = this.events.concat(nextEvents);
		},
		async getPreviousEvents(previousPage) {
			let previousEvents = await this.getEventsPage(previousPage);

			this.events = previousEvents.concat(this.events);			
		},
		async applyNewFilters() {
			this.completelyReloading = true;

			if(!this.mounting) {
				console.log('not this again');
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
		getPlaceholderImage(e) {
			e.target.src = backendUrl + '/images/placeholders/1_M.jpg';
		},
		async applyMobileFilters() {
			this.closeMobileFiltersMenu();
			await this.applyNewFilters();
		},
		prettierKey(key) {
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

			return prettierKey;
		},
		async clearFilter(key) {
			this.appliedFilters[key] = undefined;
			
			
			await this.applyNewFilters();
		},
		async buildUrl() {
			let query = {};

			if(this.currentPage)
				query.page = String(this.currentPage);
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
			if(JSON.stringify(query) != JSON.stringify(this.$route.query)) {
				console.log('new query', query);
				console.log('route query', this.$route.query);
				console.log('im the one to blame');
				this.$router.push({query: query});
				
				if(!this.isMobile)
					await this.applyNewFilters();
			}

		},
		applyQuerySorting(sortBy, direction) {
			this.currentlySorted = this.sortingOptions.find(sortingOption => sortingOption.name == sortBy && sortingOption.direction == parseInt(direction));
		}
	},
	async mounted() {
		this.mounting = true;

		const pageFromRoute = parseInt(this.$route.query.page) || 1;
		
		
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
		
		if(window.innerWidth <= 768)
			this.isMobile = true;

		this.mounting = false;
	},
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_newEventsList.scss";
</style>