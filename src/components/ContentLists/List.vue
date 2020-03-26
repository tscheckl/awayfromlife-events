<template>
	<div id="new_list">
		<div class="page-content">
			<div class="color-block"></div>
		
			<div class="list-header">
				<h1>{{contentType}}s</h1>

				<router-link to="new-event" class="create-new">
					<div class="left-container">
						<h3>Create a new {{contentType}}!</h3>
						<p>And contribute to AWAY FROM LIFE Streets</p>
					</div>
					<div class="right-container">
						<md-icon>arrow_forward</md-icon>
					</div>
				</router-link>

				<div class="filters">					
					<button v-if="isMobile"  class="md-button close-filters-btn" v-on:click="closeMobileFiltersMenu"><md-icon>close</md-icon></button>
					
					<h3>Filter by: </h3>
					<slot name="filters"></slot>				

					<button class="md-button md-raised mobile-apply-button" v-on:click="applyMobileFilters">Apply</button>
				</div>
				
				<div class="sorting">
					<h4>Sort by: </h4>
					<loading-skeleton-element v-if="dataMounting" width="160px" height="30px"></loading-skeleton-element>
					<selector
						v-else
						v-model="computedCurrentlySorted"
						label="pretty"
						:options="sortingOptions">
					</selector>
				</div>

				<div class="mobile-list-header">
					<div class="mobile-menu-buttons">
						<button class="md-raised mobile-filter-button" v-on:click="openMobileFiltersMenu">Filter <md-icon>keyboard_arrow_down</md-icon></button>
						<selector
							class="mobile-sorting-button"
							fixedLabel
							selectLabel="Sort by"
							label="pretty"
							v-model="computedCurrentlySorted"
							:options="sortingOptions">
						</selector>
					</div>

					<div class="applied-filter-chips" v-if="isMobile">
						<chip v-for="(appliedFilter, key) in appliedFilters" :key="key" v-on:remove="$emit('filterCleared', key)">
							{{prettierFilterLabel(key).key}}:
							<span class="bold">{{prettierFilterLabel(key).value}}</span>
						</chip>
					</div>
				</div>
			</div>

			
			<div class="initial-loading-message" v-if="dataMounting || completelyReloading">
				<div class="dummy-elements list-elements">
					<loading-skeleton-element  v-for="(item, index) in 10" :key="index" class="dummy-element dummy-list-element" height="120px">
						<loading-skeleton-element class="dummy-image" height="100%" width="140px"></loading-skeleton-element>
						<loading-skeleton-element class="dummy-information">
							<loading-skeleton-element class="dummy-title" width="60%" height="25px"></loading-skeleton-element>
							<loading-skeleton-element class="dummy-description" height="15px"></loading-skeleton-element>
							<loading-skeleton-element class="dummy-additional" height="15px"></loading-skeleton-element>
						</loading-skeleton-element>
					</loading-skeleton-element>
				</div>
				<md-spinner md-indeterminate></md-spinner>
			</div>
			<div class="list-body" v-if="!dataMounting && !completelyReloading">
				<div v-if="previousLoadable || loadingPrevious" class="load-more load-less">
					<md-button  v-if="!loadingPrevious" v-on:click="getPreviousElements">Show previous</md-button>
					<md-spinner v-else md-indeterminate></md-spinner>
				</div>
				
				<div class="list-elements">
					<slot name="list-elements"></slot>

					<div v-if="data.length == 0" class="no-data">
						<h3>:(</h3>
						<h3>No {{contentType}}s found...</h3>
					</div>
				</div>

				<div class="load-more">
					<p>Showing {{data.length}} of {{totalItemsCount}} available {{contentType}}</p>
					<div v-if="data.length < totalItemsCount && !loadingNext">
						<md-button v-on:click="$emit('loadMore')">Show more</md-button>
						<p>or <a pre href="" v-on:click.prevent="scrollToTop">narrow down the results</a></p>
					</div>				
					<md-spinner v-if="loadingNext" md-indeterminate></md-spinner>
				</div>
			</div>

			<div class="not-found-message">
				<p>Didn't find what you were looking for?</p>
				<p>If you feel like something is missing, you can contribute to this platform and <router-link to="">create a new {{contentType}}!</router-link></p>
			</div>
		</div>
	</div>
</template>

<script>
import {backendUrl} from '@/secrets.js';

import moment from 'moment';

import StartingLetterFilter from './StartingLetterFilter';
import SearchSelect from '@/components/Utilities/SearchSelect';
import Selector from '@/components/Utilities/Selector';
import LoadingSkeletonElement from '@/components/Utilities/LoadingSkeletonElement';
import Chip from '@/components/Utilities/Chip';

export default {
	name: 'new-list',
	components: {
		StartingLetterFilter,
		SearchSelect,
		Selector,
		LoadingSkeletonElement,
		Chip
	},
	props: {
		contentType: String,
		data: Array,
		page: Number,
		sortingOptions: Array,
		currentlySorted: Object,
		completelyReloading: Boolean,
		dataMounting: Boolean,
		totalItemsCount: Number,
		loadingNext: Boolean,
		loadingPrevious: Boolean,
		previousLoadable: Boolean,
		appliedFilters: Array,
		prettierKey: Function
	},
	data() {
		return {
			previousPageLoadedTo: 0,
			isMobile: false
		}
	},
	computed: {
		computedCurrentlySorted: {
			get: function() {
				return Object.assign({}, this.currentlySorted);
			},
			set: function(newValue) {
				this.$emit('sortingChanged', newValue);
			}
		},
		prettySortingOptions() {
			return this.sortingOptions.map(sortingOption => sortingOption.pretty);
		}
	},
	watch: {
		appliedFilters: {
			handler: function() {
				this.buildUrl();
			},
			deep: true
		}
	},
	methods: {
		scrollToTop() {
			window.scrollTo({top: 0, behavior: 'smooth'});
		},
		openMobileFiltersMenu() {
			document.getElementsByClassName('filters')[0].classList.add('opened');
		},
		closeMobileFiltersMenu() {			
			document.getElementsByClassName('filters')[0].classList.remove('opened');
		},
		async applyMobileFilters() {
			this.closeMobileFiltersMenu();
			this.$emit('applyMobileFilters');
		},
		prettierFilterLabel(key) {
			let prettierKey = this.prettierKey(key);
			

			let prettierValue = this.actuallyAppliedFilters[key];
			if(this.actuallyAppliedFilters[key].label)
				prettierValue = this.actuallyAppliedFilters[key].label;

			return {
				key: prettierKey,
				value: prettierValue
			};
		},
		applyQuerySorting(sortBy, direction) {
			this.currentlySorted = this.sortingOptions.find(sortingOption => sortingOption.name == sortBy && sortingOption.direction == parseInt(direction));
		}
	},
	async mounted() {
		if(window.innerWidth <= 768)
			this.isMobile = true;
	},
}
</script>

<style lang="scss">
	@import "./src/scss/ContentLists/_newList.scss";
</style>