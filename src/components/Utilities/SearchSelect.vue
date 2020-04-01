<template>
	<div id="search_select" v-on:keyup.esc="showOptions = false">
		<input type="text" autocomplete="aaa" v-model="filterValue"  v-on:focus="showOptions = true" v-on:blur="blockBlur ?'' :closeOptions()" :placeholder="placeholder">
		<div class="select-buttons">
			<button class="clear-button" v-on:click="clearValue" v-if="filterValue != ''">
				<md-icon>close</md-icon>
			</button>
			<md-icon class="select-indicator">{{showOptions ?'keyboard_arrow_up' :'keyboard_arrow_down'}}</md-icon>
		</div>

		<div class="select-overlay">
			<ul v-if="showOptions">
				<li v-for="(option, index) in filteredOptions" 
					:key="index" 
					v-on:mouseover="blockBlur = true" 
					v-on:mouseleave="blockBlur = false"  
					v-on:click="selectOption(option)">
					{{option[computedLabel]}}
				</li>
			</ul>

			<div class="no-options" v-if="options && filteredOptions.length == 0">
				<slot name="no-options"></slot>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'search-select',
	props: {
		value: [Object, String],
		options: {
			type: Array,
			default: () => []
		},
		placeholder: String,
		label: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			showOptions: false,
			filterValue: '',
			blockBlur: false
		}
	},
	watch: {
		value() {
			try {
				this.filterValue = this.value[this.computedLabel];
			}
			catch(exc) {
				this.filterValue = '';
			}
		}
	},
	computed: {
		filteredOptions() {
			return this.options.filter(option => {
				if(option[this.computedLabel])
					return option[this.computedLabel].toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1;
				else {
					try {
						return option.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1;
					}
					catch(exc) {
						return option;
					}
				}
					
			});
			
		},
		computedLabel() {			
			return this.label ?this.label :'label';
		},
	},
	methods: {
		selectOption(option) {
			this.filterValue = option[this.computedLabel].trim();
			this.closeOptions();
			this.$emit('input', option);
			this.$emit('change', option);
		},
		clearValue() {
			this.filterValue='';
			this.$emit('input', undefined);
			this.$emit('change', undefined);
		},
		closeOptions() {
			this.showOptions = false;
			this.blockBlur = false;
		}
	},
	mounted() {
		if(this.value)
			this.filterValue = this.value[this.computedLabel];
	},
}
</script>

<style lang="scss">
	@import "src/scss/Utilities/_searchSelect.scss";
</style>
