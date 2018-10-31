<template>
	<div id="detail_page">
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
					<md-button class="md-icon-button edit-button" v-on:click="$refs['reportDialog'].open()">
						<md-icon>report</md-icon>
						<md-tooltip md-direction="bottom">report event</md-tooltip>
					</md-button>

					<slot name="additonal-edit-buttons"></slot>
				</div>
			</div>
		</div>

		<div class="content">
			<div class="content-header">
				<slot name="title"></slot>
			</div>

			<div class="content-body">
				<slot></slot>
			</div>
			
			<div class="loading" v-show="loading">
				<div class="darken"></div>
				<md-spinner md-indeterminate class="md-accent"></md-spinner>
			</div>
		</div>

		<div class="color-block"></div>

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
import { backendUrl } from '@/secrets.js';

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
		id: String
	},
	data() {
		return {
			isAuthenticated: false
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
					this.$router.go(-1);
				})
				.catch(err => {
					this.submitStatus = err.body.message;
					this.$refs.snackbar.open();
				})
		},
	},
	mounted() {
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => this.isAuthenticated = false);
			
		document.getElementById('topbar').classList.add('single-page');
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_generalPage.scss";
</style>
