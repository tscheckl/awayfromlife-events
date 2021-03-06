<template>
	<div id="topbar" :class="topbarClasses" v-if="showTopbar()">
		<md-toolbar>
			<router-link class="logo-link" to="/"><img src="/static/Logo.png" alt="Away From Life Streets Logo"></router-link>
			<follow-buttons></follow-buttons>

			<md-button class="md-icon-button back-button" v-on:click="$router.go(-1)" v-if="isLowerLevelPage()">
				<md-icon>keyboard_backspace</md-icon>
				<md-tooltip md-direction="bottom">Go Back</md-tooltip>	
			</md-button>

			<div class="search topbar-search">
				<md-icon>search</md-icon>
				<input placeholder="Search..." v-on:keyup="search" v-on:keyup.enter="search(false)" v-model="query"/>
				<button v-on:click="search(false)">Search</button>

				<div class="results" v-if="searched && !loading && results.length > 0">
					<router-link :to="'/' + result.category.toLowerCase() + '/' + result.data.url" class="result" v-for="(result, index) in results" :key="index">
						<div class="result-information">
							<h4>{{result.data.name}}</h4>
							<p>Result found in: {{result.match.pretty}}</p>
						</div>
						<p>{{result.category}}</p>
					</router-link>
					<router-link :to="'/search?query=' + this.query + '&locations=true&events=true&bands=true'">
						<div class="more-results">
							Show all results <md-icon>keyboard_arrow_right</md-icon>
						</div>
					</router-link>
				</div>

				<div class="no-results" v-if="searched && !loading && results.length == 0">
					<p>no results found..</p>
				</div>

				<div class="loading" v-if="loading">
					<md-spinner md-indeterminate class="md-accent"></md-spinner>
				</div>
			</div>
		</md-toolbar>
	</div>
</template>

<script>
import FollowButtons from '@/components/FollowButtons';
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
			timeOut: undefined,
			loading: false,
			searched: false,
		}
	},
	computed: {		
		topbarClasses() {
			let classString = '';

			if(this.isLowerLevelPage()) {				
				classString += ' single-page';
			}

			if(this.isListPage()) {				
				classString += ' list-page';
			}

			return classString
		}
	},
	watch: {
		$route() {
			this.hideResults();
			this.query = '';
		}
	},
	methods: {
		search(setTimer = true) {
			clearTimeout(this.timeOut);

			this.timeOut = setTimeout(() => {
				this.loading = true;
				this.searched = true;
				
				this.$http.get(backendUrl + '/api/search/simple/' + this.query)
				.then(response => {					
					this.results = response.body.data;
					this.loading = false;
				})
				.catch(err => console.log(err));			
			}, setTimer ?700 :0);
		},
		isLowerLevelPage() {
			const singlePages = ['event', 'location', 'band', 'festival'];
			const infoPages = ['faq', 'imprint', 'privacy']
			
			const isSinglePage = singlePages.reduce((acc, curr) => {
				let lowercasePath = this.$route.path.slice().toLowerCase();				
				return (lowercasePath.indexOf(`/${curr}/`) != -1 || lowercasePath.indexOf(`/new-${curr}`) != -1) || acc;
			}, false);

			return isSinglePage;
		},
		isListPage() {
			const listPages = ['events', 'archived-events', 'locations', 'bands', 'festivals'];

			const isListPage = listPages.reduce((acc, curr) => {
				let lowercasePath = this.$route.path.slice().toLowerCase();
						
				return (this.$route.path == ('/' + curr)) || acc;
			}, false);
			
			return isListPage;
		},
		showTopbar() {
			return this.$route.path != '/search' 
				&& this.$route.path != '/login' 
				&& this.$route.path != '/admin' 
				&& this.$route.path !='/';
		},
		hideResults() {
			this.searched = false;
		}
	},
	mounted() {
		let context = this;
		window.addEventListener('click', function(e){  
			
			if (document.getElementsByClassName('topbar-search')[0] && !document.getElementsByClassName('topbar-search')[0].contains(e.target)){
				context.hideResults();
			} else{
				// Clicked outside the box
			}
		});
	}
}
</script>

<style lang="scss">
	@import "src/scss/GeneralLayout/_topbar.scss";
</style>
