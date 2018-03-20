<template>
	<div id="app">
		<!-- <top-bar>
		</top-bar> -->
		<sidenav></sidenav>
		<div class="router-view-container">
			<router-view></router-view>
			<app-footer></app-footer>
		</div>
	</div>
</template>

<script>
import Sidenav from '@/Components/Sidenav';
import TopBar from '@/Components/TopBar';
import AppFooter from '@/Components/App-Footer';

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
