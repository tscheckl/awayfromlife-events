<template>
	<div id="finished_step">
		<div class="content">
			<md-icon class="check-icon">check</md-icon>
			<div class="force-wrap"></div>
			<div class="text-content">
				<h1>{{contentType}} successfully added!</h1>
				<div class="controls">
					<button class="md-button" v-on:click="$emit('back')"><md-icon>keyboard_arrow_left</md-icon> See all {{contentType}}s</button>
					<button class="md-button" v-on:click="$emit('redo')">Create another {{contentType}} <md-icon>keyboard_arrow_right</md-icon></button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'finished-step',
	props: {
		contentType: String
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_finishedStep.scss";
</style>
