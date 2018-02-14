<template>
	<div id="login">
		<div class="login-card">
			<h2>LOGIN</h2>
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

				<md-button type="submit" v-on:click="handleLogin" class="md-raised md-accent">Login</md-button>
				<md-spinner v-if="loading" md-indeterminate></md-spinner>
			</form>
		</div>
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

			let token = jwt.sign({
				email: this.login.email,
				password: this.login.pwd
			}, frontEndSecret, (err, token) => {
				this.$http.post(backendUrl + '/api/users/login', {token: token})
				.then((response) => {
					this.token = response.body.token;
					sessionStorage.setItem("aflAuthToken", this.token);
					this.$router.push('/admin');
				})
				.catch((err) => {
					console.log(err);
					this.error = true;
					if(err.status == 401) {
						this.errorMsg = "Invalid email or password!";
					}
					else {
						this.errorMsg = "An error occurred. Please try again!";
					}
					this.loading = false;
				})
			});
		}
	}
}
</script>

<style lang="scss">
	@import "src/scss/Admin/_login.scss";
</style>
