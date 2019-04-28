<template>
  	<div id="events_search">
		<follow-buttons></follow-buttons>
		<div class="background-img"></div>
		<div class="darken"></div>
		<div class="page-content">
			<img class="logo" src="/static/Logo-Big.png" alt="Away From Life Streets Logo">
			<div class="main-input">
				<h1>Find Hardcore and Punk Events, Locations and Bands</h1>
				<div class="search-input">
					<form v-on:submit.prevent>
						<input class="search-bar" v-model="query" required placeholder="Enter what you are looking for (e.g. Berlin, Sick of it all, ...)">
						<md-button type="submit" class="md-raised" v-on:click="search">
								Search
						</md-button>
					</form>
				</div>

				<div class="advanced-search">
					<h3 v-on:click="toggleAdvancedSearch(!showAdvancedSearch)">
						Advanced Search 
						<md-icon>{{showAdvancedSearch ?'keyboard_arrow_down' :'keyboard_arrow_right'}}</md-icon>
					</h3>
					
					<div class="search-options hide-options">
						<h4>Include Categories: </h4>
						<div class="include-cate">
							<md-checkbox v-model="searchOptions.includeCategories.events">Events</md-checkbox>
							<md-checkbox v-model="searchOptions.includeCategories.festivals">Festivals</md-checkbox>
							<md-checkbox :disabled="disableLocations" v-model="searchOptions.includeCategories.locations">Locations</md-checkbox>
							<md-checkbox v-model="searchOptions.includeCategories.bands">Bands</md-checkbox>
						</div>
						<h4>Only show results in one City or Country: </h4>
						<div class="location-select">
							<md-button-toggle md-single class="md-accent">
								<md-button :class="'md-button ' + (locationOption=='city' ?'md-toggle' :'')" v-on:click="changeLocationOption('city')">
									City
								</md-button>

								<md-button :class="'md-button ' + (locationOption=='country' ?'md-toggle' :'')" v-on:click="changeLocationOption('country')">
									Country
								</md-button>
							</md-button-toggle>

							<md-input-container v-show="locationOption == 'city'">
								<input  class="city-input" type="search" ref="city_input" v-model="searchOptions.city" placeholder="Select city" />
							</md-input-container>

							<md-input-container v-show="locationOption == 'country'">
								<input class="country-input" type="search" ref="country_input" v-model="searchOptions.country" placeholder="Select country" />
							</md-input-container>
						</div>

						<h4>Only Show results with Genre: </h4>
						<!-- <md-input-container class="genre-select">
							<v-select class="form-v-select"
									  label="name"
									  :on-change="onSelectGenre"
									  :options="availableGenres"
									  v-model="searchOptions.genre"
									  placeholder="Select genre">
							</v-select>
						</md-input-container> -->
					<search-select label="name"
									v-on:change="onSelectGenre"
									:options="availableGenres"
									v-model="searchOptions.genre"
									placeholder="Select genre">
					</search-select>

						<md-button v-if="showResetButton()" v-on:click="searchOptions = resetFilters()">
							<md-icon>restore</md-icon>
							Reset Filters
						</md-button>
					</div>
				</div>
			</div>

			<div class="scroll-to"></div>

			<div class="results">
				<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>

				<result-category 
					v-for="(category, index) in Object.keys(results)" :key="index"
					v-if="results[category].length > 0"
					:ref="'result-' + category"
					:class="'result-category column-category result-' + category" 
					:title="category"
					:content="results[category]"
					:attribToBeDisplayed="specialAttributes[category]"
					v-on:expanded="minifyCategories(category)">
				</result-category>

				<div class="no-results" v-if="!loading && searched && results.events.length == 0 && results.locations.length == 0 && results.bands.length == 0 && results.festivals.length == 0">
					<h3><md-icon>warning</md-icon></h3>
					<h3>No results found...</h3>
				</div>
			</div>

			<div class="latest-content">
				<latest-content></latest-content>
			</div>
		</div>
  	</div>
</template>

<script>
import moment from 'moment';
import places from 'places.js';

import {frontEndSecret, backendUrl} from '@/secrets.js';

import FollowButtons from '@/components/FollowButtons';
import ResultCategory from '@/components/Search/ResultCategory';
import LatestContent from '@/components/Search/LatestContent';
import SearchSelect from '@/components/Utilities/SearchSelect';

export default {
	name: 'events-search',
	components: {
		FollowButtons,
		ResultCategory,
		LatestContent,
		SearchSelect
	},
	data() {
		return {
			cities: [],
			selectedCity: '',
			query: '',
			results: {
				events: [],
				festivals: [],
				locations: [],
				bands: []
			},
			specialAttributes: {
				events: 'date',
				festivals: 'address.city',
				locations: 'address.city',
				bands: 'origin.city'
			},
			loading: false,
			searched: false,
			searchOptions: {
				includeCategories: {
					events: true,
					festivals: true,
					locations: true,
					bands: true
				},
				city: '',
				country: '',
				genre: ''
			},
			disableLocations: false,
			locationOption: 'city',
			placesAutocomplete1: {},
			placesAutocomplete2: {},
			availableGenres: [],
			showAdvancedSearch: false
		}
	},
	computed: {
		backgroundImage() {
			return this.$store.getters.searchBackgroundImage;
		}
	},
	watch: {
		backgroundImage() {
			let backgroundElement = document.getElementsByClassName('background-img')[0];
			backgroundElement.style.backgroundImage = this.$store.getters.searchBackgroundImage;
		}
	},
	methods: {
		emptyResults() {
			this.results = {
				events: [],
				festivals: [],
				locations: [],
				bands: []
			};
		},
		search() {
			this.searched = false;
			this.emptyResults();
			this.toggleAdvancedSearch(false);

			document.getElementsByClassName('page-content')[0].classList.remove('slide-up');
			this.loading = true;
			
			this.$http.get(backendUrl + '/api/search/' + this.query + this.buildSearchQuery())
			.then(response => {
				this.searched = true;
				this.results = response.body.data;
				this.$router.push({query: {
					query: this.query,
					genre: this.searchOptions.genre ?this.searchOptions.genre.name :undefined,
					city: this.searchOptions.city.length > 0 && this.locationOption == 'city' ?this.searchOptions.city :undefined,
					country: this.searchOptions.country.length > 0 && this.locationOption == 'country' ?this.searchOptions.country :undefined,
					locations: this.searchOptions.includeCategories.locations,
					events: this.searchOptions.includeCategories.events,
					festivals: this.searchOptions.includeCategories.festivals,
					bands: this.searchOptions.includeCategories.bands
				}});

				document.getElementsByClassName('page-content')[0].classList.add('slide-up');

				this.loading = false;
			})
			.catch(err => {
				console.log(err);
				this.loading = false;
			});
		},
		buildSearchQuery() {
			let searchQuery = '';

			if(this.searchOptions.city != '' && this.locationOption == 'city')
				searchQuery += 'city=' + this.searchOptions.city + '&';
			
			if(this.searchOptions.country != '' && this.locationOption == 'country')
				searchQuery += 'country=' + this.searchOptions.country + '&';

			if(this.searchOptions.genre)
				searchQuery += 'genre=' + this.searchOptions.genre.name + '&';

			let categoriesString = '';

			for(let key in this.searchOptions.includeCategories) {
				if(this.searchOptions.includeCategories[key])
					categoriesString += key + ',';
			}

			categoriesString = categoriesString.length > 0 ?'categories=' + categoriesString.substring(0, categoriesString.length-1) 
														   :categoriesString;

			searchQuery += categoriesString + '&';

			searchQuery = searchQuery.length > 1 ?'?' + searchQuery.substring(0, searchQuery.length-1) : '';
			
			return searchQuery;
		},
		minifyCategories(excluded) {
			for(let category of Object.keys(this.results)) {
				if(category != excluded)
					this.$refs['result-' + category][0].toggleResults(false);
			}
		},
		changeLocationOption(option) {
			this.locationOption = option;
		},
		toggleAdvancedSearch(show) {
			this.showAdvancedSearch = show;
			
			if(this.showAdvancedSearch) {
				document.getElementsByClassName('search-options')[0].classList.remove('hide-options');
				document.getElementById('events_search').style.paddingBottom = '160px';
				if(!this.searched)
					document.getElementsByClassName('page-content')[0].classList.add('slide-up');
			}
			else {
				document.getElementsByClassName('search-options')[0].classList.add('hide-options');
				document.getElementById('events_search').style.paddingBottom = '';
				if(!this.searched)
					document.getElementsByClassName('page-content')[0].classList.remove('slide-up');
			}
		},
		onSelectGenre(selected) {
			this.searchOptions.genre = selected;
			if(selected) {
				this.searchOptions.includeCategories.locations = false;
				this.disableLocations = true;
			}
			else {
				this.disableLocations = false;
			}
		},
		resetFilters() {
			return {
				includeCategories: {
					events: true,
					festivals: true,
					locations: true,
					bands: true
				},
				city: '',
				country: '',
				genre: ''
			};
		},
		showResetButton() {
			let blankOptions = this.resetFilters();

			return !(
				this.searchOptions.city === blankOptions.city &&
				this.searchOptions.country === blankOptions.country &&
				this.searchOptions.genre === blankOptions.genre &&
				JSON.stringify(this.searchOptions.includeCategories) === JSON.stringify(blankOptions.includeCategories));
		},
	},
	mounted() {		
		this.searchOptions = {
			country: this.$route.query.country ?this.$route.query.country :'',
			city: this.$route.query.city ?this.$route.query.city :'',
			genre: this.$route.query.genre ?this.$route.query.genre :'',
			includeCategories: {
				events: this.$route.query.events == 'false' ?false :true,
				festivals: this.$route.query.festivals == 'false' ?false :true,
				locations: this.$route.query.locations == 'false' ?false :true,
				bands: this.$route.query.bands == 'false' ?false :true,
			}
		}

		this.locationOption = this.$route.query.country ?'country' :'city';

		if(this.$route.query.query) {
			this.query = this.$route.query.query;
			this.search();
		}

		this.$http.get(backendUrl + '/api/genres')
			.then(response => {
				this.availableGenres = response.body.data;
			})
			.catch(err => console.log(err));

		this.changeLocationOption(this.locationOption);
		this.placesAutocomplete1 = places({container: this.$refs.city_input, type: 'city', language: 'en'});
		this.placesAutocomplete1.on('change', e => {
			this.searchOptions[this.locationOption] = e.suggestion.name;
		});	

		this.placesAutocomplete2 = places({container: this.$refs.country_input, type: 'country', language: 'en'});
		this.placesAutocomplete2.on('change', e => {
			this.searchOptions[this.locationOption] = e.suggestion.name;
		});	

		let backgroundElement = document.getElementsByClassName('background-img')[0];
		backgroundElement.style.backgroundImage = this.$store.getters.searchBackgroundImage;
	}
} 
</script>

<style lang="scss">
	@import "src/scss/Search/_eventsSearch.scss";
</style>
