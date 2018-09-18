<template>
	<div id="stepper">
		<div class="steps-header">
			<span class="steps-header-number" v-for="step in steps" :key="step">
				<span v-on:click="changeStep(step)" :class="currentStep == step ?'active' :''">{{step}}</span>
				<hr v-if="step != steps">
				<!-- <span v-if="step != steps"> ------- </span> -->
			</span>
		</div>

		<div class="stepper-body">
			<slot name="headline"></slot>

			<div class="steps">
				<div v-for="step in steps" :key="step">
					<transition :name="stepTransisition">
							<div class="step" v-if="step == currentStep">
								<slot :name="'step-' + step"></slot>
							</div>
					</transition>
				</div>
			</div>
			

			<button class="md-button md-raised next-btn" v-if="currentStep < steps" v-on:click="changeStep(currentStep+1)">Next</button>
			<button class="md-button md-raised next-btn" v-if="currentStep == steps" v-on:click="$emit('submit')">Finish</button>
			<button class="md-button" v-if="currentStep > 1" v-on:click="changeStep(currentStep-1)">Back</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'stepper',
	props: {
		steps: Number
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

			this.currentStep = step;
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_stepper.scss";
</style>
