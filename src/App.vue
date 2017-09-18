<template>
  <div id="app">
    <new-event></new-event>
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
body {
	background-color: #ccc !important;
}

body, html {
	margin: 0;
	padding: 0;

	width: 100%;
	height: 100%;
}
</style>
