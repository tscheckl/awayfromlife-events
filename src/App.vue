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
		<app-footer></app-footer>
	</div>
</template>

<script>
import Sidenav from '@/components/GeneralLayout/Sidenav';
import TopBar from '@/components/GeneralLayout/TopBar';
import AppFooter from '@/components/GeneralLayout/App-Footer';

export default {
	components: {
		Sidenav,
		TopBar,
		AppFooter
	}
}
</script>

<style lang="scss">
	@import "src/scss/main.scss";
</style>
