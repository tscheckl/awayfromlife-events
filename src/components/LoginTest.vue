<template>
  	<div id="login_test" style="background: #fff;">
		<form v-on:submit.prevent>
			<h2>Login</h2>
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
						<md-input v-model="login.pwd" required></md-input>
					</md-input-container>
				</md-layout>
			</md-layout>

			<md-button type="submit" v-on:click="handleLogin" class="md-raised md-accent">Send</md-button>
		</form>

		<form v-on:submit.prevent>
			<h2>Register</h2>
			<md-layout md-gutter>
				<md-layout md-flex="100">
					<md-input-container>
						<label>Email</label>
						<md-input v-model="register.email" required></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<md-input-container>
						<label>Name</label>
						<md-input v-model="register.name" required></md-input>
					</md-input-container>
				</md-layout>

				<md-layout md-flex="100">
					<md-input-container>
						<label>Password</label>
						<md-input v-model="register.pwd" required></md-input>
					</md-input-container>
				</md-layout>
			</md-layout>

			<md-button type="submit" v-on:click="handleRegister" class="md-raised md-accent">Send</md-button>
		</form>
		<br>
		<md-button v-on:click="handleAuth" class="md-raised md-accent">Authorize</md-button>
  </div>
</template>

<script>
import jwt from 'jsonwebtoken';
import {frontEndSecret, backendUrl} from '@/secrets.js';

export default {
	name: 'login-test',
	data() {
		return {
			login: {
				email: '',
				pwd: ''
			},
			register: {
				email: '',
				name: '',
				pwd: ''
			},
			token: ''
		}
	},
	methods: {
		handleLogin() {
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
				})
				.catch((err) => {
					console.log(err);
				})
			});
		},
		handleRegister() {
			var token = jwt.sign({
				email: this.register.email,
				name: this.register.name,
				password: this.register.pwd
			}, frontEndSecret, (err, token) => {
				console.log("token afterwards", token);
				this.$http.post(backendUrl + '/api/users/register', {token: token})
				.then((response) => {
					console.log(response);
				})
				.catch((err) => {
					console.log(err);
				});
			});
		},
		handleAuth() {
			console.log(this.token);
			this.$http.get(backendUrl + '/api/users/auth', {headers: {'Authorization': 'JWT ' + sessionStorage.aflAuthToken}})
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			})
		}
	}
 }
</script>

<style lang="scss">

</style>
