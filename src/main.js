// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import App from './App'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import VueRouter from 'vue-router'
import router from './routerConfig'
import Calendar from 'vuejs-datepicker';
import vSelect from 'vue-select';
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/styles.css'
import VueAnalytics from 'vue-analytics';
import {frontEndSecret, backendUrl} from '@/secrets.js';
import store from '@/store/index.js';

Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.use(VueResource);
Vue.use(AirbnbStyleDatepicker);
Vue.use(Datetime);

Vue.use(VueAnalytics, {
	id: ['UA-124600417-2', 'UA-124410591-1'],
	router,
	autoTracking: {
		pageviewTemplate (route) {
			let title;		

			if(route.params.url) {
				title = route.params.url
					.substr(0, (route.params.url.indexOf('--') != -1 ?route.params.url.indexOf('--') :route.params.url.length))
					.replace(/-/g, ' ')
					.split(' ')
					.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
					.join(' ');
				
				title += ` (${route.meta.category})`;
			}
			else title = route.meta.title;			
			
		  	return {
				page: title,
				title: title,
				location: window.location.href
		  	}
		}
	}
})

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
	if(to.path !== from.path)
		window.scrollTo(0, 0);
	
	if(to.fullPath == routerStack[routerStack.length-2]) {
		store.commit('setAnimation', 'slide-out');
		routerStack.pop();
	}
	else {
		store.commit('setAnimation', 'slide-in');
		routerStack.push(to.fullPath);
	}

	if (!to.matched.length) {
		next('/not-found');
	} else {		
		document.title = to.meta.title + ' | AWAY FROM LIFE STREETS';
		console.log(to);
		const singlePages = ['event', 'location', 'band', 'festival'];
		const goToSinglePage = singlePages.reduce((acc, curr) => {
			return (to.path.indexOf(`/${curr}/`) != -1 || to.path.indexOf(`/new-${curr}/`) != -1) && acc;
		}, true);
		//Check if a 'Single-Page' is opened and give top-bar extra class to change color.
		if(goToSinglePage) {
			
			document.getElementById('topbar').classList.add('single-page');
		}
		else {
			document.getElementById('topbar') ?document.getElementById('topbar').classList.remove('single-page') :'';
		}

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
	}
});