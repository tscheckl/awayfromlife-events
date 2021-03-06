<template>
	<div id="bands_list">
		<general-list 
			title="All Bands"
			contentType="bands"
			:data="bands"
			:displayedColumns="displayedColumns"
			:availablePages="availablePages"
			:loading="loading"
			>
			<div slot="filters">
				<starting-letter-filter 
					contentType="bands"
					:availableLetters="filterCriteria.startWith">
				</starting-letter-filter>

				<md-input-container class="genre-select">
					<span class="input-label" v-if="appliedFilters.genre && appliedFilters.genre != ''">Genre</span>
					<v-select class="form-v-select"
								:options="filterCriteria.genres"
								v-model="appliedFilters.genre"
								placeholder="Genre">
					</v-select>
				</md-input-container>

				<md-input-container class="label-select">
					<span class="input-label" v-if="appliedFilters.label && appliedFilters.label != ''">Label</span>
					<v-select class="form-v-select"
								:options="filterCriteria.labels"
								v-model="appliedFilters.label"
								placeholder="Label">
					</v-select>
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
	name: 'bands-list-new',
	components: {
		GeneralList,
		StartingLetterFilter
	},
	data() {
		return {
			bands: [],
			displayedColumns: [
				{
					displayName: 'Name',
					attributes: ['name'],
					isArray: false,
				},
				{
					displayName: 'Genre',
					attributes: ['genre'],
					isArray: true,
				},
				{
					displayName: 'Origin',
					attributes: ['formattedOrigin'],
					isArray: false,
				},
			],
			appliedFilters: {
				startWith: undefined,
				city: undefined,
				country: undefined,
				genre: undefined,
				label: undefined
			},
			filterByCity: false,
			filterCriteria: {},
			availablePages: 1,
			loading: false
		}
	},
	watch: {
		$route(to, from) {
			this.getBandsPage();
		},
		computedGenre(value) {
			let newQuery = {...this.$route.query, genre: value};
			this.$router.push({query: newQuery});
		},
		computedLabel(value) {
			let newQuery = {...this.$route.query, label: value};
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
		computedLabel() {
			return this.appliedFilters.label;
		},
		computedCity() {
			return this.appliedFilters.city;
		},
		computedCountry() {
			return this.appliedFilters.country;
		},
	},
	methods: {
		getBandsPage() {
			this.loading = true;
			// this.checkUrlParams();
			let sortingDirection = this.$route.query.ascending ? 1 : -1;
			//Catch problem if the starting letter is # and convert it so the backend can parse it.
			let startingLetter = this.appliedFilters.startWith == '#' ?'%23' :this.appliedFilters.startWith;
			const query = this.$route.query;
			this.$http.get(backendUrl + '/api/bands/page?page=' + query.page + 
										'&perPage=' + query.itemsPerPage + 
										'&sortBy=' + query.sortBy + 
										'&order=' + (query.ascending == 'true' ?1 :-1) + 
										'&startWith=' + query.startWith + 
										(query.genre ?('&genre=' + query.genre) :'') + 
										(query.label ?('&label=' + query.label) :'') + 
										(query.city ?('&city=' + query.city) :'') +
										(query.country ?('&country=' + query.country) :''))
			.then(response => {
				//Check if backend sent data, i.e. not sending an error message.
				if(response.body.data)
					this.bands = response.body.data;
				//If an error message is sent, set the events to be empty which will show a warning message in the list.
				else
					this.bands = [];

				this.bands.forEach(band => {
					band.formattedOrigin = `${band.origin.city}, ${band.origin.country}`;
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
		this.$http.get(backendUrl + '/api/bands/filters')
			.then(response => { 
				this.filterCriteria = response.body.data;
			})
			.catch(err => console.log(err));

		// if(this.$router.currentRoute.query.page) {
		// 	this.currentPage = this.$router.currentRoute.query.page;
		// }

		// if(this.$route.query.sortBy && this.$route.query.ascending) {
		// 	this.currentlySorted = this.$route.query.sortBy;
		// 	this.sortingAsc[this.$route.query.sortBy] = (this.$route.query.ascending == 'true');
		// }
		// else {
		// 	this.sortingAsc.name = true;
		// }

		this.getBandsPage();
	}
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_bandsList.scss";
</style>
