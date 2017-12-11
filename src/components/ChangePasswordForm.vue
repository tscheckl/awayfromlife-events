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
			<md-spinner md-indeterminate v-if="loading" class="md-accent"></md-spinner>
		</form>

		<md-snackbar md-position="bottom center" ref="snackbar" :md-duration="4000">
			<span>{{snackbarMsg}}</span>
	  	</md-snackbar>
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
			newPasswordConfirm: '',
			snackbarMsg: '',
			loading: false
		}
	},
	methods: {
		changePwd() {
			this.loading = true;

			if(this.newPassword == this.newPasswordConfirm) {
				if(this.newPassword.length >= 8) {
					let pwdToken = jwt.sign({
						oldPassword: this.oldPassword,
						newPassword: this.newPassword
					}, frontEndSecret, (err, token) => {
						this.$http.post(backendUrl + '/api/users/reset-password', {token: token}, {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
							.then(response => {
								sessionStorage.setItem('aflAuthToken', response.body.token);

								this.snackbarMsg = 'Passwort erfolgreich geändert.';
								this.$refs.snackbar.open();
								
								this.loading = false;
								
								this.$emit('pwdChanged');
							})
							.catch(err => {
								console.log(err);
								this.snackbarMsg = 'Beim Ändern des Passworts ist ein Fehler aufgetreten, bitte versuche es erneut.';
								this.$refs.snackbar.open();
								this.loading = false;
							})
					});
				}
				else {
					this.snackbarMsg = 'Das neue Passwort muss mindestens 8 Zeichen lang sein!';
					this.$refs.snackbar.open();
				}
			}
			else {
				this.snackbarMsg = 'Die neu eingegebenen Passwörter stimmen nicht überein.';
				this.$refs.snackbar.open();
			}

			this.loading = false;
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_changePasswordForm.scss";
</style>
