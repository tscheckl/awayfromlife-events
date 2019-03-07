<template>
	<div id="finished_step">
		<div class="content">
			<md-icon class="check-icon">check</md-icon>
			<div class="force-wrap"></div>
			<div class="text-content">
				<h1>{{contentType}} successfully added!</h1>
				<h3 v-if="!isUserAuthenticated()"><b>Note:</b> It will be visible for everyone after it was verified by us.</h3>
				<div class="controls">
					<button class="md-button" v-on:click="$emit('back')"><md-icon>keyboard_arrow_left</md-icon> See all {{contentType}}s</button>
					<button class="md-button" v-on:click="$emit('redo')">Create another {{contentType}} <md-icon>keyboard_arrow_right</md-icon></button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {backendUrl} from '@/secrets.js';

export default {
	name: 'finished-step',
	props: {
		contentType: String
	},
	methods: {
		isUserAuthenticated() {
			this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				return true;
			})
			.catch(err => { 
				return false
			});
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_finishedStep.scss";
</style>
