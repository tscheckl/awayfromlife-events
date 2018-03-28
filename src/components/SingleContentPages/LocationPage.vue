<template>
	<div id="location_page">
		<div class="page-container">
			<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
				<md-icon>clear</md-icon>
			</md-button>

			<div class="color-block">
			</div>

			<div class="content">
				<div class="content-header">
					<h2>{{data.name}}</h2>
				</div>

				<div class="content-body">
					<h3><md-icon>directions</md-icon>Address</h3>
					<p>{{data.address.street}}</p>
					<p>{{data.address.postcode}} {{data.address.city}}</p>
					<p>{{data.address.administrative}}</p>
					<p>{{data.address.country}}</p>

					<hr v-if="data.website || data.facebook_page_url">

					<h3 v-if="data.website || data.facebook_page_url"><md-icon>info_outline</md-icon>Additional Information</h3>
					<p v-if="data.website" class="website">Website: <a :href="data.website">{{data.website}}</a></p>
					<p v-if="data.facebook_page_url" class="facebook-page">Facebook Page: <a :href="data.facebook_page_url">{{data.facebook_page_url}}</a></p>

					<hr v-if="data.information">

					<h3 v-if="data.information"><md-icon>format_quote</md-icon>Description</h3>
					<p>{{data.information}}</p>

					<div class="events" v-if="locationEvents.length > 0">
						<h3><md-icon>event</md-icon>Upcoming Events:</h3>
						<div class="event" v-for="event in locationEvents" :key="event._id">
							<p>{{event.title}}</p>
							<p>{{event.formattedDate}}, {{event.formattedTime}}</p>
							<p>Lineup: <span v-for="band in event.bands" :key="band" class="event-band">{{band}}</span></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { backendUrl } from '@/secrets.js';
import moment from 'moment';

export default {
	name: 'location-page',
	props: {
		data: undefined
	},
	data() {
		return {
			locationEvents: []
		}
	},
	watch: {
		data() {
			this.$http.get(backendUrl + '/api/events/location/' + this.data._id)
			.then(response => {
				console.log('Events at this location: ', response);
				this.locationEvents = response.body;

				for(let event of this.locationEvents) {
					event.formattedDate = moment(event.startDate).format('LL');
					event.formattedTime = moment(event.startDate).format('HH:mm');
				}
			})
			.catch(err => {
				console.log(err);
			})
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
	@import "src/scss/SingleContentPages/_locationPage.scss";
</style>
