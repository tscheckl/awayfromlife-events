<template>
	<div id="locations_list">
		<div class="list-header">
			<div class="header-line">
				<div class="left-container">
					<h1>All Locations</h1>
				</div>

				<router-link to="new-location">
					<md-button class="md-raised create-content-btn"><md-icon>add</md-icon>Create new Location</md-button>
				</router-link>
			</div>

			<h3 class="show-filters-button" v-on:click="toggleFilters">
				<md-icon>filter_list</md-icon> 
				<span>Filter Results</span> 
				<md-icon>keyboard_arrow_right</md-icon>
			</h3>
			<div class="filters">
				<h3>Locations from A to Z: </h3>
				<ul class="starting-letter-filter">
					<li v-for="i in 26" :key="i" :class="buildLetterCssClasses((i+9).toString(36).toUpperCase())">
						<span v-on:click="filterCriteria.startWith.indexOf((i+9).toString(36).toUpperCase()) != -1 ?filterByStartingLetter((i+9).toString(36).toUpperCase()) :''">
							{{(i+9).toString(36).toUpperCase()}}
						</span>
						<div v-on:click="clearStartLetter">
							<md-icon v-if="appliedFilters.startWith == (i+9).toString(36).toUpperCase()">clear</md-icon>
						</div>
					</li>
					<li :class="buildLetterCssClasses('#')">
						<span v-on:click="filterCriteria.startWith.indexOf('#') != -1 ?filterByStartingLetter('#') :''">
							#
						</span>
						<div v-on:click="clearStartLetter">
							<md-icon v-if="appliedFilters.startWith == '#'">clear</md-icon>
						</div>
					</li>
				</ul>

				<h3 class="filters-header">Additional Filters: </h3>
				<div class="additional-filters">
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

				<md-button v-if="appliedFilters.startWith || appliedFilters.country || appliedFilters.city" 
						   class="clear-filters-button" 
						   v-on:click="clearFilters">
							<md-icon>restore</md-icon> Reset Filters
				</md-button>
			</div>
		</div>
		
		<div class="color-block"></div>

		<div class="all-items">

			<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>

			<div class="list-content" v-if="!loading">
				<h3 class="no-items-title" v-if="locations.length == 0">No Locations found..</h3>

				<div class="list-item-header" v-if="locations.length > 0">
					<p class="item-title" v-on:click="sortBy('name')">
						<span>Name
							<md-icon v-if="currentlySorted == 'name'">{{!sortingAsc.name? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p> 
					<p class="location-address" v-on:click="sortBy('address.street')">
						<span>Address 
							<md-icon v-if="currentlySorted == 'address.street'">{{!sortingAsc['address.street']? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p>
					<p class="location-city" v-on:click="sortBy('address.city')">
						<span>City 
							<md-icon v-if="currentlySorted == 'address.city'">{{!sortingAsc['address.city']? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p>
					<md-icon class="hidden-icon"></md-icon>
				</div>

				<div v-for="(location, index) in locations" :key="index" v-on:click="showLocation(location)">
					<router-link :to="`/location/${location.url}`" class="list-item" >
						<h3 class="item-title">{{location.name}}</h3>
						<p class="location-address">{{location.address.street}}</p>
						<p class="location-city">{{location.address.city}}</p>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</router-link>
				</div>
			</div>

			<div class="list-footer">
				<div class="pages">
					<span class="page-btn" v-on:click="currentPage > 1 ? changeCurrentPage(currentPage-1): ''"><md-icon>keyboard_arrow_left</md-icon></span>
					<span v-for="number in smallerPages()" :key="number" v-on:click="changeCurrentPage(number)">{{number}}</span>
					<span class="current-page">{{currentPage}}</span>
					<span v-for="number in biggerPages()" :key="number" v-on:click="changeCurrentPage(number)">{{number}}</span>
					<span class="page-btn" v-on:click="(currentPage < availablePages)? changeCurrentPage(currentPage+1): ''"><md-icon>keyboard_arrow_right</md-icon></span>
				</div>
				
				<selector
					v-model="itemsPerPage"
					selectLabel="Items per Page"
					:options="[5,10,20,50]">
				</selector>
			</div>
		</div>

		<md-dialog ref="newLocationDialog">
			<new-location 
						v-on:close="$refs['newLocationDialog'].close()"
						v-on:success="handleDialogClose('newLocationDialog')">
			</new-location>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span>New location successfully created! <br> <b>It will be visible for everyone after it was verified by us.</b></span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';

import NewLocation from "@/components/NewContent/NewLocation";
import Selector from '@/components/Utilities/Selector';

export default {
	name: 'locations-list',
	components: {
		NewLocation,
		Selector
	},
	data() {
		return {
			locations: [],
			sortingAsc: {
				name: false,
				'address.street': false,
				'address.city': false
			},
			currentlySorted: 'name',
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
			filterByCity: false,
			currentPage: 1,
			availablePages: 1,
			itemsPerPage: '20',
			loading: false
		}
	},
	watch: {
		appliedFilters: {
			handler(val){
				this.buildUrl();
				this.getLocationsPage(this.currentPage);
			},
			deep: true
		},
		$route(to, from) {
			this.getLocationsPage(to.query.page);
		},
		itemsPerPage() {
			this.buildUrl();
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		showLocation(location) {
			this.$store.commit('setCurrentLocation', location);
			this.$router.push({path: `/location/${location.url}`});
		},
		sortBy(sortCrit) {
			this.currentlySorted = sortCrit;
			//Save the current state of the category that is to be sorted.
			let currentlySortedSortingAscTemp = this.sortingAsc[sortCrit];
			//Reset all other categories direction
			for(let key in this.sortingAsc) {
				this.sortingAsc[key] = false;
			}
			//Assign the category to be sorted the negative value of its former value.
			this.sortingAsc[sortCrit] = !currentlySortedSortingAscTemp;

			this.buildUrl();
		},
		getLocationsPage(page) {
			this.loading = true;
			this.checkUrlParams();

			let sortingDirection = this.sortingAsc[this.currentlySorted] ? 1 : -1;
			//Catch problem if the starting letter is # and convert it so the backend can parse it.
			let startingLetter = this.appliedFilters.startWith == '#' ?'%23' :this.appliedFilters.startWith;

			this.$http.get(backendUrl + '/api/locations/page?page=' + page + 
										'&perPage=' + this.itemsPerPage + 
										'&sortBy=' + this.currentlySorted + 
										'&order=' + sortingDirection + 
										'&startWith=' + startingLetter + 
										((this.filterByCity && this.appliedFilters.city) ?('&city=' + this.appliedFilters.city) :'') +
										((!this.filterByCity && this.appliedFilters.country) ?('&country=' + this.appliedFilters.country) :''))
			.then(response => {
				//Check if backend sent data, i.e. not sending an error message.
				if(response.body.data) {
					this.locations = response.body.data;
				}
				//If an error message is sent, set the events to be empty which will show a warning message in the list.
				else {
					this.locations = [];
				}
				this.availablePages = response.body.pages;
				this.currentPage = response.body.current;

				this.loading = false;
				//Fade filters out on mobile
				document.getElementsByClassName('show-filters-button')[0].classList.remove('opened');
				document.getElementsByClassName('filters')[0].classList.remove('show-filters');
			})
			.catch(err => {
				this.loading = false;
			});
		},
		//Function for building the current route with all query-parameters.
		buildUrl() {
			let query = {
				page: this.currentPage, 
				itemsPerPage: this.itemsPerPage, 
				sortBy: this.currentlySorted, 
				ascending: this.sortingAsc[this.currentlySorted],
				startWith: this.appliedFilters.startWith,
				city: this.filterByCity ?this.appliedFilters.city :undefined,
				country: !this.filterByCity ?this.appliedFilters.country :undefined
			};
			console.log(query);

			if(query != this.$route.query)
				this.$router.push({query: query});
		},
		smallerPages() {
			let smallerPages = [];
			let counter = 0;
			for(let i = 1; i < this.currentPage; i++) {
				smallerPages[counter] = i;
				counter++;
			}
			
			if(smallerPages.length > 3) {
				return smallerPages.slice(smallerPages.length-3);
			}
			else {
				return smallerPages;
			}
		},
		biggerPages() {
			let biggerPages = [];
			let counter = 0;
			for(let i = this.currentPage; i < this.availablePages; i++) {
				biggerPages[counter] = i+1;
				counter++;
			}

			return biggerPages.slice(0,3);
		},
		handleDialogClose(ref) {
			this.$refs[ref].close();
			this.$refs.snackbar.open();
			this.getLocationsPage(this.currentPage);
		},
		//Function for adding a starting-letter filter to the list.
		filterByStartingLetter(letter) {
			if(this.appliedFilters.startWith)
				document.getElementsByClassName('start-letter-' + this.appliedFilters.startWith)[0].classList.remove('active-start-letter');

			this.appliedFilters.startWith = letter;
			document.getElementsByClassName('start-letter-' + letter)[0].classList.add('active-start-letter');
		},
		//Function for clearing the starting-letter-filter.
		clearStartLetter() {
			document.getElementsByClassName('start-letter-' + this.appliedFilters.startWith)[0].classList.remove('active-start-letter');
			this.appliedFilters.startWith = undefined;
		},
		//Function for clearing all additional filters.
		clearFilters() {
			this.appliedFilters = {
				startWith: undefined,
				city: undefined,
				country: undefined
			}
		},
		//Function for returning the css classes of one letter of the starting-letters filter.
		buildLetterCssClasses(letter) {
			return 'start-letter-' + letter 
					+ (this.filterCriteria.startWith.indexOf(letter) != -1 ?' available' :' ') //Check if there are events starting with that letter and add respective class.
					+ (this.$route.query.startWith == letter ?' active-start-letter' :''); //Check if the letter is currently selected and add respective class.
		},
		toggleFilters() {
			document.getElementsByClassName('show-filters-button')[0].classList.toggle('opened');
			document.getElementsByClassName('filters')[0].classList.toggle('show-filters');
		},
		changeCurrentPage(page) {
			this.currentPage = page;
			this.buildUrl();
		},
		checkUrlParams() {
			if(this.$route.query.itemsPerPage) {
				this.itemsPerPage = this.$route.query.itemsPerPage;
			}
			else {
				this.itemsPerPage = 20;
			}

			if(this.$route.query.startWith) {
				this.appliedFilters.startWith = this.$route.query.startWith;
			}
			else {
				this.appliedFilters.startWith = '';	
			}

			if(this.$route.query.country) {
				this.filterByCity = false;
				this.appliedFilters.country = this.$route.query.country;
			}
			else {
				this.appliedFilters.country = '';
			}

			if(this.$route.query.city) {
				this.filterByCity = true;
				this.appliedFilters.city = this.$route.query.city;
			}
			else {
				this.filterByCity = false;
				this.appliedFilters.city = '';
			}
		}
	},
	created() {
		console.log("created");
		
		//Get all the filter information from the backend.
		this.$http.get(backendUrl + '/api/locations/filters')
			.then(response => { 
				this.filterCriteria = response.body.data;
			})
			.catch(err => {	});

		if(this.$route.query.page) {
			this.currentPage = this.$route.query.page;
		}

		if(this.$route.query.sortBy && this.$route.query.ascending) {
			this.currentlySorted = this.$route.query.sortBy;
			this.sortingAsc[this.$route.query.sortBy] = (this.$route.query.ascending == 'true');
		}
		else {
			this.sortingAsc.name = true;
		}

		this.getLocationsPage(this.currentPage);
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_locationsList.scss";
</style>
