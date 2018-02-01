<template>
	<div id="locations_list">
		<div class="list-header">
			<h1>All Locations</h1>

			<md-button class="md-raised" v-on:click="openDialog('new-location-dialog')"><md-icon>add</md-icon>Create new Location</md-button>
		</div>
		<div class="all-items">
			<div class="list-item" v-for="(location, index) in locations" :key="index">
				<h3>{{location.name}}</h3>
				<md-icon>keyboard_arrow_right</md-icon>
			</div>
		</div>
		<div class="color-block"></div>

		<md-dialog ref="new-location-dialog">
			<new-location v-on:close="$refs['new-location-dialog'].close()"></new-location>
		</md-dialog>
	</div>
</template>

<script>
import {frontEndSecret, backendUrl} from '@/secrets.js';
import NewLocation from "@/components/NewContent/NewLocation";

export default {
	name: 'locations-list',
	components: {
		NewLocation
	},
	data() {
		return {
			locations: []
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/locations')
			.then(response => {
				this.locations = response.body;
				console.log(this.locations);
			})
			.catch(err => {
				console.log(err);
			});
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_locationsList.scss";
</style>
