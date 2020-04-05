<template>
	<div id="festival_list">
		<list
			contentType="Festival"
			:data="festivals"
			:totalItemsCount="totalItemsCount"
			:page="currentPage"
			:completelyReloading="completelyReloading"
			:loading="loading"
			:dataMounting="mounting"
			:sortingOptions="sortingOptions"
			:currentlySorted="currentlySorted"
			:appliedFilters="appliedFilters"
			:prettierKey="prettierKey"
			v-on:loadMore="getNextFestivals"
			v-on:loadPrevious="previousPage => getPreviousFestivals(previousPage)"
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

			<div slot="list-elements" class="list-element" v-for="(festival, index) in festivals" :key="index" v-on:click="setCurrentFestival(festival)">
				<router-link  :to="`festival/${festival.url}`">
					<div class="image-container">
						<img :src="getFullImageRoute(festival)" @error="getPlaceholderImage" class="image" :alt="'preview image for ' + festival.name">
						<div class="color-seperator"></div>
					</div>
					<div class="element-info">
                        <h4 class="festival-genres">
                            <span v-for="(genre, index) in festival.genre" :key="index">{{genre}}</span>
                        </h4>
						<h3 class="festival-name">{{festival.name}}</h3>
						<p class="festival-city">{{festival.address.city}}</p>
						<p class="festival-country">{{festival.address.country}}</p>
					</div>
				</router-link>
			</div>
		</list>
	</div>
</template>

<script>
import {backendUrl, imageUrl} from '@/secrets.js';

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
			festivals: [],
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
                },
                {
                    name: 'genre',
                    direction: 1,
                    pretty: 'Genre ascending'
                },
                {
                    name: 'genre',
                    direction: 1,
                    pretty: 'Genre ascending'
				},
				{
                    name: 'city',
                    direction: 1,
                    pretty: 'City ascending'
                },
                {
                    name: 'city',
                    direction: -1,
                    pretty: 'City descending'
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
		setCurrentFestival(festival) {			
			this.$store.commit('setCurrentFestival', festival);
		},
		async getFestivalsPage(page) {
			this.loading = true;

			let response = {};

			const appliedFilters = this.appliedFilters;
			let requestRoute = 
				backendUrl + '/api/festivals/page'
				+ '?page=' + page
				+ '&perPage=50'
				+ '&sortBy=' + this.currentlySorted.name
				+ '&order=' + this.currentlySorted.direction
                + (appliedFilters.startWith ? '&startWith=' + encodeURIComponent(appliedFilters.startWith) : '')
                + (appliedFilters.genre ?('&genre=' + appliedFilters.genre.label) :'')
				+ (appliedFilters.city ?('&city=' + appliedFilters.city.label) :'')
				+ (appliedFilters.firstDate ?('&startDate=' + appliedFilters.firstDate) :'')
				+ (appliedFilters.lastDate ?('&endDate=' + appliedFilters.lastDate) :'')
			try {
				response = await this.$http.get(requestRoute);
			}
			catch(err) {
				return [];
			}

			let newFestivals = [];
			if(response.body.data) {
				newFestivals = response.body.data;
			}
			
			this.availablePages = response.body.pages;
			this.totalItemsCount = response.body.totalCount;
			
			this.loading = false;

			return newFestivals;
		},
		async getNextFestivals() {
			this.currentPage++;

			this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
				
			let nextFestivals = await this.getFestivalsPage(this.currentPage);
			this.festivals = this.festivals.concat(nextFestivals);
		},
		async getPreviousFestivals(previousPage) {
			let previousFestivals = await this.getFestivalsPage(previousPage);

			this.festivals = previousFestivals.concat(this.festivals);			
		},
		async applyNewFilters() {
			this.completelyReloading = true;

			if(!this.mounting) {
				this.currentPage = 1;
				this.previousLoadable = false;
				this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
			}

			this.festivals = await this.getFestivalsPage(this.currentPage);
			this.completelyReloading = false;
		},
		getFullImageRoute(festival) {
			return imageUrl + '/' + festival.image[1];
		},
		getPlaceholderImage(e) {
			e.target.src = imageUrl + '/images/placeholders/1_M.jpg';
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
				query.genre = this.appliedFilters.genre.label;
			if(this.appliedFilters.firstDate)
				query.firstDate = this.appliedFilters.firstDate
			if(this.appliedFilters.lastDate)
				query.lastDate = this.appliedFilters.lastDate
            if(this.appliedFilters.city)
				query.city = this.appliedFilters.city.label;
			if(!(this.currentlySorted.name == 'name' && this.currentlySorted.direction == 1)) {
				query.sortBy = this.currentlySorted.name;
				query.sortingDirection = this.currentlySorted.direction;
            }
            
			if(JSON.stringify(query) != JSON.stringify(this.$route.query)) {
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
		this.$http.get(backendUrl + '/api/festivals/filters')
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

				console.log(this.filterCriteria.cities);
			})
			.catch(err => console.log(err));

		const query = this.$route.query;
		if(query.startWith)
            this.appliedFilters.startWith = query.startWith;
        if(query.genre)
			this.appliedFilters.genre = {label: query.genre};
		if(query.firstDate)
			this.appliedFilters.firstDate = query.firstDate;
		if(query.lastDate)
			this.appliedFilters.lastDate = query.lastDate;
        if(query.city)
            this.appliedFilters.city = {label: query.city};
		if(query.sortBy && query.sortingDirection)
			this.applyQuerySorting(query.sortBy, query.sortingDirection);

		this.currentPage = pageFromRoute;
		this.festivals = await this.getFestivalsPage(this.currentPage);		
		
		if(window.innerWidth <= 768)
			this.isMobile = true;

		this.mounting = false;
	},
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_newFestivalsList.scss";
</style>