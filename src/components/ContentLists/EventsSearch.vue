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
						<input class="search-bar" v-model="query" required placeholder="Enter what you are looking for...">
						<md-button type="submit" class="md-raised" v-on:click="search">
								Search
						</md-button>
					</form>
				</div>
			</div>
			<div class="results">
				<md-spinner md-indeterminate class="md-accent" v-if="loading"></md-spinner>
				<div class="result-category result-events"  v-if="resultEvents.length > 0">
					<h2>Event Results: </h2>
					<div class="result" v-if="!loading" v-for="(result, index) of resultEvents" :key="index" v-on:click="showResult(result)">
						<div class="result-content">
							<h3>{{result.data.title}}</h3>
							<p>Result found in {{result.match.pretty}}: {{result.match.value}}</p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</div>
				</div>
				<div class="result-category result-locations" v-if="resultLocations.length > 0">
					<h2>Location Results: </h2>
					<div class="result" v-if="!loading" v-for="(result, index) of resultLocations" :key="index" v-on:click="showResult(result)">
						<div class="result-content">
							<h3>{{result.data.name}}</h3>
							<p>Result found in {{result.match.pretty}}: {{result.match.value}}</p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</div>
				</div>
				<div class="result-category result-bands" v-if="resultBands.length > 0">
					<h2>Band Results: </h2>
					<div class="result" v-if="!loading" v-for="(result, index) of resultBands" :key="index" v-on:click="showResult(result)">
						<div class="result-content">
							<h3>{{result.data.name}}</h3>
							<p>Result found in {{result.match.pretty}}: {{result.match.value}}</p>
						</div>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</div>
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
			resultEvents: [],
			resultLocations: [],
			resultBands: [],
			loading: false
		}
	},
	methods: {
		emptyResults() {
			this.resultEvents = [];
			this.resultLocations = [];
			this.resultBands = [];
		},
		search() {
			this.emptyResults();
			document.getElementsByClassName('page-content')[0].classList.remove('slide-up');
			this.loading = true;
			this.$http.get(backendUrl + '/api/search/' + this.query)
			.then(response => {
				this.$router.push({query: {
					query: this.query,
				}});
				
				for(let result of response.body.data) {
					if(result.category == 'Event')
						this.resultEvents.push(result);
					else if(result.category == 'Location')
						this.resultLocations.push(result);
					else if(result.category == 'Band')
						this.resultBands.push(result);
				}
				
				this.results = response.body.data;
				document.getElementsByClassName('page-content')[0].classList.add('slide-up');
				this.loading = false;
			})
			.catch(err => {
				this.loading = false;
			});
		},
		showResult(result) {
			this.$store.commit(('setCurrent' + result.category), result.data);
			this.$router.push({path: `/${result.category}/${result.data._id}`});
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

		if(this.$route.query.query) {
			this.query = this.$route.query.query;
			this.search();
		}
	}
} 
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsSearch.scss";
</style>
