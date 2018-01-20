<template>
	<div id="app">
		<top-bar>
		</top-bar>
		<sidenav></sidenav>
		<div class="router-view-container">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import Sidenav from '@/Components/Sidenav';
import TopBar from '@/Components/TopBar';

export default {
	components: {
		Sidenav,
		TopBar
	}
}
</script>

<style lang="scss">
	@import "src/scss/main.scss";
</style>
