<template>
	<div id="location_list">
		<list
			contentType="Location"
			:data="locations"
			:totalItemsCount="totalItemsCount"
			:page="currentPage"
			:completelyReloading="completelyReloading"
			:loading="loading"
			:dataMounting="mounting"
			:sortingOptions="sortingOptions"
			:currentlySorted="currentlySorted"
			:appliedFilters="appliedFilters"
			:prettierKey="prettierKey"
			v-on:loadMore="getNextLocations"
			v-on:loadPrevious="previousPage => getPreviousLocations(previousPage)"
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

                        <div class="country-filter">
							<h4>Country</h4>
							<loading-skeleton-element v-if="mounting" width="160px" height="30px"></loading-skeleton-element>
							<search-select 
									v-else
									:options="filterCriteria.countries"
									v-model="appliedFilters.country"
									placeholder="Select Country">
								<span slot="no-options">Sorry, no matching options..</span>
							</search-select>
						</div>
					</div>					
				</div>

			<div slot="list-elements" class="list-element" v-for="(location, index) in locations" :key="index" v-on:click="setCurrentLocation(location)">
				<router-link  :to="`location/${location.url}`">
					<div class="image-container">
						<img :src="getFullImageRoute(location)" @error="getPlaceholderImage" class="image" :alt="'preview image for ' + location.name">
						<div class="color-seperator"></div>
					</div>
					<div class="element-info">
						<h3 class="location-name">{{location.name}}</h3>
                        <p class="location-city">{{location.address.city}}</p>
                        <p class="location-country">{{location.address.country}}</p>
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
			locations: [],
			totalItemsCount: 0,
			previousPageLoadedTo: 0,
			sortingOptions: [
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
					name: 'name',
					direction: -1,
					pretty: 'Name descending'
                }
			],
			currentlySorted: {
				name: 'name',
				direction: 1,
				pretty: 'Name ascending'
			},
			filterCriteria: {
				startWith: [],
				cities: undefined,
				countries: undefined,
			},
			appliedFilters: {
				startWith: undefined,
				city: undefined,
				country: undefined,
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
		setCurrentLocation(location) {			
			this.$store.commit('setCurrentLocation', location);
		},
		async getLocationsPage(page) {
			this.loading = true;

			let response = {};

			const appliedFilters = this.appliedFilters;
			let requestRoute = 
				backendUrl + '/api/locations/page'
				+ '?page=' + page
				+ '&perPage=50'
				+ '&sortBy=' + this.currentlySorted.name
				+ '&order=' + this.currentlySorted.direction
				+ (appliedFilters.startWith ? '&startWith=' + encodeURIComponent(appliedFilters.startWith) : '')
                + (appliedFilters.city ?('&city=' + appliedFilters.city.label) :'')
                + (appliedFilters.country ?('&country=' + appliedFilters.country.label) :'');
			try {
				response = await this.$http.get(requestRoute);
			}
			catch(err) {
				return [];
			}

			let newLocations = [];
			if(response.body.data) {
				newLocations = response.body.data;
			}
			
			this.availablePages = response.body.pages;
			this.totalItemsCount = response.body.totalCount;
			
			this.loading = false;

			return newLocations;
		},
		async getNextLocations() {
			this.currentPage++;

			this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
				
			let nextLocations = await this.getLocationsPage(this.currentPage);
			this.locations = this.locations.concat(nextLocations);
		},
		async getPreviousLocations(previousPage) {
			let previousLocations = await this.getLocationsPage(previousPage);

			this.locations = previousLocations.concat(this.locations);			
		},
		async applyNewFilters() {
			this.completelyReloading = true;

			if(!this.mounting) {
				this.currentPage = 1;
				this.previousLoadable = false;
				this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
			}

			this.locations = await this.getLocationsPage(this.currentPage);
			this.completelyReloading = false;
		},
		getFullImageRoute(location) {
			return backendUrl + '/' + location.image[1];
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
            
            if(key == 'startWith')
                prettierKey = 'starting letter';

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
			if(this.appliedFilters.city) {
                if(this.$route.query.country)
                    this.appliedFilters.country = undefined;
                
                query.city = this.appliedFilters.city.label;                
            }
            if(this.appliedFilters.country) {
                if(this.$route.query.city)
                    this.appliedFilters.city = undefined;

				query.country = this.appliedFilters.country.label;
            }
			if(!(this.currentlySorted.name == 'name' && this.currentlySorted.direction == 1)) {
				query.sortBy = this.currentlySorted.name;
				query.sortingDirection = this.currentlySorted.direction;
            }
            
			if(JSON.stringify(query) != JSON.stringify(this.$route.query)) {
                console.log(query);
                
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
		this.$http.get(backendUrl + '/api/locations/filters')
			.then(response => { 				
                this.filterCriteria = response.body.data;
                
				let newCities = this.filterCriteria.cities.map(city => {
					return {label: city};
				});
                this.filterCriteria.cities = newCities;
                
                let newCountries = this.filterCriteria.countries.map(country => {
					return {label: country};
				});
				this.filterCriteria.countries = newCountries;
			})
			.catch(err => console.log(err));

		const query = this.$route.query;
		if(query.startWith)
			this.appliedFilters.startWith = query.startWith;
		if(query.city)
            this.appliedFilters.city = {label: query.city};
        if(query.country)
            this.appliedFilters.country = {label: query.country};
		if(query.sortBy && query.sortingDirection)
			this.applyQuerySorting(query.sortBy, query.sortingDirection);

		this.currentPage = pageFromRoute;
		this.locations = await this.getLocationsPage(this.currentPage);		
		
		if(window.innerWidth <= 768)
			this.isMobile = true;

		this.mounting = false;
	},
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_newLocationsList.scss";
</style>