<template>
	<div id="app-footer">
		<router-link to="/faq">FAQ</router-link>
		<router-link to="/bug-report">Feedback</router-link>
		<router-link to="/imprint">Imprint</router-link>
		<router-link to="/privacy">Privacy</router-link>
		<a href="https://www.awayfromlife.com/info/kontakt/">Contact</a>
		<div class="icon-info">Sidebar icons made by <a href="http://www.freepik.com" target="_blank" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
	</div>
</template>

<script>
export default {
	name: 'app-footer',
}
</script>

<style lang="scss">
	@import "src/scss/GeneralLayout/_footer.scss";
</style>
