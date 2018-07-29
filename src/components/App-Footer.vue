<template>
	<div id="app-footer">
		<router-link to="/bug-report">Feedback</router-link>
		<a href="https://www.awayfromlife.com/info/impressum/">Imprint</a>
		<a href="https://www.awayfromlife.com/info/datenschutz/">Privacy</a>
		<a href="https://www.awayfromlife.com/info/kontakt/">Contact</a>
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
