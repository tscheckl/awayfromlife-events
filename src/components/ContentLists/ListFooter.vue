<template>
	<div id="list_footer">
		<div class="pages">
			<span class="page-btn" v-on:click="currentPage > 1 ? changeCurrentPage(currentPage-1): ''"><md-icon>keyboard_arrow_left</md-icon></span>
			<span v-for="number in smallerPages()" :key="number" v-on:click="changeCurrentPage(number)">{{number}}</span>
			<span class="current-page">{{currentPage}}</span>
			<span v-for="number in biggerPages()" :key="number" v-on:click="changeCurrentPage(number)">{{number}}</span>
			<span class="page-btn" v-on:click="(currentPage < availablePages)? changeCurrentPage(currentPage+1): ''"><md-icon>keyboard_arrow_right</md-icon></span>
		</div>

		<selector
			v-model="itemsPerPage"
			selectLabel="Items per Page"
			:options="[5,10,20,50]">
		</selector>
	</div>
</template>

<script>
import Selector from '@/components/Utilities/Selector';
export default {
	name: 'list-footer',
	components: {
		Selector
	},
	props: {
		availablePages: {
			type: Number,
			default: 1
		},
	},
	data() {
		return {
			currentPage: 1,
			itemsPerPage: 20,
		}
	},
	watch: {
		itemsPerPage() {
			this.$emit('itemsPerPageChange', this.itemsPerPage);
		},
		$route() {
			this.itemsPerPage = this.$route.query.itemsPerPage;
		}
	},
	methods: {
		smallerPages() {
			let smallerPages = [];
			let counter = 0;
			for(let i = 1; i < this.currentPage; i++) {
				smallerPages[counter] = i;
				counter++;
			}
			if(smallerPages.length > 3) {
				return smallerPages.slice(smallerPages.length-3);
			}
			else {
				return smallerPages;
			}
		},
		biggerPages() {
			let biggerPages = [];
			let counter = 0;
			for(let i = this.currentPage; i < this.availablePages; i++) {
				biggerPages[counter] = i+1;
				counter++;
			}

			return biggerPages.slice(0,3);
		},
		changeCurrentPage(page) {
			this.currentPage = page;
			this.$emit('pageChange', page);
			let newQuery = {...this.$route.query, page: this.currentPage};
			this.$router.push({query: newQuery});
		},
	},
	mounted() {
		if(this.$route.query.itemsPerPage)
			this.itemsPerPage = this.$route.query.itemsPerPage;
	},
}
</script>

<style>

</style>
