<template>
  <div>
		
		<div id="topbar">
			<md-toolbar>
				<md-button v-if="$mq.resize && $mq.below('600px')" class="md-icon-button" @click="toggleSidenav">
					<md-icon>menu</md-icon>
				</md-button>

				<md-button href="https://www.awayfromlife.com/" class="topbar-btn" v-if="$mq.resize && $mq.above('600px')">
					<md-icon>arrow_back</md-icon>
					<md-tooltip md-direction="bottom">Back to AFL</md-tooltip> 
				</md-button>
				
				<md-button-toggle md-single class="switch-button">
					<router-link to="/event-map">
						<md-button :class="!isCalendar ? 'md-toggle': ''">Map</md-button>
					</router-link>
					<router-link to="/calendar">
						<md-button :class="isCalendar ? 'md-toggle': ''">Calendar</md-button>
					</router-link>
				</md-button-toggle>
				
				<slot v-if="$mq.resize && $mq.above('600px')"></slot>
			</md-toolbar>
		</div>

		<md-sidenav v-if="$mq.resize && $mq.below('600px')" class="md-left" ref="sidenav">
			<md-list>
				<md-list-item>
					<md-button href="https://www.awayfromlife.com/">
						<md-icon>arrow_back</md-icon><span>Back to AFL</span> 
					</md-button>
				</md-list-item>

				<md-list-item>
					<slot></slot>
				</md-list-item>
			</md-list>
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
