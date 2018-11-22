<template>
	<div id="cookie_notification">
		<h1>
			We care about your data, and we'd love to use cookies to make your experience the best possible. 
			<a target="_blank" href="https://www.awayfromlife.com/info/datenschutz/">Learn more</a>
		</h1>
		<md-button v-on:click="$emit('accept')">Okay!</md-button>
		<md-button v-on:click="$emit('decline')">No, thanks :(</md-button>
	</div>
</template>

<script>
export default {
	name: 'cookie-notification',
}
</script>

<style lang="scss">
	@import "src/scss/Utilities/_cookieNotification.scss";
</style>
