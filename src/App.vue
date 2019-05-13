<template>
	<div id="app">
		<sidenav></sidenav>
		<div class="router-view-container">
			<transition :name="$store.getters.animation">
				<top-bar></top-bar>
			</transition>
			<transition :name="$store.getters.animation">
				<router-view class="router-view"></router-view>
			</transition>
		</div>
		<cookie-notification v-if="showCookieNotification" v-on:accept="updateCookieSettings(true)" v-on:decline="updateCookieSettings(false)"></cookie-notification>
		<app-footer></app-footer>
	</div>
</template>

<script>
import Sidenav from '@/components/GeneralLayout/Sidenav';
import TopBar from '@/components/GeneralLayout/TopBar';
import AppFooter from '@/components/GeneralLayout/App-Footer';
import CookieNotification from '@/components/Utilities/CookieNotification';

export default {
	components: {
		Sidenav,
		TopBar,
		AppFooter,
		CookieNotification
	},
	data() {
		return {
			showCookieNotification: true
		}
	},
	methods: {
		updateCookieSettings(allowCookies) {
			this.showCookieNotification = false;
			if(!allowCookies)
				this.$ga.disable(); 

			document.cookie = 'allowCookies=' + allowCookies;
		},
		setRandomBackgroundImage() {
			let imageNumber = Math.floor(Math.random() * 5 + 1);
			this.$store.commit('setSearchBackgroundImage', `url("/static/background-images/${imageNumber}.JPG")`);
		}
	},
	mounted() {
		if(document.cookie.indexOf('allowCookies') != -1 && document.cookie.split('allowCookies=')[1].split(';')[0] != 'false') {
			this.showCookieNotification = false;

			if(document.cookie.split('allowCookies=')[1].split(';')[0] == 'false')
				this.$ga.disable();
		}		

		this.setRandomBackgroundImage();
	}
}
</script>

<style lang="scss">
	@import "src/scss/main.scss";
</style>
