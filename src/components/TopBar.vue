<template>
  <div id="topbar">
	  <md-toolbar>
		  <a href="https://www.awayfromlife.com/" style="flex:1;"><i class="material-icons">keyboard_arrow_left</i> Back to AFL</a>
		  <md-button-toggle md-single style="flex:1;">
			<router-link to="/event-map">
				<md-button>Map</md-button>
			</router-link>
			<router-link to="/calendar">
				<md-button class="md-toggle">Calendar</md-button>
			</router-link>
		  </md-button-toggle>
		  <slot></slot>
	  </md-toolbar>
  </div>
</template>

<script>
export default {
	name: 'top-bar',
}
</script>

<style lang="scss">
	@import "src/scss/_topbar.scss";
</style>
