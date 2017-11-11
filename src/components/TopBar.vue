<template>
  <div>
		
		<div id="topbar">
			<md-toolbar>
				<md-button class="md-icon-button" @click="toggleSidenav">
					<md-icon>menu</md-icon>
				</md-button>
				<a href="https://www.awayfromlife.com/"><md-icon>arrow_back</md-icon> Back to AFL</a>
				<md-button-toggle md-single class="switch-button">
				<router-link to="/event-map">
					<md-button :class="!isCalendar ? 'md-toggle': ''">Map</md-button>
				</router-link>
				<router-link to="/calendar">
					<md-button :class="isCalendar ? 'md-toggle': ''">Calendar</md-button>
				</router-link>
				</md-button-toggle>
				<slot></slot>
			</md-toolbar>
		</div>

		<md-sidenav class="md-left" ref="sidenav">
		</md-sidenav>
	</div>
</template>

<script>
export default {
	name: 'top-bar',
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
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_topbar.scss";
</style>
