<template>
	<div id="sidenav">
		<div class="expand-container">
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

				<div v-on:click="expanded ?showSubMenu(showEventsSubMenu) :''" 
					 v-on:mouseover="!expanded ?showSubMenu(true) :''" 
					 v-on:mouseleave="!expanded ?showSubMenu(false) :''">
					<router-link :to="!expanded ?'/events?page=1&itemsPerPage=20&sortBy=startDate&ascending=true' :''">
						<div class="menu-item">
							<md-icon>date_range</md-icon>
							<span >Events <md-icon>{{showEventsSubMenu ?'keyboard_arrow_up' :'keyboard_arrow_down'}}</md-icon></span>
						</div>
					</router-link>

					<div class="sub-items events-sub-menu">
						<md-icon class="indicator">arrow_left</md-icon>
						<router-link to="/events?page=1&itemsPerPage=20&sortBy=startDate&ascending=true">
							<div class="sub-item" v-on:click="removeExpandedClass">
								<md-icon>date_range</md-icon>
								<span>Upcoming Events</span>
							</div>
						</router-link>
						
						<router-link to="/archived-events?page=1&itemsPerPage=20&sortBy=startDate&ascending=true">
							<div class="sub-item" v-on:click="removeExpandedClass">
								<md-icon>archive</md-icon>
								<span>Events Archive</span>
							</div>
						</router-link>

						<router-link to="/calendar">
							<div class="sub-item" v-on:click="removeExpandedClass">
								<md-icon>event</md-icon>
								<span>Event Calendar</span>
							</div>
						</router-link>
					</div>
				</div>

				<router-link to="/locations?page=1&itemsPerPage=20&sortBy=name&ascending=true">
					<div class="menu-item" v-on:click="removeExpandedClass">
						<md-icon>location_on</md-icon>
						<span>Locations</span>
					</div>
				</router-link>

				<router-link to="/bands?page=1&itemsPerPage=20&sortBy=name&ascending=true">
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
	</div>
</template>

<script>
export default {
	name: 'sidenav',
	data() {
		return {
			expanded:false,
			showEventsSubMenu: false
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
			document.getElementsByClassName('expand-container')[0].classList.add('expanded');
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
			this.showEventsSubMenu = false;
			document.getElementsByClassName('expand-container')[0].classList.remove('expanded');
			if(window.matchMedia('(max-width: 768px)').matches) {
				document.getElementsByTagName('body')[0].classList.remove('unscrollable');
				document.getElementsByClassName('hamburger')[0].classList.remove('is-active');
			}
			else {
				document.getElementsByClassName('hamburger')[1].classList.remove('is-active');
			}
		},
		showSubMenu(show) {
			if(this.expanded) {
				this.showEventsSubMenu = !this.showEventsSubMenu;
				if(this.showEventsSubMenu)
					document.getElementsByClassName('events-sub-menu')[0].classList.add('show');
				else 
					document.getElementsByClassName('events-sub-menu')[0].classList.remove('show');
			}
			else {
				if(show)
					document.getElementsByClassName('events-sub-menu')[0].classList.add('show');
				else 
					document.getElementsByClassName('events-sub-menu')[0].classList.remove('show');
			}
		},
		isAuthenticated() {
			Vue.http.get(backendUrl + '/api/users/auth')
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
