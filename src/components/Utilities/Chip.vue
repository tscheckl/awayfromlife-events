<template>
	<div id="chip" v-on:click="$emit('remove')">
		<div>
			<slot></slot>
			<md-icon>close</md-icon>
		</div>
	</div>
</template>

<script>
export default {
	name: 'chip'
}
</script>

<style lang="scss">
	@import "src/scss/Utilities/_chip.scss";
</style>