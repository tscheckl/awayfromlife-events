<template>
	<div id="events_archive">
		<new-events-list :archive="true"></new-events-list>
	</div>
</template>

<script>
import NewEventsList from './NewEventsList';

export default {
	name: 'events-archive',
	components: {
		NewEventsList
	},
}
</script>

<style>

</style>
