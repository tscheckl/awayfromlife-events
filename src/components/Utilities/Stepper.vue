<template>
	<div id="stepper">
		<div class="steps-header" v-if="showHeader">
			<span class="steps-header-number" v-for="step in steps" :key="step">
				<span v-on:click="changeStep(step)" :class="currentStep == step ?'active' :''">{{step}}</span>
				<hr v-if="step != steps">
			</span>
		</div>

		<!-- <md-input-container class="selectable-steps" v-if="selectableSteps">
			<label>{{selectionLabel}}</label>
			<h1 v-for="(item, index) in selectableSteps" :key="index">{{item.name}}</h1>
			<md-select v-model="currentStep">
				<md-option v-for="(item, index) in selectOptions" :key="index" :value="index+1">{{item.name}}</md-option>
			</md-select>
		</md-input-container> -->
		<selector 
			class="selectable-steps" 
			v-if="selectableSteps"
			v-model="currentStep" 
			:options="selectOptions" 
			selectLabel="Select Year"
			emitIndex>
		</selector>

		<div class="stepper-body">
			<slot name="headline"></slot>

			<div class="steps">
				<slot></slot>
				<div v-for="step in steps" :key="step">
					<transition :name="stepTransisition">
							<div class="step" v-show="step == currentStep">
								<slot :name="'step-' + step"></slot>
							</div>
					</transition>
				</div>
			</div>
			

			<div class="finite-controls" v-if="!infinite">
				<button class="md-button md-raised next-btn" v-if="currentStep < steps" v-on:click="changeStep(currentStep+1)">Next</button>
				<button class="md-button md-raised next-btn" v-if="currentStep == steps" v-on:click="$emit('submit')">Finish</button>
				<button class="md-button" v-if="currentStep > 1" v-on:click="changeStep(currentStep-1)">Back</button>
			</div>

			<div class="infinite-controls" v-if="infinite">
				<button class="md-button md-icon-button" v-on:click="changeStep(currentStep-1)"><md-icon>keyboard_arrow_left</md-icon></button>
				<button class="md-button md-icon-button" v-on:click="changeStep(currentStep+1)"><md-icon>keyboard_arrow_right</md-icon></button>
			</div>
		</div>
	</div>
</template>

<script>
import Selector from '@/components/Utilities/Selector';

export default {
	name: 'stepper',
	components: {
		Selector
	},
	props: {
		steps: Number,
		infinite: {
			type: Boolean,
			default: false
		},
		showHeader: {
			type: Boolean,
			default: true
		},
		selectionLabel: String,
		selectableSteps: Array
	},
	watch: {
		steps() {
			this.currentStep = 1;
		},
		selectableSteps() {
			
		},
		currentStep() {
		}
	},
	computed: {
		selectOptions() {
			return this.selectableSteps;
		}
	},
	data() {
		return {
			currentStep: 1,
			stepTransisition: 'slide-in'
		}
	},
	methods: {
		changeStep(step) {
			if(this.currentStep < step)
				this.stepTransisition = 'slide-in';
			else 
				this.stepTransisition = 'slide-out';

			if(this.infinite) {
				if(step > this.steps)
					this.currentStep = 1;
				else if(step < 1)
					this.currentStep = this.steps;
				else
					this.currentStep = step; 
			}
			else
				this.currentStep = step;
		}
	},
	mounted() {
		this.currentStep = 1;
		// console.log(this.selectableSteps);
		
	},
}
</script>

<style lang="scss">
	@import "src/scss/Utilities/_stepper.scss";
</style>
