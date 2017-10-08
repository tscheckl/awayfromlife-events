<template>
	<div id="event_calendar">
		<h1 v-on:click="handle">Hallo</h1>
	   	<vue-event-calendar :events="demoEvents" v-on:day-changed="handleDayChanged"></vue-event-calendar>
  	</div>
</template>

<script>
export default {
	name: 'event-calendar',
	data() {
		return {
			demoEvents: [{
				date: '2017/10/26',
				title: 'Foo',
				desc: 'longlonglong description'
			},{
				date: '2016/11/12',
				title: 'Bar'
			}],
		}
	},
	methods: {
		handle() {
			this.$EventCalendar.toDate('2016/11/01');
			this.$EventCalendar.nextMonth();
		},
		handleDayChanged(date) {
			console.log(date);
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_eventCalendarOld.scss";
</style>
