<template>
	<div id="sidenav">
		<div class="menu-item toggle-menu-btn" v-on:click="toggleSidenav">
			<md-icon>menu</md-icon>
		</div>

		<div class="menu-items-list">
			<div class="menu-item">
				<router-link to="/events">
					<md-icon>date_range</md-icon>
					<span >Events</span>
				</router-link>
			</div>

			<div class="menu-item">
				<router-link to="/">
					<md-icon>location_on</md-icon>
					<span>Locations</span>
				</router-link>
			</div>

			<div class="menu-item">
				<router-link to="/">
					<md-icon>music_note</md-icon>
					<span >Bands</span>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'sidenav',
	data() {
		return {
			expanded:false
		}
	},
	methods: {
		toggleSidenav() {
			this.expanded = !this.expanded;
			
			if(this.expanded) {
				document.getElementById('sidenav').classList.add('expanded');
			}
			else {
				document.getElementById('sidenav').classList.remove('expanded');
			}
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_sidenav.scss";
</style>
