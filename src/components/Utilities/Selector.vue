<template>
	<div id="selector">
		<label v-if="selectLabel && !fixedLabel" for="selector-input">{{selectLabel}}</label>
		<div id="selector-input" v-on:click="showList = !showList">
			<span>{{placeholderString}}</span>
			<md-icon>keyboard_arrow_down</md-icon>
		</div>

		<ul class="options" v-if="showList">
			<li :class="item == currentlySelected ?'active' :''" v-on:click="selectItem(emitIndex ?(index+1) :item)" v-for="(item, index) in options" :key="index">{{item[label] ?item[label] :item}}</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'selector',
	props: {
		value: undefined,
		options: Array,
		label: {
			type: String,
			default: 'name'
		},
		emitIndex: {
			type: Boolean,
			default: false
		},
		selectLabel: {
			type: String,
			default: ''
		},
		fixedLabel: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		options() {
			this.updateSelection();
		},
		value() {
			this.updateSelection();
		}
	},
	computed: {
		placeholderString() {
			if(this.fixedLabel)
				return this.selectLabel;
			
			return this.currentlySelected[this.label] ?this.currentlySelected[this.label] :this.currentlySelected;
		}
	},
	data() {
		return {
			currentlySelected: '',
			showList: false
		}
	},
	methods: {
		selectItem(data) {
			this.currentlySelected = this.emitIndex 
				? this.options[data-1]
				: (data[this.label]
					? data[this.label]
					: data
				);
			
			this.$emit('input', data);
		},
		updateSelection() {					
			if(this.emitIndex)
				this.currentlySelected = this.options[this.value-1];
			else 
				this.currentlySelected = this.value;			
		},
		toggleList() {
			this.showList = !this.showList;
		}
	},
	mounted() {
		this.updateSelection();

		if(this.displayDirection !== 'top') {			
			document.getElementById('selector').classList.add(this.displayDirection);
		}

		document.addEventListener('click', (e) => {
			const exceptTarget = document.getElementById('input-wrapper');
			if(e.target !== exceptTarget) {
				this.showList = false;
			}
		}, true);
	},
}
</script>

<style lang="scss">
	@import "src/scss/Utilities/_selector.scss";
</style>
