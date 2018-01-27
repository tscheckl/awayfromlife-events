<template>
	<div id="events_list">
		<div class="list-header">
			<h1>All Events</h1>
		</div>
		<div class="all-events">
			<div class="event" v-for="(event, index) in events" :key="index">
				<h3>{{event.title}}</h3>
				<md-icon>keyboard_arrow_right</md-icon>
			</div>
		</div>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'events-list',
	data() {
		return {
			events: []
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/events')
			.then(response => {
				this.events = response.body;
				console.log(this.events);
			})
			.catch(err => {
				console.log(err);
			})
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_eventsList.scss";
</style>
