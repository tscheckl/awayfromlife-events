<template>
	<div id="latest_content">
		<h2 class="recent-content-header">Recently added:</h2>
		<div class="content">
			<!-- <div class="card" v-for="(item, index) in content" :key="index">
				<router-link :to="`/${item.isFestival ?'festival' :'event'}/${item.url}`">
					<div class="card-image-wrapper">
						<img :src="`${baseUrl}/${item.image[1]}`" :alt="`Image for ${item.name}`">
					</div>
					<div class="card-content">
						<h2>{{item.name}}</h2>
						<p>{{item.formattedDate}}</p>
						<div class="bands">
							<span v-for="(band, h) in item.bands" :key="h">{{band.name}}</span>
						</div>
						<p>{{item.location.name}}, {{item.location.address.city}}</p>
					</div>
				</router-link>
			</div> -->
			<md-spinner md-indeterminate v-if="loading"></md-spinner>
			<main v-if="!loading">
				<md-card v-for="(item, index) in content" :key="index" md-with-hover>
					<router-link :to="`/${item.category == 'festivalEvent' ? 'festival' :item.category}/${item.category == 'festivalEvent' ?item.data.festival.url :item.data.url}`">
						<span class="card-category">{{item.category == 'festivalEvent' ?'festival' :item.category}}</span>

						<md-card-media>
							<img :src="`${baseUrl}/${item.data.image[1]}`" :alt="`Image for ${item.data.name}`">
						</md-card-media>
						
						<div class="card-content">
							<h2>{{item.data.name}}</h2>
							<div class="card-details" v-if="item.category == 'event'">
								<p class="bold-detail">{{item.data.formattedDate}}</p>
								<p v-if="item.data.location">{{item.data.location.name}}, {{item.data.location.address.city}}</p>
								<div class="bands">
									<span v-for="(band, h) in item.data.bands" :key="h">{{band.name}}</span>
								</div>
							</div>
							<div class="card-details" v-if="item.category == 'band'">
								<div class="genres">
									<span class="bold-detail" v-for="(genre, index) in item.data.genre" :key="index">{{genre}}</span>
								</div>
								<p>{{item.data.origin.city}}, {{item.data.origin.country}}</p>
							</div>

							<div class="card-details" v-if="item.category == 'location'">
								<p>{{item.data.address.street}}</p>
								<p class="bold-detail">{{item.data.address.city}}, {{item.data.address.country}}</p>
							</div>

							<div class="card-details" v-if="item.category == 'festivalEvent'">
								<p  class="bold-detail">{{item.data.formattedStartDate}} - {{item.data.formattedEndDate}}</p>
								<div class="genres">
									<span v-for="(genre, index) in item.data.festival.genre" :key="index">{{genre}}</span>
								</div>
								<p>{{item.data.festival.address.city}}, {{item.data.festival.address.country}}</p>
							</div>
						</div>
					</router-link>
				</md-card>
			</main>
		</div>
	</div>
</template>

<script>
import { backendUrl, imageUrl } from '@/secrets.js';
import moment from 'moment';

export default {
	name: "latest-content",
	data() {
		return {
			content: Array,
			loading: false
		}
	},
	computed: {
		baseUrl() {
			return imageUrl;
		}
	},
	mounted() {
		this.loading = true;
		this.$http.get(`${backendUrl}/api/general/latest?count=8`)
			.then(response => {
				if(!response.body.message) {
					this.content = response.body.data;	
					this.content.forEach(element => {
						if(element.category == 'event')
							element.data.formattedDate = moment(element.data.date).format('ll');

						if(element.category == 'festivalEvent') {
							element.data.formattedStartDate = moment(element.data.startDate).format('ll');
							element.data.formattedEndDate = moment(element.data.endDate).format('ll');
						}
					});
				}
				this.loading = false;
			})
			.catch(err => {
				this.loading = false;
			});
	}
}
</script>

<style lang="scss">
	@import "src/scss/Search/_latestContent.scss";
</style>
