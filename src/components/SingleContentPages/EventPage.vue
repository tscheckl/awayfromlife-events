<template>
	<div id="event_page">
		<div class="event-page-container">
			<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
				<md-icon>clear</md-icon>
			</md-button>

			<div class="color-block">
			</div>

			<div class="content">
				
				<h2>{{data.title}}</h2>
				<h4 class="date">{{formattedDate}}</h4>

				<h3>Location</h3>
				<p>{{eventLocation.name}}</p>
				<p>{{eventLocation.adress}}</p>

				<h3 class="start-time">Beginn:</h3><span>{{formattedTime}} Uhr</span>

				<h3>Lineup </h3>
				<ul>
					<li v-for="band in data.bands" :key="band">{{band}}</li>
				</ul>
				<h3>Beschreibung des Events </h3>
				<p>{{data.description}}</p>
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
			this.$http.get(backendUrl + '/api/locations/' + this.data.location)
				.then (response => {
					this.eventLocation = response.body;
				})
				.catch(err => {
					console.log(err);
				});

			this.formattedDate = moment(this.data.startDate).format('LL');
			this.formattedTime = moment(this.data.startDate).format('HH:mm');
			console.log(this.formattedTime);
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
