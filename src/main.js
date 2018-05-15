// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import App from './App'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Datetime from 'vue-datetime'
import VueRouter from 'vue-router'
import router from './routerConfig'
import Calendar from 'vuejs-datepicker';
import vSelect from 'vue-select';
import {frontEndSecret, backendUrl} from '@/secrets.js';
import store from '@/store/index.js';

Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.use(VueResource);
Vue.use(Datetime);

Vue.component('calendar', Calendar);
Vue.component('v-select', vSelect)


Vue.material.registerTheme('default', {
	primary: 'grey',
	accent: 'red',
	warn: 'red',
	background: 'white'
  });
Vue.material.setCurrentTheme('default');

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  render: h => h(App), 
  store: store
});

Vue.http.interceptors.push((request, next) => {
	Vue.http.headers.common['Authorization'] = localStorage.aflAuthToken? 'JWT ' + localStorage.aflAuthToken : '';
	
	next(response => {
		if(!!response.body.token) {
			localStorage.setItem('aflAuthToken', response.body.token);
			Vue.http.headers.common['Authorization'] = 'JWT ' + localStorage.aflAuthToken;
		}
		else {			
			localStorage.removeItem('aflAuthToken');
			Vue.http.headers.common['Authorization'] = '';
		}
	});
});

let routerStack = [window.location.hash.substr(1)];

router.beforeEach((to, from, next) => {
	
	if(to.fullPath == routerStack[routerStack.length-2]) {
		store.commit('setAnimation', 'slide-out');
		routerStack.pop();
	}
	else {
		store.commit('setAnimation', 'slide-in');
		routerStack.push(to.fullPath);
	}
	
	window.scrollTo(0, 0);

	if(to.path == "/admin") {
		Vue.http.get(backendUrl + '/api/users/auth')
		.then((response) => {
			next();
		})
		.catch((err) => {
			next('/login');
		})
	}
	else {
		next();
	}
});