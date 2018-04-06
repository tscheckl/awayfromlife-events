<template>
	<div id="single_event">
		<div class="upper-information">
			<h3 class="event-title">{{data.title}}</h3>
			<span class="event-date">{{formattedDate}}</span>
		</div>
		<div class="event-location"><span><md-icon>location_on</md-icon></span> {{eventLocation.name}}, {{eventLocation.address.city}}</div>
		<p class="event-description"><span><md-icon>format_quote</md-icon></span> {{data.description}}</p>
 	 </div>
</template>

<script>
import { backendUrl } from '@/secrets.js'
import moment from 'moment';

export default {
	name: 'single-event',
	props: {
		data: Object
	},
	data() {
		return {
			eventLocation: {}
		}
	},
	computed: {
		formattedDate() {
			return moment(this.data.startDate).format('YYYY-MM-DD');
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/locations/byid/' + this.data.location)
				.then (response => {
					this.eventLocation = response.body.data;
				})
				.catch(err => {});
	}
}
</script>

<style lang="scss">
	@import "src/scss/Calendar/_singleEvent";
</style>
