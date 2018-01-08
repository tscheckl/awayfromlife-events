<template>
  <div id="location_selection_list_item">
	  <span>{{item.name}}</span> - <span>{{item.address}}</span>
  </div>
</template>

<script>
export default {
	props: {
		item: {required: true}
	}
}
</script>

<style>

</style>
