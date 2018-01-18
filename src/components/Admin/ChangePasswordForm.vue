<template>
  <div id="change_password_form">
		<h2>Change Password</h2>
		<form v-on:submit.prevent>
			<md-input-container>
				<label>Enter old password</label>
				<md-input type="password" v-model="oldPassword"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Enter new password</label>
				<md-input type="password"  v-model="newPassword"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Confirm new password</label>
				<md-input type="password"  v-model="newPasswordConfirm"></md-input>
			</md-input-container>

			<md-button type="submit" class="md-raised md-accent" v-on:click="changePwd">Change password</md-button>
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
								this.snackbarMsg = 'An Error occurred while changing your password. Please try again.';
								this.$refs.snackbar.open();
								this.loading = false;
							})
					});
				}
				else {
					this.snackbarMsg = 'The new password must be at least 8 characters long';
					this.$refs.snackbar.open();
				}
			}
			else {
				this.snackbarMsg = "The newly entered passwords don't match!";
				this.$refs.snackbar.open();
			}

			this.loading = false;
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/Admin/_changePasswordForm.scss";
</style>
