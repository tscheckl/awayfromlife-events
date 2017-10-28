<template>
	<div id="single_event">
	  	<h3 class="event-title">{{data.title}}</h3>
		<span class="event-date">{{data.startDate}}</span>
		<p class="event-description">{{data.description}}</p>
 	 </div>
</template>

<script>
export default {
	name: 'single-event',
	props: {
		data: Object
	}
}
</script>

<style lang="scss">
	@import "src/scss/_singleEvent";
</style>
