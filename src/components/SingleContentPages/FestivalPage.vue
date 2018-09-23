<template>
	<div id="festival_page">
		<div class="page-header">

			<div class="left-container">

				<div class="edit-buttons">
					<md-button class="md-icon-button edit-button" v-on:click="openDialog('newFestivalDialog')">
						<md-icon>edit</md-icon>
						<md-tooltip md-direction="bottom">edit festival</md-tooltip>	
					</md-button>
					<md-button class="md-icon-button edit-button" v-if="isAuthenticated" v-on:click="openDialog('confirmDeletionDialog')">
						<md-icon>delete</md-icon>
						<md-tooltip md-direction="bottom">delete festival</md-tooltip>
					</md-button>
					<md-button class="md-icon-button edit-button" v-on:click="openDialog('reportDialog')">
						<md-icon>report</md-icon>
						<md-tooltip md-direction="bottom">report festival</md-tooltip>
					</md-button>
				</div>
			</div>

		</div>

		<div class="content" v-if="festival._id">

			<div class="title">
				<h2>{{festival.title?festival.title.toUpperCase(): ''}}</h2>
			</div>

			<div class="content-body">
				<div v-if="festival.address" class="festival-location">
					<h3><md-icon>location_on</md-icon><span>Address</span></h3>
					<p>{{festival.address.street}}</p>
					<p>{{festival.address.postcode}} {{festival.address.city}}</p>
					<p v-if="festival.address.county">{{festival.address.county}}</p>
					<p>{{festival.address.country}}</p>
				</div>

				<hr>

				<!-- <h3><md-icon>queue_music</md-icon><span>Lineup</span></h3>
				<ul>
					<li v-for="band of festival.bands" :key="band._id"><router-link :to="`/band/${band.url}`"><span>{{band.name}}</span></router-link></li>
				</ul> -->
				
				<hr>

				<div v-if="festival.ticketLink" class="ticket-link">
					<h3><md-icon>receipt</md-icon>Ticket Link</h3>
					<a :href="festival.ticketLink" target="_blank">{{festival.ticketLink}}</a>
					<hr>
				</div>

				<div v-if="festival.description">
					<h3><md-icon>format_quote</md-icon><span>Description</span></h3>
					<p>{{festival.description}}</p>
				</div>
			</div>
		</div>

		<div class="color-block"></div>

		<md-snackbar md-position="bottom right" ref="snackbar">
			<span >{{this.submitStatus}}</span>
			<md-button class="md-accent" v-on:click="$refs.snackbar.close()">OK</md-button>
		</md-snackbar>

		<md-dialog ref="reportDialog">
			<report-dialog :id="festival._id" contentType="festival" v-on:close="message => handleDialogClose(message, 'reportDialog')"></report-dialog>
		</md-dialog>

		<md-dialog ref="cancelDialog">
			<div class="cancel-dialog">
				<h2>Do you really want to report this festival as cancelled?</h2>
				<md-icon class="yes-icon">check</md-icon>
				<md-icon class="no-icon">clear</md-icon>
				<md-button class="yes" v-on:click="reportCancel(true)">Yes</md-button>
				<md-button class="no" v-on:click="reportCancel(false)">No</md-button>
			</div>
		</md-dialog>

		<md-dialog ref="confirmDeletionDialog">
			<confirm-dialog v-on:confirm="deleteEvent" v-on:close="$refs.confirmDeletionDialog.close()">
				<h3 slot="headline">Do you really want to delete this festival?</h3>
			</confirm-dialog>
		</md-dialog>
	</div>
</template>

<script>
import ConfirmDialog from '@/Components/ConfirmDialog';
import ReportDialog from '@/components/SingleContentPages/ReportDialog';
import NotFound from '@/components/NotFound';

import {frontEndSecret, backendUrl } from '@/secrets.js';
import moment from 'moment';
export default {
	name: 'festival-page',
	components: {
		ConfirmDialog,
		ReportDialog,
		NotFound
	},
	computed: {
		festival() {
			return Object.assign({},this.$store.getters.currentFestival);
		}
	},
	data() {
		return {
			isAuthenticated: false,
			submitStatus: '',

		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		deleteEvent() {
			this.$refs.confirmDeletionDialog.close();
			
			this.$http.delete(backendUrl + `/api/festivals/` + this.festival._id)
				.then(response => {
					this.$router.go(-1);
				})
				.catch(err => {
					this.submitStatus = 'Error while deleting the festival. Please try again!';
					this.$refs.snackbar.open();
				})
		},
		handleEditClose() {
			this.$refs['editFestivalDialog'].close();
			
			this.$http.get(backendUrl + `/api/festivals/byurl/` + this.$route.params.url)
			.then(response => {
				if(response.body.data) {
					this.submitStatus = 'Event successfully updated!';
					this.$refs.snackbar.open();
					this.$store.commit('setCurrentFestival', response.body.data);
				}
			})
			.catch(err => {
				console.log(err);
			});
		},
		handleDialogClose(message, dialogRef) {
			this.$refs[dialogRef].close();
			this.submitStatus = message;
			this.$refs.snackbar.open();
		},
	},
	mounted() {
		if(this.$route.path.indexOf('festival') != -1)
			document.getElementById('topbar').classList.add('single-page');
		
		
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => {});
			
		if(this.$store.getters.currentFestival.title == '' || this.$store.getters.currentFestival.url != this.$route.params.url) {
			
			this.$http.get(backendUrl + `/api/festival/byurl/` + this.$route.params.url)
			.then(response => {
				if(response.body.data) {
					this.$store.commit('setCurrentFestival', response.body.data);
				}
			})
			.catch(err => this.$router.push('/not-found'));
		}
		
			
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_festivalPage.scss";
</style>
