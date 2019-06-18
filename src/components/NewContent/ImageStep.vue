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
			
			<div v-if="imageName != ''" v-on:click="resetInput"  class="clear-image-icon">
				<md-icon>clear<md-tooltip>clear image</md-tooltip></md-icon>
			</div>
			<span><md-icon>error_outline</md-icon>	Maximum file size: 2MB</span>
		</md-layout>

		<md-layout md-flex-small="100" md-flex="50" v-if="addImageSource">
			<md-input-container :class="computedImageSourceUrl && !isUrl(computedImageSourceUrl) ?'md-input-invalid' :''">
				<label>Source of the image (URL)</label>
				<md-input type="url" v-model="computedImageSourceUrl"></md-input>
				<span v-if="computedImageSourceUrl && !isUrl(computedImageSourceUrl)" class="md-error">Not a valid url!</span>
			</md-input-container>
		</md-layout>

		<md-layout md-flex-small="100" md-flex="50" v-if="addImageSource">
			<md-input-container>
				<label>Image source description</label>
				<md-input v-model="computedImageSourceText"></md-input>
			</md-input-container>
		</md-layout>

		<div class="image-preview-wrapper" v-show="value != null">
			<h3>Preview: </h3>
			<img ref="imagePreview" :src="value" :alt="value">
		</div>
		<div class="not-image-warning upload-warning" v-show="notImageFile">
			<h3><md-icon>warning</md-icon> Uploaded file is not an image or the file type is not supported!</h3>
		</div>
		<div class="size-too-big-warning upload-warning" v-show="sizeTooBig">
			<h3><md-icon>warning</md-icon> Uploaded file is too big!</h3>
		</div>
	</div>
</template>

<script>
import { isUrl } from '@/helpers/validators.js';

export default {
	name: 'image-step',
	props: {
		value: undefined,
		imageSource: {
			type: Object,
			default: () => {
				return {
					text: '',
					url: ''
				}
			}
		},
		addImageSource: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			imageName: '',
			notImageFile: false,
			sizeTooBig: false,
		}
	},
	computed: {
		computedImageSourceText: {
			get() {				
				return this.imageSource.text; 
			},
			set(newValue) {
				this.$emit('sourceChange', {
					text: newValue,
					url: this.imageSource.url
				});
			}
		},
		computedImageSourceUrl: {
			get() {				
				return this.imageSource.url; 
			},
			set(newValue) {
				this.$emit('sourceChange', {
					text: this.imageSource.text,
					url: newValue
				});
			}
		}
	},
	watch: {
		value() {
			if(this.value && !this.value.type) {
				this.imageName = this.value;
				this.$refs.imagePreview.src = this.value;
			}
		},
	},
	methods: {
		uploadFile(file) {
			if(!this.isImage(file[0])) {
				this.notImageFile = true;
				this.$emit('input', null);
				return;
			}
			this.notImageFile = false;

			if(file[0].size > 2000000) {
				this.sizeTooBig = true;
				this.$emit('input', null);
				return;
			}
			this.sizeTooBig = false;
			
			this.$emit('input', file[0]);

			const reader = new FileReader();
			reader.onload = e => this.$refs.imagePreview.src = e.target.result;
			reader.readAsDataURL(file[0]);
		},
		resetInput() {
			this.imageName = '';
			this.$emit('input', null);
			this.sizeTooBig = false;
			this.notImageFile = false;
			this.$refs.imageInput.resetFile();
		},
		isImage(file) {
			return file != null && (file.type === "image/jpeg" || file.type === "image/png");
		},
		isUrl(url) {
			return isUrl(url);
		}
	},
	mounted() {
		if(this.value && !this.value.type) {
			this.imageName = this.value;
			this.$refs.imagePreview.src = this.value;
		}

		if(this.value && this.value.type != null)
			this.uploadFile(this.value);
	},
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_imageStep.scss";
</style>
