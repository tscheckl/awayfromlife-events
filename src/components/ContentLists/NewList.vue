<template>
	<div id="new_list">
		<div class="color-block"></div>
		
		<div class="list-header">

			<h1>Events</h1>

			<div class="create-new">
				<div class="left-container">
					<h3>Create a new Event!</h3>
					<p>and contribute to AWAY FROM LIFE Streets</p>
				</div>
				<div class="right-container">
					<md-icon>arrow_forward</md-icon>
				</div>
			</div>

			<div class="filters">
				<h3>Filter by: </h3>
				<div class="starting-letter-filter">
					<h4>Starting letter</h4>
					<starting-letter-filter></starting-letter-filter>
				</div>

				<div class="additional-filters">
					<div class="genre-filter">
						<h4>Genre</h4>
						<search-select label="genre"
									v-on:change="(selected) => onSelectGenre(selected, index)"
									:options="[]"
									v-model="appliedFilters.genre"
									placeholder="Select Genre">
							<span slot="no-options">Sorry, no matching options..</span>
						</search-select>
					</div>

					<div class="date-filter">
						<h4>Date</h4>
						<div class="datepickers">
							<div class="datepicker-trigger first-date">
								<label class="input-label" for="first-date-trigger">From</label>
								<input id="first-date-trigger" placeholder="first date" type="text" v-model="appliedFilters.firstDate">
								<md-icon>date_range</md-icon>

								<AirbnbStyleDatepicker
									:trigger-element-id="'first-date-trigger'"
									:minDate="appliedFilters.firstDate" 
									:endDate="appliedFilters.lastDate && (appliedFilters.lastDate < filterCriteria.lastDate) 
										? appliedFilters.lastDate
										: filterCriteria.lastDate" 
									:mode="'single'"
									:showActionButtons="false"
									:date-one="appliedFilters.firstDate"
									@date-one-selected="(val) =>  appliedFilters.firstDate = val"
								/>
							</div>
							<div class="datepicker-trigger last-date">
								<label class="input-label" for="last-date-trigger">To</label>
								<input id="last-date-trigger" placeholder="last date" type="text" v-model="appliedFilters.lastDate">
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
						<search-select label="city"
									v-on:change="(selected) => onSelectGenre(selected, index)"
									:options="[]"
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
		
		<div class="list-elements">
			<div class="list-element" v-for="(event, index) in events" :key="index">
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
			</div>
		</div>

			<div class="load-more">
				<p>50 of 574 loaded</p>
				<md-button>Show more</md-button>
				<p>or <a pre href="" v-on:click.prevent="scrollToTop">narrow down the results</a></p>
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
			filterByCity: false,
			currentPage: 1,
			availablePages: 1,
			itemsPerPage: '20',
			displayEvent: {},
			resetForm: false,
			loading: false
		}
	},
	methods: {
		getEvents() {
			this.$http.get(backendUrl + '/api/events/page?page=1' + 
							'&perPage=50' + 
							'&sortBy=date' + 
							'&order=1' + 
							'&includeFestivals=true')
			.then(response => {
				//Check if backend sent data, i.e. not sending an error message.
				console.log(response);
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
		getFullImageRoute(event) {
			return backendUrl + '/' + event.image[1];
		},
		scrollToTop() {
			window.scrollTo({top: 0, behavior: 'smooth'});
		}
	},
	mounted() {
		this.getEvents();
	},
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_newList.scss";
</style>