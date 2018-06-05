<template>
	<div id="events_archive">
		<events-list :archive="true"></events-list>
	</div>
</template>

<script>
import EventsList from './EventsList';

export default {
	name: 'events-archive',
	components: {
		EventsList
	}
}
</script>

<style>

</style>
