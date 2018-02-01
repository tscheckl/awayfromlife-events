<template>
	<div id="sidenav">
		<div class="menu-item toggle-menu-btn" v-on:click="toggleSidenav">
			<md-icon>menu</md-icon>
		</div>

		<div class="menu-items-list">
			<div class="menu-item" v-on:click="removeExpandedClass">
				<router-link to="/events">
					<md-icon>date_range</md-icon>
					<span >Events</span>
				</router-link>
			</div>

			<div class="menu-item" v-on:click="removeExpandedClass">
				<router-link to="/locations">
					<md-icon>location_on</md-icon>
					<span>Locations</span>
				</router-link>
			</div>

			<div class="menu-item" v-on:click="removeExpandedClass">
				<router-link to="/">
					<md-icon>music_note</md-icon>
					<span >Bands</span>
				</router-link>
			</div>

			<div class="menu-item" v-on:click="removeExpandedClass">
				<router-link :to="isAuthenticated? '/admin': '/login'">
					<md-icon>supervisor_account</md-icon>
					<span>Admin-Login</span>
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
			if(!this.expanded) {
				this.addExpandedClass();
			}
			else {
				this.removeExpandedClass();
			}
		},
		removeExpandedClass() {
			this.expanded = false;
			document.getElementById('sidenav').classList.remove('expanded');
		},
		addExpandedClass() {
			this.expanded = true;
			document.getElementById('sidenav').classList.add('expanded');
		},
		isAuthenticated() {
			Vue.http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
				.then(response => {
					return true;
				})
				.catch(err => {
					return false;
				})
		},
	}
}
</script>

<style lang="scss">
	@import "src/scss/_sidenav.scss";
</style>
