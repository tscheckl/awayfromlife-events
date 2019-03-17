<template>
	<div id="image_step">
		<md-layout>
			<h2>Image</h2>
		</md-layout>

		<md-layout md-flex="100">
			<md-input-container>
				<label>Select Image</label>
				<md-file ref="imageInput" v-model="imageName" v-on:selected="uploadFile" accept="image/*"></md-file>
			</md-input-container>
			
			<div v-if="value != null" v-on:click="resetInput"  class="clear-image-icon">
				<md-icon>clear<md-tooltip>clear image</md-tooltip></md-icon>
			</div>
			<span><md-icon>error_outline</md-icon>	Maximum file size: 5MB</span>
		</md-layout>

		<div class="image-preview-wrapper" v-if="value != null">
			<h3>Preview: </h3>
			<img ref="imagePreview" :src="value" :alt="value">
		</div>
	</div>
</template>

<script>
export default {
	name: 'image-step',
	props: {
		value: undefined
	},
	data() {
		return {
			imageName: ''
		}
	},
	methods: {
		uploadFile(file) {
			this.$emit('input', file[0]);
			const reader = new FileReader();
			reader.onload = e => this.$refs.imagePreview.src = e.target.result;
			reader.readAsDataURL(file[0]);
		},
		resetInput() {
			this.imageName = '';
			this.$emit('input', null);
			this.$refs.imageInput.resetFile();
		}
	},
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_imageStep.scss";
</style>
