<template>
	<div id="latest_content">
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
			<md-card v-for="(item, index) in content" :key="index" md-with-hover>
				<router-link :to="`/${item.category == 'festivalEvent' ? 'festival' :item.category}/${item.data.url}`">
					<md-card-media>
						<img :src="`${baseUrl}/${item.data.image[1]}`" :alt="`Image for ${item.data.name}`">
					</md-card-media>
					<div class="color-block"></div>
					<div class="card-content">
						<h2>{{item.data.name}}</h2>
						<p>{{item.data.formattedDate}}</p>
						<div class="bands">
							<span v-for="(band, h) in item.data.bands" :key="h">{{band.name}}</span>
						</div>
					</div>
				</router-link>
			</md-card>
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
		}
	},
	computed: {
		baseUrl() {
			return imageUrl;
		}
	},
	mounted() {
		this.$http.get(`${backendUrl}/api/general/latest?count=8`)
			.then(response => {
				if(!response.body.message) {
					this.content = response.body.data;	
					console.log(this.content);
					this.content.forEach(element => {
						if(element.category == 'event')
							element.data.formattedDate = moment(element.data.date).format('LL');
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
