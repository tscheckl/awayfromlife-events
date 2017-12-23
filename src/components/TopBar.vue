<template>
	<div id="topbar">
		<md-toolbar>
			<md-button href="https://www.awayfromlife.com/" class="topbar-btn" >
				<md-icon>arrow_back</md-icon>
				<md-tooltip md-direction="bottom">Back to AFL</md-tooltip> 
			</md-button>

			<div style="flex:1;"></div>
			
			<!-- <md-button-toggle md-single class="switch-button">
				<router-link to="/event-map">
					<md-button :class="!isCalendar ? 'md-toggle': ''">Map</md-button>
				</router-link>
				<router-link to="/calendar">
					<md-button :class="isCalendar ? 'md-toggle': ''">Calendar</md-button>
				</router-link>
			</md-button-toggle> -->
			
			<md-button id="newEvent" class="new-event-btn topbar-btn" v-on:click="openDialog('newEventDialog')">
				<md-icon>event</md-icon>
				<md-tooltip md-direction="bottom">Create new Event</md-tooltip>
			</md-button>

			<md-button id="newLocation" class="new-location-btn topbar-btn" v-on:click="openDialog('newLocationDialog')">
				<md-icon>location_on</md-icon>
				<md-tooltip md-direction="bottom">Create new Location</md-tooltip>
			</md-button>

			<router-link :to="isAuthenticated? '/admin': '/login'">
				<md-button class="admin-login-btn topbar-btn">
					<md-icon>supervisor_account</md-icon>
					<md-tooltip md-direction="bottom">Admin-Login</md-tooltip>
				</md-button>
			</router-link>
		</md-toolbar>

		<md-dialog ref="newEventDialog" class="new-content-dialog" md-open-from="#newEvent" md-close-to="#newEvent">
			<new-event v-on:close="closeDialog('newEventDialog')"></new-event>
		</md-dialog>

		<md-dialog ref="newLocationDialog" class="new-content-dialog"  md-open-from="#newLocation" md-close-to="#newLocation">
			<new-location v-on:close="closeDialog('newLocationDialog')"></new-location>
		</md-dialog>
	</div>
</template>

<script>
import NewLocation from './NewLocation';
import NewEvent from './NewEvent';

export default {
	name: 'top-bar',
	components: {
		NewLocation,
		NewEvent,
	},
	computed: {
		isCalendar: function() {
			if(this.$route.path.indexOf('event-map') !== -1) {
				return false;
			}
			else {
				return true;
			}
		}
	},
	methods: {
		toggleSidenav() {
			this.$refs.sidenav.toggle();
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		closeDialog(ref) {
			this.$refs[ref].close();
		},
		isAuthenticated() {
			Vue.http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
				.then(response => {
					return true;
				})
				.catch(err => {
					return false;
				})
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_topbar.scss";
</style>
