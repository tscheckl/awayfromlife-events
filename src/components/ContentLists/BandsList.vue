<template>
	<div id="bands_list">
		<follow-buttons></follow-buttons>

		<div class="list-header">
			<div class="left-container">
				<h1>All Bands</h1>
			</div>

			<md-button class="md-raised create-content-btn" v-on:click="openDialog('newBandDialog')"><md-icon>add</md-icon>Create new Band</md-button>
		</div>
		<div class="all-items">

			<h3 class="no-items-title" v-if="bands.length == 0">No Bands found..</h3>

			<div class="list-item-header" v-if="bands.length > 0">
				<p class="band-name" v-on:click="sortBy('name')">
					<span>Name
						<md-icon v-if="currentlySorted == 'name'">{{!sortingAsc.name? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
					</span>
				</p> 
				<p class="band-genre" v-on:click="sortBy('genre')">
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
				<p class="band-genre">{{band.genre}}</p>
				<p class="band-origin"><span>{{band.origin.name}}</span> {{band.origin.country}}</p>
				<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
			</div>

			<div class="list-footer">
				<div class="pages">
					<span class="page-btn" v-on:click="currentPage > 1 ? getBandsPage(currentPage-1): getBandsPage(currentPage)"><md-icon>keyboard_arrow_left</md-icon></span>
					<span v-for="number in smallerPages()" :key="number" v-on:click="getBandsPage(number)">{{number}}</span>
					<span class="current-page">{{currentPage}}</span>
					<span v-for="number in biggerPages()" :key="number" v-on:click="getBandsPage(number)">{{number}}</span>
					<span class="page-btn" v-on:click="(currentPage < availablePages)? getBandsPage(currentPage+1): getBandsPage(currentPage)"><md-icon>keyboard_arrow_right</md-icon></span>
				</div>
				
				<md-input-container>
					<p>Items per Page</p>
					<md-select name="itemsPerPage" v-model="itemsPerPage" v-on:change="getBandsPage(currentPage)">
						<md-option value="5">5</md-option>
						<md-option value="10">10</md-option>
						<md-option value="20">20</md-option>
						<md-option value="50">50</md-option>
					</md-select>
				</md-input-container>
			</div>
		</div>

		<div class="color-block"></div>

		<md-dialog ref="newBandDialog">
			<new-band v-on:close="handleDialogClose('newBandDialog')"></new-band>
		</md-dialog>

		<md-dialog ref="singleBandDialog" class="content-dialog">
			<band-page v-on:close="handleDialogClose('singleBandDialog')"></band-page>
		</md-dialog>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import moment from 'moment';
import NewBand from "@/Components/NewContent/NewBand";
import BandPage from '@/Components/SingleContentPages/BandPage';
import FollowButtons from '@/Components/FollowButtons';

export default {
	name: 'bands-list',
	components: {
		NewBand,
		BandPage,
		FollowButtons
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
			currentPage: 1,
			availablePages: 1,
			itemsPerPage: '20'
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		//Function for giving the Band-Event dialog the data of the clicked band and opening it.
		showBand(band) {
			this.$store.commit('setCurrentBand', band);
			this.$refs['singleBandDialog'].open();
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
			this.getBandsPage(this.currentPage);
		},
		getBandsPage(page) {
			this.currentPage = page;

			let sortingDirection = this.sortingAsc[this.currentlySorted] ? 1 : -1;

			this.$http.get(backendUrl + '/api/bands/page?page=' + page + '&perPage=' + this.itemsPerPage + '&sortBy=' + this.currentlySorted + '&order=' + sortingDirection)
			.then(response => {
				this.bands = response.body.data;
				
				this.availablePages = response.body.pages;
				this.currentPage = response.body.current;
			})
			.catch(err => {});
		},
		smallerPages() {
			let smallerPages = [];
			let counter = 0;
			for(let i = 1; i < this.currentPage; i++) {
				smallerPages[counter] = i;
				counter++;
			}

			if(smallerPages.length > 3) {
				return smallerPages.slice(1,3);
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
			if(biggerPages.length > 3) {
				return biggerPages.slice(1,3);
			}
			else {
				return biggerPages;
			}
		},
		handleDialogClose(ref) {
			this.$refs[ref].close();
			this.getBandsPage(this.currentPage);
		}
	},
	mounted() {
		this.getBandsPage(this.currentPage);		
		//Sort the bands ascending by their date.
		this.sortingAsc.name = true;
		this.sortBy('name');
	}
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_bandsList.scss";
</style>
