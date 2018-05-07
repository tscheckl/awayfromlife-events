<template>
	<div id="locations_list">
		<follow-buttons></follow-buttons>

		<div class="list-header">
			<div class="left-container">
				<h1>All Locations</h1>
			</div>

			<md-button class="md-raised create-content-btn" v-on:click="openDialog('newLocationDialog')"><md-icon>add</md-icon>Create new Location</md-button>
		</div>
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

				<div class="list-item" v-for="(location, index) in locations" :key="index" v-on:click="showLocation(location)">
					<h3 class="item-title">{{location.name}}</h3>
					<p class="location-address">{{location.address.street}}</p>
					<p class="location-city">{{location.address.city}}</p>
					<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
				</div>
			</div>

			<div class="list-footer">
				<div class="pages">
					<span class="page-btn" v-on:click="currentPage > 1 ? getLocationsPage(currentPage-1): ''"><md-icon>keyboard_arrow_left</md-icon></span>
					<span v-for="number in smallerPages()" :key="number" v-on:click="getLocationsPage(number)">{{number}}</span>
					<span class="current-page">{{currentPage}}</span>
					<span v-for="number in biggerPages()" :key="number" v-on:click="getLocationsPage(number)">{{number}}</span>
					<span class="page-btn" v-on:click="(currentPage < availablePages)? getLocationsPage(currentPage+1): ''"><md-icon>keyboard_arrow_right</md-icon></span>
				</div>
				
				<md-input-container>
					<p>Items per Page</p>
					<md-select name="itemsPerPage" v-model="itemsPerPage" v-on:selected="getLocationsPage(currentPage)">
						<md-option value="5">5</md-option>
						<md-option value="10">10</md-option>
						<md-option value="20">20</md-option>
						<md-option value="50">50</md-option>
					</md-select>
				</md-input-container>
			</div>
		</div>
		<div class="color-block"></div>

		<md-dialog ref="newLocationDialog">
			<new-location v-on:close="handleDialogClose('newLocationDialog')"></new-location>
		</md-dialog>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import NewLocation from "@/Components/NewContent/NewLocation";
import FollowButtons from "@/Components/FollowButtons";

export default {
	name: 'locations-list',
	components: {
		NewLocation,
		FollowButtons
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
			currentPage: 1,
			availablePages: 50,
			itemsPerPage: '20',
			loading: false
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
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
			
			this.$router.push({query: {
				page: this.currentPage, 
				itemsPerPage: this.itemsPerPage, 
				sortBy: this.currentlySorted, 
				ascending: this.sortingAsc[this.currentlySorted]
			}});

			this.getLocationsPage(this.currentPage);
		},
		getLocationsPage(page) {
			this.loading = true;

			this.currentPage = page;
			
			this.$router.push({query: {
				page: this.currentPage, 
				itemsPerPage: this.itemsPerPage, 
				sortBy: this.currentlySorted, 
				ascending: this.sortingAsc[this.currentlySorted]
			}});

			let sortingDirection = this.sortingAsc[this.currentlySorted] ? 1 : -1;

			this.$http.get(backendUrl + '/api/locations/page?page=' + page + '&perPage=' + this.itemsPerPage + '&sortBy=' + this.currentlySorted + '&order=' + sortingDirection)
			.then(response => {
				this.locations = response.body.data;
				this.availablePages = response.body.pages;
				this.currentPage = response.body.current;

				this.loading = false;
			})
			.catch(err => {
				this.loading = false;
			});
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
		showLocation(location) {
			this.$store.commit('setCurrentLocation', location);
			this.$router.push({path: `/location/${location._id}`});
		},
		handleDialogClose(ref) {
			this.$refs[ref].close();
			this.getLocationsPage(this.currentPage);
		}
	},
	created() {
		if(this.$router.currentRoute.query.page) {
			this.currentPage = this.$router.currentRoute.query.page;
		}

		if(this.$route.query.itemsPerPage) {
			this.itemsPerPage = this.$route.query.itemsPerPage;
		}

		if(this.$route.query.sortBy && this.$route.query.ascending) {
			this.currentlySorted = this.$route.query.sortBy;
			this.sortingAsc[this.$route.query.sortBy] = (this.$route.query.ascending == 'true');
			this.getLocationsPage(this.currentPage);
		}
		else {
			this.sortingAsc.name = true;
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_locationsList.scss";
</style>
