<template>
	<div id="band_page">
		<div class="page-container">
			<md-button class="md-icon-button md-accent close-btn" v-on:click="emitClose">
				<md-icon>clear</md-icon>
			</md-button>

			<div class="color-block">
			</div>

			<div class="content">
				
				<div class="content-header">
					<h2>{{data.name?data.name.toUpperCase(): ''}}</h2>
				</div>

				<div class="content-body">
					<h3><md-icon>info_outline</md-icon>General Information</h3>
					<p><span>Genre: </span>{{data.genre}}</p>
					<p v-if="data.label"><span>Label: </span>{{data.label}}</p>
					
					<hr>

					<h3><md-icon>timeline</md-icon>History and Origin</h3>
					<p><span>Founded: </span>{{data.foundingDate}}</p>
					<p><span>Origin: </span> {{data.origin.value}}</p>
					<p v-if="data.history" class="band-history"><span>History / Band description: <br></span> {{data.history}}</p>

					<div class="releases" v-if="data.releases.length > 0">
						<hr>

						<h3><md-icon>album</md-icon>Releases</h3>
						<p v-for="release in data.releases" :key="release.releaseName">{{release.releaseName}} - {{release.releaseYear}}</p>
					</div>

					<hr v-if="data.facebookUrl || data.website || data.bandcampUrl || data.soundclouldUrl">

					<h3 v-if="data.facebookUrl || data.website || data.bandcampUrl || data.soundclouldUrl"><md-icon>subject</md-icon>Additional Information</h3>
					<p v-if="data.facebookUrl"><span>Facebook Page: </span><a :href="data.facebookUrl">{{data.facebookUrl}}</a></p>
					<p v-if="data.website"><span>Website: </span><a :href="data.website">{{data.website}}</a></p>
					<p v-if="data.bandcampUrl"><span>Bandcamp Page: </span><a :href="data.bandcampUrl">{{data.bandcampUrl}}</a></p>
					<p v-if="data.soundclouldUrl"><span>Soundcloud Page: </span><a :href="data.soundclouldUrl">{{data.soundclouldUrl}}</a></p>

					<div class="events" v-if="bandEvents.length > 0">
						<h3><md-icon>date_range</md-icon>Next Shows:</h3>
						<div class="event" v-for="event in bandEvents" :key="event._id" v-on:click="showEvent(event)">
							<div class="event-information">
								<p>{{event.title}}</p>
								<p>{{event.formattedDate}}, {{event.formattedTime}}</p>
								<p>Lineup: <span v-for="band in event.bands" :key="band" class="event-band">{{band}}</span></p>
							</div>
							<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
						</div>
					</div>
				</div>
			</div>
		</div>

		<md-dialog ref="singleEventDialog" class="content-dialog">
			<event-page :data="showEventData" v-on:close="$refs.singleEventDialog.close()"></event-page>
		</md-dialog>
	</div>
</template>

<script>
import { backendUrl } from '@/secrets.js';
import moment from 'moment';
import EventPage from '@/Components/SingleContentPages/EventPage';

export default {
	name: 'band-page',
	components: {
		EventPage
	},
	props: {
		data: Object
	},
	data() {
		return {
			bandEvents: [],
			showEventData: {}
		}
	},
	watch: {
		data() {
			this.$http.get(backendUrl + '/api/bands/events/' + this.data._id)
			.then(response => {
				this.bandEvents = response.body.data;
				if(this.bandEvents) {
					for(let event of this.bandEvents) {
						event.formattedDate = moment(event.startDate).format('LL');
						event.formattedTime = moment(event.startDate).format('HH:mm');
					}
				}
			})
			.catch(err => {})
		}
	},
	methods: {
		emitClose() {
			this.$emit('close');
		},
		//Function for giving the Single-Event dialog the data of the clicked event and opening it.
		showEvent(event) {
			this.showEventData = event;
			this.$refs.singleEventDialog.open();
		}
	},
	updated() {
		console.log("data: ", this.data);
		
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_bandPage.scss";
</style>
