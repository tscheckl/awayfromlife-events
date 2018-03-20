<template>
	<div id="sidenav">
		<div class="menu-item toggle-menu-btn" v-on:click="toggleSidenav">
			<button class="hamburger hamburger--spring" type="button">
				<span class="hamburger-box">
					<span class="hamburger-inner"></span>
				</span>
			</button>
		</div>

		<div class="menu-items-list">
			
			<router-link to="/search">
				<div class="menu-item" v-on:click="removeExpandedClass">
					<md-icon>search</md-icon>
					<span >Search</span>
				</div>
			</router-link>

			<router-link to="/events">
				<div class="menu-item" v-on:click="removeExpandedClass">
					<md-icon>date_range</md-icon>
					<span >Events</span>
				</div>
			</router-link>

			<router-link to="/locations">
				<div class="menu-item" v-on:click="removeExpandedClass">
					<md-icon>location_on</md-icon>
					<span>Locations</span>
				</div>
			</router-link>

			<router-link to="/">
				<div class="menu-item" v-on:click="removeExpandedClass">
					<md-icon>music_note</md-icon>
					<span >Bands</span>
				</div>
			</router-link>

			<router-link :to="isAuthenticated? '/admin': '/login'">
				<div class="menu-item" v-on:click="removeExpandedClass">
					<md-icon>supervisor_account</md-icon>
					<span>Admin-Login</span>
				</div>
			</router-link>
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
			document.getElementsByClassName('hamburger')[0].classList.remove('is-active');
		},
		addExpandedClass() {
			this.expanded = true;
			document.getElementById('sidenav').classList.add('expanded');
			document.getElementsByClassName('hamburger')[0].classList.add('is-active');
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
