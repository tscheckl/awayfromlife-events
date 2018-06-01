<template>
	<div id="topbar" v-if="$route.path != '/search' && $route.path != '/login' && $route.path != '/admin' && $route.path !='/'">
		<md-toolbar>
			<follow-buttons></follow-buttons>

			<md-button class="md-icon-button back-button" v-on:click="$router.go(-1)" v-if="isSinglePage()">
				<md-icon>keyboard_backspace</md-icon>
				<md-tooltip md-direction="bottom">Go Back</md-tooltip>	
			</md-button>

			<div class="search">
				<md-icon>search</md-icon>
				<input placeholder="Search..." v-on:keyup="search" v-model="query"/>
				<button>Search</button>
			</div>
		</md-toolbar>
	</div>
</template>

<script>
import FollowButtons from '@/Components/FollowButtons';
import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'top-bar',
	components: {
		FollowButtons
	},
	data() {
		return {
			results: '',
			query: '',
			timeOut: undefined
		}
	},
	methods: {
		search() {
			clearTimeout(this.timeOut);

			if(this.query.length > 3) {
				this.timeOut = setTimeout(() => {
					this.$http.get(backendUrl + '/api/search/' + this.query)
					.then(response => {
						console.log(response.body.data);
						
					})
					.catch(err => {});			
				},1000);
			}
		},
		isSinglePage() {
			if(this.$route.path.indexOf('/event/') != -1 || this.$route.path.indexOf('/location/') != -1 || this.$route.path.indexOf('/band/') != -1)
				return true;
			else
				return false;
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_topbar.scss";
</style>
