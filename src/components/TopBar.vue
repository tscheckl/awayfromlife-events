<template>
  <div id="topbar">
	  <md-toolbar>
		  <a href="https://www.awayfromlife.com/"><i class="material-icons">keyboard_arrow_left</i> Back to AFL</a>
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
	}
}
</script>

<style lang="scss">
	@import "src/scss/_topbar.scss";
</style>
