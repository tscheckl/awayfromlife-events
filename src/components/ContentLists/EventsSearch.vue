<template>
  	<div id="events_search">
		<follow-buttons></follow-buttons>
		<div class="darken"></div>
		<div class="main-input">
			<h1>Find Hardcore and Punk Events in your City</h1>
			<div class="search-input">
				<v-select :options="cities"
							:on-change="onSelect"
							v-model="selectedCity"
							placeholder="Choose City">
				</v-select>
				<router-link to="/all-events">
					<md-button class="md-raised">
							Search
					</md-button>
				</router-link>
			</div>
		</div>
  	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import FollowButtons from '@/components/FollowButtons';

export default {
	name: 'events-search',
	components: {
		FollowButtons
	},
	data() {
		return {
			cities: [],
			selectedCity: ''
		}
	},
	methods: {
		onSelect() {
			console.log("meddl");
		},
	},
	mounted() {
		this.$http.get(backendUrl + '/api/locations/cities')
			.then(response => {
				this.cities = response.body.data;
			})
			.catch(err => {
				console.log(err);
				
			});

		let inputElement = document.getElementsByClassName('form-control')[0];
		inputElement.addEventListener('focus', () => {
			document.getElementsByClassName('main-input')[0].classList.add('slide-up');
		});

		inputElement.addEventListener('blur', () => {
			document.getElementsByClassName('main-input')[0].classList.remove('slide-up');
		});
	}
} 
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsSearch.scss";
</style>
