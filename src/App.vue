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
body {
	background-color: #111 !important;
	//Nicer ton #efadaa
}

body, html {
	margin: 0;
	padding: 0;

	width: 100%;
	height: 100%;
}

@media screen and (max-width: 768px){
	body {
		background-color: white !important;
	}
}
</style>
