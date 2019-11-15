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
				<h3>Filter by: </h3>
				<div class="starting-letter-filter">
					<h4>Starting letter</h4>
					<starting-letter-filter 
						:available-letters="filterCriteria.startWith"
						v-on:letter-selected="(letter) => onSelectStartingLetter(letter)">
					</starting-letter-filter>
				</div>

				<div class="additional-filters">
					<div class="genre-filter">
						<h4>Genre</h4>
						<search-select
								v-on:change="(selectedGenre) => onSelectGenre(selectedGenre)"
								:options="filterCriteria.genres"
								v-model="appliedFilters.genre"
								placeholder="Select Genre">
							<span slot="no-options">Sorry, no matching options..</span>
						</search-select>
					</div>

					<div class="date-filter">
						<h4>Date</h4>
						<div class="datepickers">
							<div class="datepicker-trigger first-date">
								<span v-if="appliedFilters.firstDate != ''" v-on:click="onFirstDateSelected('')">
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
									@date-one-selected="(val) =>  onFirstDateSelected(val)"
								/>
							</div>
							<div class="datepicker-trigger last-date">
								<label class="input-label" for="last-date-trigger">To</label>
								<input id="last-date-trigger" placeholder="last date" type="text" v-model="appliedFilters.lastDate">
								<span v-if="appliedFilters.lastDate != ''" v-on:click="onLastDateSelected('')">
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
									@date-one-selected="(val) =>  onLastDateSelected(val)"
								/>
							</div>
						</div>
					</div>

					<div class="city-filter">
						<h4>City</h4>
						<search-select 
								v-on:change="(selectedCity) => onSelectCity(selectedCity)"
								:options="filterCriteria.cities"
								v-model="appliedFilters.city"
								placeholder="Select City">
							<span slot="no-options">Sorry, no matching options..</span>
						</search-select>
					</div>
				</div>
			</div>

			<div class="sorting">
				<h4>Sort by: </h4>
				<selector
					v-model="currentSorting"
					:options="['Date ascending','Date descending', 'Latest', 'Name ascending', 'Name descending']">
				</selector>
			</div>
		</div>
		
		<div class="initial-loading-message" v-if="mounting">
			<div class="dummy-elements list-elements">
				<div class="dummy-element list-element" v-for="(item, index) in 10" :key="index">
					<div class="dummy-image"></div>
					<div class="dummy-information">
						<div class="dummy-title"></div>
						<div class="dummy-description"></div>
						<div class="dummy-additional"></div>
					</div>
				</div>
			</div>
			<md-spinner md-indeterminate></md-spinner>
		</div>
		<div class="list-body" v-if="!mounting">
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

export default {
	name: 'new-list',
	components: {
		StartingLetterFilter,
		SearchSelect,
		Selector
	},
	data() {
		return {
			events: [],
			locations: [],
			totalItemsCount: 0,
			previousLoadable: false,
			previousPageLoadedTo: 0,
			sortingAsc: {
				date: false,
				name: false,
				location: false
			},
			currentSorting: 'Date ascending',
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
			currentPage: Number,
			availablePages: 1,
			itemsPerPage: '20',
			loadingNext: false,
			loadingPrevious: false,
			mounting: false
		}
	},
	methods: {
		async getEventsPage(page) {
			let response = {};
			// this.loading = true;

			const query = this.$route.query;
			let requestRoute = 
				backendUrl + '/api/events/page'
				+ '?page=' + page
				+ '&perPage=50'
				+ '&sortBy=' + this.currentlySorted
				+ '&order=1'
				+ (query.startWith ? '&startWith=' + encodeURIComponent(query.startWith) : '')
				+ (query.genre ?('&genre=' + query.genre) :'')
				+ (query.city ?('&city=' + query.city) :'')
				+ (query.firstDate ?('&startDate=' + query.firstDate) :'')
				+ (query.lastDate ?('&endDate=' + query.lastDate) :'')
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
			if(!this.mounting) {
				this.currentPage = 1;
				this.previousLoadable = false;
				this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
			}
			this.events = await this.getEventsPage(this.currentPage);
		},
		getFullImageRoute(event) {
			return backendUrl + '/' + event.image[1];
		},
		scrollToTop() {
			window.scrollTo({top: 0, behavior: 'smooth'});
		},
		async onSelectCity(selectedCity) {
			this.$router.replace({query: {...this.$route.query, city: selectedCity.label}});
			await this.applyNewFilters();
		},
		async onSelectGenre(selectedGenre) {
			this.$router.replace({query: {...this.$route.query, genre: selectedGenre.label}});
			await this.applyNewFilters();
		},
		async onSelectStartingLetter(selectedLetter) {
			this.$router.replace({query: {...this.$route.query, startWith: selectedLetter}});
			await this.applyNewFilters();
		},
		async onFirstDateSelected(selectedDate) {
			console.log('fisch');
			this.appliedFilters.firstDate = selectedDate;
			this.$router.replace({query: {...this.$route.query, firstDate: selectedDate}});
			await this.applyNewFilters();
		},
		async onLastDateSelected(selectedDate) {
			this.appliedFilters.lastDate = selectedDate;
			this.$router.replace({query: {...this.$route.query, lastDate: selectedDate}});
			await this.applyNewFilters();
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

		this.currentPage = pageFromRoute;
		this.events = await this.getEventsPage(this.currentPage);
		if(this.currentPage != 1) {			
			this.previousLoadable = true; 
			this.previousPageLoadedTo = this.currentPage;
		}
		this.mounting = false;
	},
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_newList.scss";
</style>