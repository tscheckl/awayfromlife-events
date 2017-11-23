<template>
	<div id="login">
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
			}, 'currentFrontendSecret', (err, token) => {
				this.$http.post('http://localhost:3000/api/users/login', {token: token})
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
