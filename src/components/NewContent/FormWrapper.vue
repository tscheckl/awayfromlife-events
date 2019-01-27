<template>
	<div id="form_wrapper">
		<div class="color-block"></div>
		<div class="content">
			<new-event v-if="formType == 'new-event'" class="content-form"></new-event>
			<new-location v-if="formType == 'new-location'" class="content-form"></new-location>
			<new-band v-if="formType == 'new-band'" class="content-form"></new-band>
			<new-festival v-if="formType == 'new-festival'" class="content-form"></new-festival>
		</div>
	</div>
</template>

<script>
import NewEvent from './NewEvent';
import NewLocation from './NewLocation';
import NewBand from './NewBand';
import NewFestival from './NewFestival';
export default {
	name: 'form-wrapper',
	components: {
		NewEvent,
		NewLocation,
		NewBand,
		NewFestival
	},
	props: {
		formType: String
	},
	mounted() {
		document.getElementById('topbar').classList.add('single-page');
	},
}
</script>

<style lang="scss">
	@import "src/scss/NewContent/_formWrapper.scss";
</style>
