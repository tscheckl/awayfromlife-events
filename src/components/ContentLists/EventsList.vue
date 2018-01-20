<template>
	<div id="events_list">
		<div class="event" v-for="(event, index) in events" :key="index">
			<h1>{{event.title}}</h1>
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
