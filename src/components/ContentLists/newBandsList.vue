<template>
	<div id="band_list">
		<list
			contentType="Band"
			:data="bands"
			:totalItemsCount="totalItemsCount"
			:page="currentPage"
			:completelyReloading="completelyReloading"
			:loading="loading"
			:dataMounting="mounting"
			:sortingOptions="sortingOptions"
			:currentlySorted="currentlySorted"
			:appliedFilters="appliedFilters"
			:prettierKey="prettierKey"
			v-on:loadMore="getNextBands"
			v-on:loadPrevious="previousPage => getPreviousBands(previousPage)"
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

                        <div class="label-filter">
							<h4>Record Label</h4>
							<loading-skeleton-element v-if="mounting" width="160px" height="30px"></loading-skeleton-element>
							<search-select
									v-else
									:options="filterCriteria.labels"
									v-model="appliedFilters.label"
									placeholder="Select Record Label">
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

			<div slot="list-elements" class="list-element" v-for="(band, index) in bands" :key="index" v-on:click="setCurrentBand(band)">
				<router-link  :to="`band/${band.url}`">
					<div class="image-container">
						<img :src="getFullImageRoute(band)" @error="getPlaceholderImage" class="image" :alt="'preview image for ' + band.name">
						<div class="color-seperator"></div>
					</div>
					<div class="element-info">
                        <h4 class="band-genres">
                            <span v-for="(genre, index) in band.genre" :key="index">{{genre}}</span>
                        </h4>
						<h3 class="band-name">{{band.name}}</h3>
                        <p class="band-origin">{{band.origin.city}}, {{band.origin.country}}</p>
                        <p class="band-label">{{band.recordLabel ? band.recordLabel: 'Unsigned'}}</p>
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
			bands: [],
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
                }
			],
			currentlySorted: {
				name: 'name',
				direction: 1,
				pretty: 'Name ascending'
			},
			filterCriteria: {
				startWith: [],
                labels: undefined,
                genres: undefined,
				countries: undefined,
			},
			appliedFilters: {
				startWith: undefined,
                label: undefined,
                genre: undefined,
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
		setCurrentBand(band) {			
			this.$store.commit('setCurrentBand', band);
		},
		async getBandsPage(page) {
			this.loading = true;

			let response = {};

			const appliedFilters = this.appliedFilters;
			let requestRoute = 
				backendUrl + '/api/bands/page'
				+ '?page=' + page
				+ '&perPage=50'
				+ '&sortBy=' + this.currentlySorted.name
				+ '&order=' + this.currentlySorted.direction
                + (appliedFilters.startWith ? '&startWith=' + encodeURIComponent(appliedFilters.startWith) : '')
                + (appliedFilters.label ?('&label=' + appliedFilters.label.label) :'')
                + (appliedFilters.genre ?('&genre=' + appliedFilters.genre.label) :'')
                + (appliedFilters.country ?('&country=' + appliedFilters.country.label) :'');
			try {
				response = await this.$http.get(requestRoute);
			}
			catch(err) {
				return [];
			}

			let newBands = [];
			if(response.body.data) {
				newBands = response.body.data;
			}
			
			this.availablePages = response.body.pages;
			this.totalItemsCount = response.body.totalCount;
			
			this.loading = false;

			return newBands;
		},
		async getNextBands() {
			this.currentPage++;

			this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
				
			let nextBands = await this.getBandsPage(this.currentPage);
			this.bands = this.bands.concat(nextBands);
		},
		async getPreviousBands(previousPage) {
			let previousBands = await this.getBandsPage(previousPage);

			this.bands = previousBands.concat(this.bands);			
		},
		async applyNewFilters() {
			this.completelyReloading = true;

			if(!this.mounting) {
				this.currentPage = 1;
				this.previousLoadable = false;
				this.$router.replace({query: {...this.$route.query, page: this.currentPage}});
			}

			this.bands = await this.getBandsPage(this.currentPage);
			this.completelyReloading = false;
		},
		getFullImageRoute(band) {
			return backendUrl + '/' + band.image[1];
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
                case 'label':
                    prettierKey = 'record label';
                    break;
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
            if(this.appliedFilters.label)
				query.label = this.appliedFilters.label.label;
            if(this.appliedFilters.genre)
				query.genre = this.appliedFilters.genre.label;
            if(this.appliedFilters.country)
				query.country = this.appliedFilters.country.label;
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
		this.$http.get(backendUrl + '/api/bands/filters')
			.then(response => { 				
                this.filterCriteria = response.body.data;
                let newLabels = this.filterCriteria.labels.map(label => {
					return {label: label};
				});
				this.filterCriteria.labels = newLabels;

                let newGenres = this.filterCriteria.genres.map(genre => {
					return {label: genre};
				});
				this.filterCriteria.genres = newGenres;
                
                let newCountries = this.filterCriteria.countries.map(country => {
					return {label: country};
				});
				this.filterCriteria.countries = newCountries;
			})
			.catch(err => console.log(err));

		const query = this.$route.query;
		if(query.startWith)
            this.appliedFilters.startWith = query.startWith;
        if(query.label)
            this.appliedFilters.label = {label: query.label};
        if(query.genre)
            this.appliedFilters.genre = {label: query.genre};
        if(query.country)
            this.appliedFilters.country = {label: query.country};
		if(query.sortBy && query.sortingDirection)
			this.applyQuerySorting(query.sortBy, query.sortingDirection);

		this.currentPage = pageFromRoute;
		this.bands = await this.getBandsPage(this.currentPage);		
		
		if(window.innerWidth <= 768)
			this.isMobile = true;

		this.mounting = false;
	},
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_newBandsList.scss";
</style>