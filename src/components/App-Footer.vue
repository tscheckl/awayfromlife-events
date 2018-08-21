<template>
	<div id="app-footer">
		<router-link to="/bug-report">Feedback</router-link>
		<a href="https://www.awayfromlife.com/info/impressum/">Imprint</a>
		<a href="https://www.awayfromlife.com/info/datenschutz/">Privacy</a>
		<a href="https://www.awayfromlife.com/info/kontakt/">Contact</a>
		<div class="icon-info">Sidebar icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
	</div>
</template>

<script>
export default {
	name: 'app-footer',
}
</script>

<style lang="scss">
	@import "src/scss/_footer.scss";
</style>
