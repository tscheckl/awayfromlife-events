<template>
	<div id="bands_list">
		<div class="list-header">
			<div class="header-line">
				<div class="left-container">
					<h1>All Bands</h1>
				</div>

				<md-button class="md-raised create-content-btn" v-on:click="openDialog('newBandDialog')"><md-icon>add</md-icon>Create new Band</md-button>
			</div>

			<h3 class="show-filters-button" v-on:click="toggleFilters">
				<md-icon>filter_list</md-icon> 
				<span>Filter Results</span> 
				<md-icon>keyboard_arrow_right</md-icon>
			</h3>
			<div class="filters">
				<h3>Bands from A to Z: </h3>
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
					<md-input-container class="genre-select">
						<span class="input-label" v-if="appliedFilters.genre && appliedFilters.genre != ''">Genre</span>
						<v-select :options="filterCriteria.genres"
								  v-model="appliedFilters.genre"
								  placeholder="Genre">
						</v-select>
					</md-input-container>

					<md-input-container class="label-select">
						<span class="input-label" v-if="appliedFilters.label && appliedFilters.label != ''">Label</span>
						<v-select :options="filterCriteria.labels"
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
							<v-select :options="filterCriteria.cities"
										v-model="appliedFilters.city"
										placeholder="City">
							</v-select>
						</md-input-container>

						<md-input-container class="country-select" v-if="!filterByCity">
							<span class="input-label" v-if="appliedFilters.country && appliedFilters.country != ''">Country</span>
							<v-select :options="filterCriteria.countries"
										v-model="appliedFilters.country"
										placeholder="Country">
							</v-select>
						</md-input-container>
					</div>
				</div>

				<md-button v-if="appliedFilters.startWith || appliedFilters.genre || appliedFilters.country || appliedFilters.city || appliedFilters.label" 
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
				<h3 class="no-items-title" v-if="bands.length == 0">No Bands found..</h3>

				<div class="list-item-header" v-if="bands.length > 0">
					<p class="band-name" v-on:click="sortBy('name')">
						<span>Name
							<md-icon v-if="currentlySorted == 'name'">{{!sortingAsc.name? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p> 
					<p class="band-genres" v-on:click="sortBy('genre')">
						<span>Genre 
							<md-icon v-if="currentlySorted == 'genre'">{{!sortingAsc.genre? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p>
					<p class="band-origin" v-on:click="sortBy('origin.name')">
						<span>Origin 
							<md-icon v-if="currentlySorted == 'origin.name'">{{!sortingAsc['origin.name']? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p>
					<md-icon class="hidden-icon"></md-icon>
				</div>

				<div class="list-item" v-for="(band, index) in bands" :key="index" v-on:click="showBand(band)">
					<h3 class="band-name">{{band.name}}</h3>
					<p class="band-genres"><span class="band-genre" v-for="genre in band.genre" :key="genre">{{genre}}</span></p>
					<p class="band-origin"><span>{{band.origin.name}}</span> {{band.origin.country}}</p>
					<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
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
				
				<md-input-container>
					<p>Items per Page</p>
					<md-select name="itemsPerPage" v-model="itemsPerPage">
						<md-option value="5">5</md-option>
						<md-option value="10">10</md-option>
						<md-option value="20">20</md-option>
						<md-option value="50">50</md-option>
					</md-select>
				</md-input-container>
			</div>
		</div>

		<md-dialog ref="newBandDialog">
			<new-band v-on:close="handleDialogClose('newBandDialog')"></new-band>
		</md-dialog>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >New band successfully created!</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import moment from 'moment';
import NewBand from "@/Components/NewContent/NewBand";

export default {
	name: 'bands-list',
	components: {
		NewBand
	},
	data() {
		return {
			bands: [],
			sortingAsc: {
				name: false,
				genre: false,
				'origin.name': false
			},
			currentlySorted: 'name',
			filterCriteria: {
				startWith: [],
				cities: undefined,
				countries: undefined,
				genres: undefined,
				label: undefined
			},
			appliedFilters: {
				startWith: undefined,
				city: undefined,
				country: undefined,
				genre: undefined,
				label: undefined
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
				this.getBandsPage(this.currentPage);
			},
			deep: true
		},
		$route(to, from) {
				this.getBandsPage(to.query.page);
		},
		itemsPerPage() {
			this.buildUrl();
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		//Function for giving the Band-Event dialog the data of the clicked band and opening it.
		showBand(band) {
			this.$store.commit('setCurrentBand', band);
			this.$router.push({path: `/band/${band.url}`});
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
		getBandsPage(page) {
			this.loading = true;
			this.checkUrlParams();

			let sortingDirection = this.sortingAsc[this.currentlySorted] ? 1 : -1;
			//Catch problem if the starting letter is # and convert it so the backend can parse it.
			let startingLetter = this.appliedFilters.startWith == '#' ?'%23' :this.appliedFilters.startWith;

			this.$http.get(backendUrl + '/api/bands/page?page=' + page + 
										'&perPage=' + this.itemsPerPage + 
										'&sortBy=' + this.currentlySorted + 
										'&order=' + sortingDirection +
										'&startWith=' + startingLetter + 
										(this.appliedFilters.genre ?('&genre=' + this.appliedFilters.genre) :'') + 
										(this.appliedFilters.label ?('&label=' + this.appliedFilters.label) :'') + 
										((this.filterByCity && this.appliedFilters.city) ?('&city=' + this.appliedFilters.city) :'') +
										((!this.filterByCity && this.appliedFilters.country) ?('&country=' + this.appliedFilters.country) :''))
			.then(response => {
				//Check if backend sent data, i.e. not sending an error message.
				if(response.body.data) {
					this.bands = response.body.data;
				}
				//If an error message is sent, set the events to be empty which will show a warning message in the list.
				else {
					this.bands = [];
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
				genre: this.appliedFilters.genre,
				label: this.appliedFilters.label,
				city: this.filterByCity ?this.appliedFilters.city :undefined,
				country: !this.filterByCity ?this.appliedFilters.country :undefined
			};
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
			this.getBandsPage(this.currentPage);
		},
		//Function for adding a starting-letter filter to the list.
		filterByStartingLetter(letter) {
			if(this.appliedFilters.startWith)
				document.getElementsByClassName('start-letter-' + this.appliedFilters.startWith)[0].classList.remove('active-start-letter');

			this.appliedFilters.startWith = letter;
			document.getElementsByClassName('start-letter-' + letter)[0].classList.add('active-start-letter');
		},
		//Function for clearing one or all filters.
		clearStartLetter() {
			document.getElementsByClassName('start-letter-' + this.appliedFilters.startWith)[0].classList.remove('active-start-letter');
			this.appliedFilters.startWith = undefined;
		},
		//Function for clearing all additional filters.
		clearFilters() {
			this.appliedFilters = {
				startWith: undefined,
				city: undefined,
				country: undefined,
				label: undefined,
				genre: undefined
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
		//Get all the filter information from the backend.
		this.$http.get(backendUrl + '/api/bands/filters')
			.then(response => { 
				this.filterCriteria = response.body.data;
			})
			.catch(err => {	});

		if(this.$router.currentRoute.query.page) {
			this.currentPage = this.$router.currentRoute.query.page;
		}

		if(this.$route.query.sortBy && this.$route.query.ascending) {
			this.currentlySorted = this.$route.query.sortBy;
			this.sortingAsc[this.$route.query.sortBy] = (this.$route.query.ascending == 'true');
		}
		else {
			this.sortingAsc.name = true;
		}

		this.getBandsPage(this.currentPage);
	}
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_bandsList.scss";
</style>
