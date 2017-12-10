<template>
	<div id="login" class="center-ver-hor">
		<h2>Login</h2>
		<form v-on:submit.prevent>
			<md-layout md-gutter>
				<md-layout md-flex="100">
					<md-input-container>
						<label>Email</label>
						<md-input v-model="login.email" required></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<md-input-container>
						<label>Password</label>
						<md-input v-model="login.pwd" type="password" required></md-input>
					</md-input-container>
				</md-layout>
			</md-layout>
			<p class="error-msg" v-if="error"><md-icon>warning</md-icon> {{errorMsg}}</p>

			<md-button type="submit" v-on:click="handleLogin" class="md-raised md-accent">Send</md-button>
			<md-spinner v-if="loading" md-indeterminate></md-spinner>
		</form>
	</div>
</template>

<script>
import jwt from 'jsonwebtoken';
import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'login',
	data() {
		return {
			login: {
				email: '',
				pwd: ''
			},
			error: false,
			errorMsg: '',
			loading: false
		}
	},
	methods: {
		handleLogin() {
			this.error = false;
			this.loading = true;
			console.log(backendUrl + " " + frontEndSecret);
			let token = jwt.sign({
				email: this.login.email,
				password: this.login.pwd
			}, frontEndSecret, (err, token) => {
				this.$http.post(backendUrl + '/api/users/login', {token: token})
				.then((response) => {
					console.log(response);
					this.token = response.body.token;
					sessionStorage.setItem("aflAuthToken", this.token);
					console.log(sessionStorage);
					this.$router.push('/admin');
				})
				.catch((err) => {
					this.error = true;
					this.errorMsg = "Email oder Passwort ungültig";
					this.loading = false;
				})
			});
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/_login.scss";
</style>
