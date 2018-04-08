<template>
	<div id="sidenav">
		<div class="mobile-toggle-btn">
			<button class="hamburger hamburger--spring" type="button" v-on:click="toggleSidenav">
				<span class="hamburger-box">
					<span class="hamburger-inner"></span>
				</span>
			</button>
		</div>

		<div class="menu-items-list">
			<div class="menu-item toggle-menu-btn" v-on:click="toggleSidenav">
				<button class="hamburger hamburger--spring" type="button">
					<span class="hamburger-box">
						<span class="hamburger-inner"></span>
					</span>
				</button>
			</div>
			
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

			<router-link to="/bands">
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
		addExpandedClass() {
			this.expanded = true;
			document.getElementById('sidenav').classList.add('expanded');
			if(window.matchMedia('(max-width: 768px)').matches) {
				document.getElementsByTagName('body')[0].classList.add('unscrollable');
				document.getElementsByClassName('hamburger')[0].classList.add('is-active');
			}
			else {
				document.getElementsByClassName('hamburger')[1].classList.add('is-active');
			}
		},
		removeExpandedClass() {
			this.expanded = false;
			document.getElementById('sidenav').classList.remove('expanded');
			if(window.matchMedia('(max-width: 768px)').matches) {
				document.getElementsByTagName('body')[0].classList.remove('unscrollable');
				document.getElementsByClassName('hamburger')[0].classList.remove('is-active');
			}
			else {
				document.getElementsByClassName('hamburger')[1].classList.remove('is-active');
			}
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
