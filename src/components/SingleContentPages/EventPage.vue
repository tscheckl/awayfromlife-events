<template>
	<div id="event_page">
		<div class="page-container">
			<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
				<md-icon>clear</md-icon>
			</md-button>

			<div class="color-block">
			</div>

			<div class="content">
				
				<div class="content-header">
					<h2>{{data.title?data.title.toUpperCase(): ''}}</h2>
					<h4 class="date">{{formattedDate}}</h4>
				</div>

				<div class="content-body">
					<h3><md-icon>location_on</md-icon>Location</h3>
					<p>{{eventLocation.name}}</p>
					<p>{{eventLocation.address.street}}</p>
					<p>{{eventLocation.address.postcode}} {{eventLocation.address.city}}</p>
					<p>{{eventLocation.address.country}}</p>

					<hr>

					<h3 class="start-time"><md-icon>alarm</md-icon>Start:</h3><span>{{formattedTime}} Uhr</span>

					<hr>

					<h3><md-icon>queue_music</md-icon>Lineup </h3>
					<ul>
						<li v-for="band in data.bands" :key="band">{{band}}</li>
					</ul>
					
					<hr>

					<h3><md-icon>format_quote</md-icon>Description</h3>
					<p>{{data.description}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { backendUrl } from '@/secrets.js'
import moment from 'moment';

export default {
	name: 'event-page',
	watch: {
		data() {
			this.$http.get(backendUrl + '/api/locations/byid/' + this.data.location)
				.then (response => {
					this.eventLocation = response.body.data;
				})
				.catch(err => {
					console.log(err);
				});

			this.formattedDate = moment(this.data.startDate).format('LL');
			this.formattedTime = moment(this.data.startDate).format('HH:mm');
		}
	},
	props: {
		data: undefined
	},
	data() {
		return {
			formattedDate: '',
			formattedTime: '',
			eventLocation: Object
		}
	},
	methods: {
		emitClose() {
			this.$emit('close');
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_eventPage.scss";
</style>
