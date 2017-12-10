<template>
  <div id="change_password_form">
	  <h2>Passwort Ändern</h2>
	  <form v-on:submit.prevent>
		  <md-input-container>
			  <label>Altes Passwort eingeben</label>
			  <md-input type="password" v-model="oldPassword"></md-input>
		  </md-input-container>

		  <md-input-container>
			  <label>Neues Passwort eingeben</label>
			  <md-input type="password"  v-model="newPassword"></md-input>
		  </md-input-container>

		  <md-input-container>
			  <label>Neues Passwort bestätigen</label>
			  <md-input type="password"  v-model="newPasswordConfirm"></md-input>
		  </md-input-container>

		  <md-button type="submit" class="md-raised md-accent" v-on:click="changePwd">Passwort ändern</md-button>
	  </form>
  </div>
</template>

<script>
import jwt from 'jsonwebtoken';
import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'change-password-form',
	data() {
		return {
			oldPassword: '',
			newPassword: '',
			newPasswordConfirm: ''
		}
	},
	methods: {
		changePwd() {
			if(this.newPassword == this.newPasswordConfirm) {
				let pwdToken = jwt.sign({
					oldPassword: this.oldPassword,
					newPassword: this.newPassword
				}, frontEndSecret, (err, token) => {
					this.$http.post(backendUrl + '/api/users/reset-password', {token: token}, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
						.then(response => {
							console.log("Passwort erfolgreich geändert.");
							console.log(response);
						})
						.catch(err => {
							console.log(err);
						})
				})
			}
			else {
				console.log("passwörter stimmen nicht überein.");
			}
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_changePasswordForm.scss";
</style>
