<template>
  	<div id="events_search">
		<follow-buttons></follow-buttons>
		<div class="darken"></div>
		<div class="page-content">
			<div class="main-input">
				<h1>Find Hardcore and Punk <br> Events, Locations and Bands</h1>
				<div class="search-input">
					<!-- <v-select :options="cities"
								:on-change="onSelect"
								v-model="selectedCity"
								placeholder="Choose City">
					</v-select> -->
					<form v-on:submit.prevent>
						<input class="search-bar" v-model="query" required placeholder="Enter what you are looking for..."></input>
						<md-button type="submit" class="md-raised" v-on:click="search">
								Search
						</md-button>
					</form>
				</div>
			</div>
			<div class="results">
				<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
				<div class="result" v-if="!loading" v-for="(result, index) of results" :key="index">
					<h3>{{result.category}}</h3>
					<p>{{result.data.title? result.data.title: result.data.name}}</p>
				</div>
			</div>
		</div>
  	</div>
</template>

<script>
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
			results: [],
			loading: false
		}
	},
	methods: {
		onSelect() {
		},
		search() {
			document.getElementsByClassName('page-content')[0].classList.remove('slide-up');
			this.loading = true;
			this.$http.get(backendUrl + '/api/search/' + this.query)
			.then(response => {
				console.log(response.body);
				this.results = response.body.data;
				document.getElementsByClassName('page-content')[0].classList.add('slide-up');
				this.loading = false;
			})
			.catch(err => {
				this.loading = false;
			});
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/locations/cities')
			.then(response => {
				this.cities = response.body.data;
			})
			.catch(err => {});

		// let inputElement = document.getElementsByClassName('search-bar')[0];
		// inputElement.addEventListener('focus', () => {
		// 	document.getElementsByClassName('page-content')[0].classList.add('slide-up');
		// });

		// inputElement.addEventListener('blur', () => {
		// 	document.getElementsByClassName('page-content')[0].classList.remove('slide-up');
		// });
	}
} 
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsSearch.scss";
</style>
