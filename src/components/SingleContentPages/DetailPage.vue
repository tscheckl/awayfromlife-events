<template>
	<div id="detail_page" v-on:keyup.esc="showImage(false)" tabindex="0">
		<div class="page-wrapper">
			<div class="page-header">
				<div class="left-container">
					<div class="edit-buttons">
						<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="$emit('edit')">
							<md-icon>edit</md-icon>
							<md-tooltip md-direction="bottom">edit band</md-tooltip>	
						</md-button>
						
						<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="$refs['confirmDeletionDialog'].open()">
							<md-icon>delete</md-icon>
							<md-tooltip md-direction="bottom">delete band</md-tooltip>
						</md-button>
						
						<slot name="additonal-edit-buttons"></slot>

						<md-button class="md-icon-button edit-button" v-on:click="$refs['reportDialog'].open()">
							<md-icon>report</md-icon>
							<md-tooltip md-direction="bottom">report event</md-tooltip>
						</md-button>
					</div>
				</div>
			</div>

			<div class="content">
				<div class="content-information">
					<slot name="important-information"></slot>
				
					<div class="content-header">
						<slot name="title"></slot>
					</div>

					<div class="content-body">
						<slot></slot>
					</div>
				</div>
				<div class="image-container" v-on:click="showImage(true)">
					<div v-show="fullImageUrl" class="image" :style="'background-image: url(' + fullImageUrl +');'"></div>
					<div v-show="!fullImageUrl" class="image-loading-indicator">
						<md-spinner md-indeterminate></md-spinner>
					</div>
					<div class="image-color-block"></div>
				</div>
				
				<div class="loading" v-show="loading">
					<div class="darken"></div>
					<md-spinner md-indeterminate class="md-accent"></md-spinner>
				</div>
			</div>

		</div>
		<div class="color-block"></div>

		<div class="lightbox">
			<div class="darken" v-on:click="showImage(false)"></div>
			<div class="image-container">
				<img v-on:click="showImage(true)" :src="fullImageUrl" alt="">
				<p v-if="imageSource.text != '' || imageSource.url != ''" class="image-source">
					Image source: 
					<a v-if="imageSource.url != ''" :href="imageSource.url">{{imageSource.text != '' ?imageSource.text :imageSource.url}}</a>
					<p v-else>{{imageSource.text}}</p>
				</p>
			</div>
			<button class="close-btn" v-on:click="showImage(false)"><md-icon>close</md-icon></button>
		</div>
		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>

		<md-dialog ref="reportDialog">
			<report-dialog :id="id" :contentType="contentType" v-on:close="message => handleDialogClose(message, 'reportDialog')"></report-dialog>
		</md-dialog>

		<md-dialog ref="confirmDeletionDialog">
			<confirm-dialog v-on:confirm="deletePage" v-on:close="$refs.confirmDeletionDialog.close()">
				<h3 slot="headline">Do you really want to delete this {{contentType}}?</h3>
			</confirm-dialog>
		</md-dialog>

		<slot name="edit-dialogs"></slot>
	</div>
</template>

<script>
import { backendUrl, imageUrl } from '@/secrets.js';

import ConfirmDialog from '@/components/Utilities/ConfirmDialog';
import ReportDialog from '@/components/SingleContentPages/ReportDialog';

export default {
	name: 'detail-page',
	components: {
		ConfirmDialog,
		ReportDialog
	},
	props: {
		loading: {
			type: Boolean,
			default: false
		},
		contentType: String,
		submitStatus: String,
		id: String,
		image: String,
		imageSource: Object
	},
	computed: {
		computedImageUrl() {
			if(this.image && this.image.length > 0)
				return imageUrl + '/' + this.image;
			
			return null;
		}
	},
	watch: {
		computedImageUrl() {
			// document.getElementsByClassName('image')[0].style.backgroundImage = `url(${this.computedImageUrl})`;
		}
	},
	data() {
		return {
			isAuthenticated: false,
			fullImageUrl: ''
		}
	},
	methods: {
		handleDialogClose(message, dialogRef) {
			this.$refs[dialogRef].close();
			this.submitStatus = message;
			this.$refs.snackbar.open();
		},
		deletePage() {
			this.$refs.confirmDeletionDialog.close();

			this.$http.delete(`${backendUrl}/api/${this.contentType}s/${this.id}`)
				.then(response => {
					this.$router.push(`/${this.contentType}s`);
				})
				.catch(err => {
					this.submitStatus = err.body.message;
					this.$refs.snackbar.open();
				})
		},
		updateImageUrl(data) {
			console.log("FISCH", data);
			this.fullImageUrl = `${imageUrl}/${data.image[2]}`;
		},
		escapeUrl(url) {
			return escape(url);
		},
		showImage(openLightBox) {
			if(openLightBox) {
				window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

				document.getElementsByClassName('lightbox')[0].style.display = 'block';
				setTimeout(() => {
					document.getElementsByClassName('lightbox')[0].style.opacity = '1';
				}, 100);
				document.body.style.overflow = 'hidden';
			}
			else  {
				document.getElementsByClassName('lightbox')[0].style.opacity = '0';
				setTimeout(() => {
					document.getElementsByClassName('lightbox')[0].style.display = 'none';
				document.body.style.overflow = 'auto';
				}, 100);
			}
		}
	},
	updated() {
		const numberOfTabHeaders = document.getElementsByClassName('md-tab-header').length;
		if(numberOfTabHeaders > 2) {
			document.getElementsByClassName('tab-navigation')[0].classList.add('tab-navigation-small');
		}
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => this.isAuthenticated = false);
		
		// document.getElementsByClassName('image')[0].style.backgroundImage = `url(${this.computedImageUrl})`;
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_generalPage.scss";
</style>
