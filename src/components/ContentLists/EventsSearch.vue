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
						<input class="search-bar" v-model="query" required placeholder="Enter what you are looking for (e.g. Berlin, Sick of it all, ..)">
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
							<md-checkbox v-model="searchOptions.includeCategories.locations">Locations</md-checkbox>
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
						<md-input-container class="genre-select">
							<v-select class="form-v-select"
									  label="name"
									  :options="availableGenres"
									  v-model="searchOptions.genre"
									  placeholder="Select genre">
							</v-select>
						</md-input-container>
					</div>
				</div>
			</div>

			<div class="scroll-to"></div>

			<div class="results">
				<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
				
				<div class="result-category column-category result-events"  v-if="results.events.length > 0">
					<h2>Event Results: </h2>
					<div class="result" v-if="!loading" v-for="index in resultLimiter.events" :key="index" v-on:click="showResult(results.events[index-1])">
						<div class="result-content">
							<h3>{{results.events[index-1].data.name}}</h3>
							<p>{{results.events[index-1].data.date}}</p>
							<p>Result found in {{results.events[index-1].match.pretty}}: 
								{{results.events[index-1].match.value.beforeMatch}}
								<span class="result-match">{{results.events[index-1].match.value.match}}</span>
								{{results.events[index-1].match.value.afterMatch}}
							</p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</div>
					<p class="more-results-btn" v-if="resultLimiter.events!=results.events.length" @click="toggleResults('events', true)">Show more Results<md-icon>keyboard_arrow_down</md-icon></p>
					<p class="more-results-btn" v-if="resultLimiter.events==results.events.length && results.events.length > 3" @click="toggleResults('events', false)">Show less Results<md-icon>keyboard_arrow_up</md-icon></p>
				</div>

				<div class="result-category column-category result-locations" v-if="results.locations.length > 0">
					<h2>Location Results: </h2>
					<div class="result" v-if="!loading" v-for="index in resultLimiter.locations" :key="index" v-on:click="showResult(results.locations[index-1])">
						<div class="result-content">
							<h3>{{results.locations[index-1].data.name}}</h3>
							<p>{{results.locations[index-1].data.address.city}}</p>
							<p>Result found in {{results.locations[index-1].match.pretty}}: 
								{{results.locations[index-1].match.value.beforeMatch}}
								<span class="result-match">{{results.locations[index-1].match.value.match}}</span>
								{{results.locations[index-1].match.value.afterMatch}}
							</p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</div>
					<p class="more-results-btn" v-if="resultLimiter.locations!=results.locations.length" @click="toggleResults('locations', true)">Show more Results<md-icon>keyboard_arrow_down</md-icon></p>
					<p class="more-results-btn" v-if="resultLimiter.locations==results.locations.length && results.locations.length > 3" @click="toggleResults('locations', false)">Show less Results<md-icon>keyboard_arrow_up</md-icon></p>
				</div>
				
				<div class="result-category column-category result-bands" v-if="results.bands.length > 0">
					<h2>Band Results: </h2>
					<div class="result" v-if="!loading" v-for="index in resultLimiter.bands" :key="index" v-on:click="showResult(results.bands[index-1])">
						<div class="result-content">
							<h3>{{results.bands[index-1].data.name}}</h3>
							<p>{{results.bands[index-1].data.origin.name}}</p>
							<p>Result found in {{results.bands[index-1].match.pretty}}: 
								{{results.bands[index-1].match.value.beforeMatch}}
								<span class="result-match">{{results.bands[index-1].match.value.match}}</span>
								{{results.bands[index-1].match.value.afterMatch}}
							</p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</div>
					<p class="more-results-btn" v-if="resultLimiter.bands!=results.bands.length" @click="toggleResults('bands', true)">Show more Results<md-icon>keyboard_arrow_down</md-icon></p>
					<p class="more-results-btn" v-if="resultLimiter.bands==results.bands.length && results.bands.length > 3" @click="toggleResults('locations', false)">Show less Results<md-icon>keyboard_arrow_up</md-icon></p>
				</div>

				<div class="no-results" v-if="!loading && searched && results.events.length == 0 && results.locations.length == 0 && results.bands.length == 0 ">
					<h3><md-icon>warning</md-icon></h3>
					<h3>No results found...</h3>
				</div>
			</div>
		</div>
  	</div>
</template>

<script>
import moment from 'moment';
import places from 'places.js';
import {frontEndSecret, backendUrl} from '@/secrets.js';
import FollowButtons from '@/Components/FollowButtons';

export default {
	name: 'events-search',
	components: {
		FollowButtons
	},
	data() {
		return {
			cities: [],
			selectedCity: '',
			query: '',
			results: {
				events: [],
				locations: [],
				bands: []
			},
			loading: false,
			resultLimiter: {
				events: 3,
				locations: 3,
				bands: 3
			},
			searched: false,
			searchOptions: {
				includeCategories: {
					events: true,
					locations: true,
					bands: true
				},
				city: '',
				country: '',
				genre: ''
			},
			locationOption: 'city',
			placesAutocomplete1: {},
			placesAutocomplete2: {},
			availableGenres: [],
			showAdvancedSearch: false
		}
	},
	methods: {
		emptyResults() {
			this.results = {
				events: [],
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
					bands: this.searchOptions.includeCategories.bands
				}});

				for(let category in this.results) {
					for(let result of this.results[category]) {
						//Get Index of the result-match-value string at which the entered query starts.
						let resultMatchValueIndex = result.match.value.toLowerCase().indexOf(this.query.toLowerCase());

						//Split the result-match-value string into 3 parts: before the exact match, the exact match, after the exact match.
						let resultMatchValue = result.match.value;
						result.match.value = {
							beforeMatch: resultMatchValue.substring(0, resultMatchValueIndex),
							match: resultMatchValue.substring(resultMatchValueIndex, (resultMatchValueIndex + this.query.length)),
							afterMatch: resultMatchValue.substring((resultMatchValueIndex + this.query.length), resultMatchValue.length)
						};

						if(result.data.date)
							result.data.date = moment(result.data.date).format('LL');
					}

					this.resultLimiter[category] = this.results[category].length>=3 ?3 :this.results[category].length;
				}

				document.getElementsByClassName('page-content')[0].classList.add('slide-up');

				this.loading = false;
			})
			.catch(err => {
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
		showResult(result) {
			this.$store.commit(('setCurrent' + result.category), result.data);
			this.$router.push({path: `/${result.category}/${result.data.url}`});
		},
		toggleResults(category, expand) {
			this.resultLimiter.events = this.results.events.length>=3 ?3 :this.results.events.length;
			this.resultLimiter.locations = this.results.locations.length>=3 ?3 :this.results.locations.length;
			this.resultLimiter.bands = this.results.bands.length>=3 ?3 :this.results.bands.length;
			
			//Get result-category-div HTML-Elements
			let categories = document.getElementsByClassName('result-category');
			//Reset all results-categorie's classes to columns
			[].forEach.call(categories, category => {
				category.classList.remove('expanded-category');
				category.classList.add('column-category');
			});

			//
			if(expand) {
				let categoryElement = document.getElementsByClassName('result-' + category)[0];
				categoryElement.classList.remove('column-category');
				categoryElement.classList.add('expanded-category');

				this.resultLimiter[category]= this.results[category].length;
			}

			document.getElementsByClassName('result-' + category)[0].scrollIntoView({ 
				behavior: 'smooth',
				block: 'start',
				inline: 'start' 
			});
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
		}
	},
	mounted() {
		this.searchOptions = {
			country: this.$route.query.country ?this.$route.query.country :'',
			city: this.$route.query.city ?this.$route.query.city :'',
			genre: this.$route.query.genre ?this.$route.query.genre :'',
			includeCategories: {
				events: this.$route.query.events == 'false' ?false :true,
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
			.catch(err => {})

		this.changeLocationOption(this.locationOption);
		this.placesAutocomplete1 = places({container: this.$refs.city_input, type: 'city', language: 'en'});
		this.placesAutocomplete1.on('change', e => {
			this.searchOptions[this.locationOption] = e.suggestion.name;
		});	

		this.placesAutocomplete2 = places({container: this.$refs.country_input, type: 'country', language: 'en'});
		this.placesAutocomplete2.on('change', e => {
			this.searchOptions[this.locationOption] = e.suggestion.name;
		});	
	}
} 
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsSearch.scss";
</style>
