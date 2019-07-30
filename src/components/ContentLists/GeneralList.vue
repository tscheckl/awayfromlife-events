<template>
	<div id="general_list">		
		<div class="list-header">
			<div class="header-line">
				<div class="left-container">
					<h1>{{title}}</h1>
				</div>

				<router-link :to="'new-' + trimmedContentType">
					<md-button class="md-raised create-content-btn"><md-icon>add</md-icon>Create new {{trimmedContentType}}</md-button>
				</router-link>
			</div>

			<h3 class="show-filters-button" v-on:click="toggleFilters">
				<md-icon>filter_list</md-icon> 
				<span>Filter Results</span> 
				<md-icon>keyboard_arrow_right</md-icon>
			</h3>
			<div class="filters">
				<h3 class="filters-header">Filters</h3>
				<slot name="filters"></slot>
			</div>
		</div>
		
		<div class="color-block"></div>

		<div class="all-items">

			<md-spinner v-if="loading" md-indeterminate class="md-accent"></md-spinner>

			<div class="list-content" v-if="!loading">
				<h3 class="no-items-title" v-if="data.length == 0">No {{contentType}} found..</h3>

				<div class="list-item-header" v-if="data.length > 0">
					<p 
						v-for="(columnAttribute, index) in displayedColumns" 
						:key="index" 
						:class="`${contentType}-${columnAttribute.displayName}`"
						v-on:click="sortBy(columnAttribute.attributes[0])">
						<span>
							{{columnAttribute.displayName}}
							<md-icon v-if="columnAttribute.currentlySorted">{{!sortAscending? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
						</span>
					</p>
					<md-icon class="hidden-icon"></md-icon>
				</div>

				<div v-for="(element, index) in data" :key="index" v-on:click="showBand(band)">
					<router-link :to="`/${trimmedContentType}/${element.url}`" class="list-item">
						<p 
							v-for="(columnAttribute, index) in displayedColumns" :key="index"
							:class="`${contentType}-${columnAttribute.displayName}`">
							<span v-if="columnAttribute.isArray">
								<span 
								v-for="(item, index) in element[columnAttribute.attributes[0]]" :key="index" 
								:class="`${contentType}-${columnAttribute.attributes[0]}`">
									{{item}}
								</span>
							</span>							
							<span 
								v-else
								v-for="(displayAttribute, index) in columnAttribute.attributes" :key="index">
								{{element[displayAttribute]}}
							</span>
						</p>
						<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
					</router-link>
				</div>
			</div>

			<list-footer 
				class="list-footer"
				v-on:pageChange="changeCurrentPage"
				v-on:itemsPerPageChange="changeItemsPerPage">
			</list-footer>
		</div>
	</div>
</template>

<script>
import ListFooter from './ListFooter';

export default {
	name: 'general-list',
	components: {
		ListFooter,
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		contentType: {
			type: String,
			default: ''
		},
		displayedColumns: {
			type: Array,
			default: []
		},
		filterableAttributes: {
			type: Array,
			default: () => {
				return [];
			}
		},
		data: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			loading: false,
			sortingAsc: {},
			currentlySorted: '',
			currentPage: 0,
			itemsPerPage: 20
		}
	},
	computed: {
		trimmedContentType() {
			return this.contentType.substring(0, this.contentType.length - 1);
		}
	},
	methods: {
		toggleFilters() {
			document.getElementsByClassName('show-filters-button')[0].classList.toggle('opened');
			document.getElementsByClassName('filters')[0].classList.toggle('show-filters');
		},
		buildUrl() {
			// let query = {
			// 	page: this.currentPage, 
			// 	itemsPerPage: this.itemsPerPage, 
			// 	sortBy: this.currentlySorted, 
			// 	ascending: this.sortingAsc[this.currentlySorted],
			// 	startWith: this.appliedFilters.startWith,
			// 	genre: this.appliedFilters.genre,
			// 	label: this.appliedFilters.label,
			// 	city: this.filterByCity ?this.appliedFilters.city :undefined,
			// 	country: !this.filterByCity ?this.appliedFilters.country :undefined
			// };
			// if(query != this.$route.query)
			// 	this.$router.push({query: query});
		},
		changeCurrentPage(page) {
			this.currentPage = page;
			this.buildUrl();
		},
		changeItemsPerPage(value) {
			let newQuery = {...this.$route.query, itemsPerPage: value};
			this.$router.push({query: newQuery});
		}
	},
	created() {
		console.log('data', this.data);
		if(this.$router.currentRoute.query.page) {
			this.currentPage = this.$router.currentRoute.query.page;
		}

		if(this.$route.query.sortBy && this.$route.query.ascending) {
			this.currentlySorted = this.$route.query.sortBy;
			this.sortingAsc[this.$route.query.sortBy] = (this.$route.query.ascending == 'true');
		}
		else {
			this.sortingAsc.name = true;
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentLists/_generalList.scss";
</style>
