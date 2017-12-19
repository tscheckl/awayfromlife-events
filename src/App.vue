<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import NewEvent from './components/NewEvent'

export default {
  components: {
    NewEvent
  }
}
</script>

<style lang="scss">
	@import "src/scss/main.scss";
</style>
