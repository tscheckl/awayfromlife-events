<template>
	<div id="events_list">
		<general-list 
			title="All Events"
			contentType="events"
			:data="events"
			:displayedColumns="displayedColumns"
			:availablePages="availablePages"
			:loading="loading"
			>
			<div slot="filters">
				<starting-letter-filter 
					contentType="events"
					:availableLetters="filterCriteria.startWith">
				</starting-letter-filter>

				<div class="switch-select">
					<md-input-container class="genre-select">
						<span class="input-label" v-if="appliedFilters.genre && appliedFilters.genre != ''">Genre</span>
						<v-select class="form-v-select"
									:options="filterCriteria.genres"
									v-model="appliedFilters.genre"
									placeholder="Genre">
						</v-select>
					</md-input-container>

					<md-input-container class="date-select">	
						<div class="datepicker-trigger first-date">
							<label class="input-label" v-if="appliedFilters.firstDate != ''" for="last-date-trigger">From</label>
							<input id="first-date-trigger" placeholder="From" type="text" v-model="appliedFilters.firstDate">

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
					</md-input-container>
					<md-input-container class="date-select">
						<div class="datepicker-trigger last-date">
							<label class="input-label" v-if="appliedFilters.lastDate != ''" for="last-date-trigger">To</label>
							<input id="last-date-trigger" placeholder="To" type="text" v-model="appliedFilters.lastDate">

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
					</md-input-container>

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
		</general-list>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';

import moment from 'moment';

import GeneralList from './GeneralList';
import StartingLetterFilter from './StartingLetterFilter';

export default {
	name: 'events-list-new',
	components: {
		GeneralList,
		StartingLetterFilter
	},
	data() {
		return {
			events: [],
			displayedColumns: [
				{
					displayName: 'When?',
					attributes: ['formattedDate'],
					isArray: false,
				},
				{
					displayName: 'What?',
					attributes: ['name'],
					isArray: true,
				},
				{
					displayName: 'Where?',
					attributes: ['formattedLocation'],
					isArray: false,
				},
			],
			appliedFilters: {
				startWith: undefined,
				genre: undefined,
				firstDate: undefined,
				lastDate: undefined,
				city: undefined,
				country: undefined
			},
			filterCriteria: {},
			loading: false
		}
	},
	watch: {
		$route(to, from) {
			this.getCurrentPage();
		},
		computedFirstDate(value) {
			let newQuery = {...this.$route.query, firstDate: value};
			this.$router.push({query: newQuery});
		},
		computedLastDate(value) {
			let newQuery = {...this.$route.query, lastDate: value};
			this.$router.push({query: newQuery});
		},
		computedGenre(value) {
			let newQuery = {...this.$route.query, genre: value};
			this.$router.push({query: newQuery});
		},
		computedCity(value) {
			let newQuery = {...this.$route.query, city: value};
			this.$router.push({query: newQuery});
		},
		computedCountry(value) {
			let newQuery = {...this.$route.query, country: value};
			this.$router.push({query: newQuery});
		},
	},
	computed: {
		computedGenre() {
			return this.appliedFilters.genre;
		},
		computedGenre() {
			return this.appliedFilters.firstDate;
		},
		computedGenre() {
			return this.appliedFilters.lastDate;
		},
		computedCity() {
			return this.appliedFilters.city;
		},
		computedCountry() {
			return this.appliedFilters.country;
		},
	},
	methods: {
		getCurrentPage() {
			this.loading = true;
			// this.checkUrlParams();
			let sortingDirection = this.$route.query.ascending ? 1 : -1;
			//Catch problem if the starting letter is # and convert it so the backend can parse it.
			let startingLetter = this.appliedFilters.startWith == '#' ?'%23' :this.appliedFilters.startWith;
			const query = this.$route.query;
			this.$http.get(backendUrl + '/api/events/page?page=' + query.page + 
										'&perPage=' + query.itemsPerPage + 
										'&sortBy=' + query.sortBy + 
										'&order=' + (query.ascending == 'true' ?1 :-1) + 
										'&startWith=' + query.startWith + 
										(query.genre ?('&genre=' + query.genre) :'') + 
										(query.city ?('&city=' + query.city) :'') +
										(query.country ?('&country=' + query.country) :''))
			.then(response => {
				//Check if backend sent data, i.e. not sending an error message.
				if(response.body.data)
					this.events = response.body.data;
				//If an error message is sent, set the events to be empty which will show a warning message in the list.
				else
					this.events = [];

				this.events.forEach(event => {
					event.formattedDate = moment(event.date).format('LL');
					event.formattedLocation = event.location.name + ', ' + event.location.address.city;
				});

				this.availablePages = response.body.pages;
				this.currentPage = response.body.current;
				
				this.loading = false;
				//Fade filters out on mobile
				document.getElementsByClassName('show-filters-button')[0].classList.remove('opened');
				document.getElementsByClassName('filters')[0].classList.remove('show-filters');
			})
			.catch(err => {
				console.log(err);
				this.loading = false;
			});
		},
	},
	created() {
		//Get all the filter information from the backend.
		this.$http.get(backendUrl + '/api/events/filters')
			.then(response => { 
				this.filterCriteria = response.body.data;
			})
			.catch(err => console.log(err));

		this.getCurrentPage();
	}
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_eventsList.scss";
</style>
