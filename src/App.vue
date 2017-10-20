<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import Eventmap from './components/Eventmap'
import NewEvent from './components/NewEvent'
import Firebase from 'firebase'

export default {
  components: {
    Eventmap,
    NewEvent
  }
}
</script>

<style lang="scss">
	@import "src/scss/main.scss";
</style>
