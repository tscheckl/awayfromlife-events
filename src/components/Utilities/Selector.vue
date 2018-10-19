<template>
	<div id="selector">
		<input id="selector-input" type="text" :value="currentlySelected" v-on:click="showList = !showList">
		<span class="input-indicator">⯆</span>
		<ul class="options" v-if="showList">
			<li v-on:click="updateSelection(item)" v-for="(item, index) in options" :key="index">{{item.name}}</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'selector',
	props: {
		options: Array
	},
	data() {
		return {
			currentlySelected: 'Select Year',
			showList: false
		}
	},
	methods: {
		updateSelection(data) {
			this.currentlySelected = data.name;
			this.$emit('input', data.name)
		}
	},
	mounted() {
		document.addEventListener('click', (e) => {
			const exceptTarget = document.getElementById('selector-input');
			if(e.target !== exceptTarget)
				this.showList = false;
		});
	}
}
</script>

<style lang="scss">
	@import "src/scss/Utilities/_selector.scss";
</style>
