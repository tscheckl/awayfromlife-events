<template>
	<div id="locations_list">
		<general-list 
			title="All Locations"
			contentType="locations"
			:data="locations"
			:displayedColumns="displayedColumns"
			:availablePages="availablePages"
			:loading="loading"
			>
			<div slot="filters">
				<starting-letter-filter 
					contentType="locations"
					:availableLetters="filterCriteria.startWith">
				</starting-letter-filter>

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
		</general-list>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';

import moment from 'moment';

import GeneralList from './GeneralList';
import StartingLetterFilter from './StartingLetterFilter';

export default {
	name: 'locations-list-new',
	components: {
		GeneralList,
		StartingLetterFilter
	},
	data() {
		return {
			locations: [],
			displayedColumns: [
				{
					displayName: 'Name',
					attributes: ['name'],
					isArray: false,
				},
				{
					displayName: 'Address',
					attributes: ['street'],
					isArray: true,
				},
				{
					displayName: 'City',
					attributes: ['city'],
					isArray: false,
				},
			],
			appliedFilters: {
				startWith: undefined,
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
			this.$http.get(backendUrl + '/api/locations/page?page=' + query.page + 
										'&perPage=' + query.itemsPerPage + 
										'&sortBy=' + query.sortBy + 
										'&order=' + (query.ascending == 'true' ?1 :-1) + 
										'&startWith=' + query.startWith + 
										(query.city ?('&city=' + query.city) :'') +
										(query.country ?('&country=' + query.country) :''))
			.then(response => {
				//Check if backend sent data, i.e. not sending an error message.
				if(response.body.data)
					this.locations = response.body.data;
				//If an error message is sent, set the events to be empty which will show a warning message in the list.
				else
					this.locations = [];

				this.locations.forEach(location => {
					location.city = location.address.city;
					location.street = location.address.street;
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
		this.$http.get(backendUrl + '/api/locations/filters')
			.then(response => { 
				this.filterCriteria = response.body.data;
			})
			.catch(err => console.log(err));

		this.getCurrentPage();
	}
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_locationsList.scss";
</style>
