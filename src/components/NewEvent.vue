<template>
  	<div id="new_event">
		<h1>Neues Event anlegen</h1>
		
		<div class="form-content">
			<md-layout md-gutter>
				<md-layout md-flex="50">
					<md-input-container>
						<label>Title</label>
						<md-input v-model="title"></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<md-input-container>
						<label>Description</label>
						<md-textarea v-model="description"></md-textarea>
					</md-input-container>
				</md-layout>
			</md-layout>

			<md-button class="md-raised md-accent">Absenden</md-button>
		</div>
  	</div>
</template>

<script>
export default {
    name: 'new-event',
	data() {
		return {
			title: '',
			description: ''
		}
	}
}
</script>

<style scoped lang="scss">

#new_event {
	width: 50%;
	margin: 0 auto;
	margin-top: 50px;
	padding: 40px;
	background-color: white;
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

	.form-content {
		margin-top: 50px;
	}

	.md-input-container {
		box-sizing: border-box;
		margin-left: 15px;
	}

	textarea {
		height: 135px !important;
	}
}
</style>
