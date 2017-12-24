<template>
	<div id="single_event">
	  	<h3 class="event-title">{{data.title}}</h3>
		<span class="event-date">{{formattedDate}}</span>
		<p class="event-description">{{data.description}}</p>
 	 </div>
</template>

<script>
import moment from 'moment';

export default {
	name: 'single-event',
	props: {
		data: Object
	},
	computed: {
		formattedDate() {
			return moment(this.data.startDate).format('YYYY-MM-DD');
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/Calendar/_singleEvent";
</style>
