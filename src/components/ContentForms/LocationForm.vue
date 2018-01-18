<template>
  	<div id="location_form">
	  	<form v-on:submit.prevent >
			<div class="form-content">
				<md-layout md-gutter>
					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Name of the location</label>
							<md-input v-model="data.name" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Adress</h2>
					</md-layout>

					<!-- <md-layout md-flex="30" md-flex-small="100">
						<md-input-container>
							<label>Street name + number</label>
							<md-input v-model="newLocation.street" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="30" md-flex-small="100">
						<md-input-container>
							<label>Zip code</label>
							<md-input v-model="newLocation.zipCode" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="30" md-flex-small="100">
						<md-input-container>
							<label>City</label>
							<md-input v-model="newLocation.city" required></md-input>
						</md-input-container>
					</md-layout> -->

					<md-layout md-flex="100" >
						<md-input-container>
							<label>Street Name + Number, Zip-code + City</label>
							<md-input v-model="data.address" required></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="100">
						<h2>Additional information</h2>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Website</label>
							<md-input v-model="data.website"></md-input>
						</md-input-container>
					</md-layout>

					<md-layout md-flex="50" md-flex-small="100">
						<md-input-container>
							<label>Facebook page</label>
							<md-input v-model="data.facebook_page_url"></md-input>
						</md-input-container>
					</md-layout>
				</md-layout>
			</div>
		</form>
  	</div>
</template>

<script>
export default {
	name: 'location-form',
	props: {
		data: Object
	}
}
</script>

<style lang="scss">
	@import "src/scss/ContentForms/_locationForm.scss";
</style>
