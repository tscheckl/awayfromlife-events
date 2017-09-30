<template>
  <div id="event_calendar">
	   <vue-event-calendar :events="demoEvents" v-on:day-changed="handleDayChanged"></vue-event-calendar>
  </div>
</template>

<script>
export default {
	name: 'event-calendar',
	data() {
		return {
			demoEvents: [{
				date: '2016/12/15',
				title: 'Foo',
				desc: 'longlonglong description'
			},{
				date: '2016/11/12',
				title: 'Bar'
			}]
		}
	},
	methods: {
		handleDayChanged(date) {
			console.log(date);
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_eventCalendar.scss";
</style>
