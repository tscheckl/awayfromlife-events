<template>
	<div id="result_category" :class="'result-' + title" v-if="content">
		<h2>{{title.charAt(0).toUpperCase() + title.substring(1)}} Results: </h2>

		<div class="result" v-for="index in resultLimiter" :key="index-1" v-on:click="showResult(content[index-1])">
			<div class="result-content">
				<h3>{{content[index-1].data.name}}</h3>
				<p>{{showSpecialAttrib(content[index-1].data)}}</p>

				<p>Result found in {{content[index-1].match.pretty}}: 
					{{content[index-1].match.value.beforeMatch}}
					<span class="result-match">{{content[index-1].match.value.match}}</span>
					{{content[index-1].match.value.afterMatch}}
				</p>
			</div>
			<md-icon class="learn-more-icon">keyboard_arrow_right</md-icon>
		</div>
		
		<p class="more-results-btn" v-if="resultLimiter!=content.length" @click="toggleResults(true)">Show more Results<md-icon>keyboard_arrow_down</md-icon></p>
		<p class="more-results-btn" v-if="resultLimiter==content.length && content.length > 3" @click="toggleResults(false)">Show less Results<md-icon>keyboard_arrow_up</md-icon></p>
	</div>
</template>

<script>
import moment from 'moment';

export default {
	name: 'result-category',
	props: {
		content: Array,
		attribToBeDisplayed: String,
		title: String
	},
	watch: {
		content: {
			immediate: true,
			handler() {
				this.resultLimiter = this.content.length > 3
					? 3
					: this.content.length;
			}
				
		}
	},
	data() {
		return {
			resultLimiter: 3
		}
	},
	methods: {
		showResult(result) {
			this.$store.commit(('setCurrent' + result.category), result.data);
			// console.log(result.category.toString().toLowerCase());
			// return;
			let resultCat = String(result.category);
			console.log(typeof resultCat);
			let pushRoute = `/${resultCat.slice()}/${result.data.url}`;
			this.$router.push({path: pushRoute});
		},
		showSpecialAttrib(object) {
			return this.attribToBeDisplayed.split('.').reduce((prev, curr) => {
				return prev[curr];
			}, object);
		},
		createMatchStrings(result) {			
			//Get Index of the result-match-value string at which the entered query starts.
			let resultMatchValueIndex = result.match.value.toLowerCase().indexOf(this.$route.query.query.toLowerCase());

			//Split the result-match-value string into 3 parts: before the exact match, the exact match, after the exact match.
			let resultMatchValue = result.match.value;
			result.match.value = {
				beforeMatch: resultMatchValue.substring(0, resultMatchValueIndex),
				match: resultMatchValue.substring(resultMatchValueIndex, (resultMatchValueIndex + this.$route.query.query.length)),
				afterMatch: resultMatchValue.substring((resultMatchValueIndex + this.$route.query.query.length), resultMatchValue.length)
			};
		},
		toggleResults(expand) {
			let categoryElement = document.getElementsByClassName('result-' + this.title)[0];
			if(expand) {
				this.$emit('expanded');
				categoryElement.classList.remove('column-category');
				categoryElement.classList.add('expanded-category');
				
				this.resultLimiter = this.content.length;
			}
			else {
				categoryElement.classList.remove('expanded-category');
				categoryElement.classList.add('column-category');

				this.resultLimiter = this.content.length >= 3 
					? 3
					: this.content.length;
			}

			document.getElementsByClassName('result-' + this.title)[0].scrollIntoView({ 
				behavior: 'smooth',
				block: 'start',
				inline: 'start' 
			});
		},
	},
	mounted() {
		this.content.forEach(result => {
			this.createMatchStrings(result);
		
			if(result.data.date)
				result.data.date = moment(result.data.date).format('LL');
		});
	}
}
</script>

<style lang="scss">
	@import "src/scss/Search/_resultCategory.scss";
</style>
