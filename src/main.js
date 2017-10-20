// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource';
import App from './App'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Datepicker from 'vue-datepicker/vue-datepicker-es6.vue'
import VueFire from 'vuefire'
import Firebase from 'firebase'
import VueRouter from 'vue-router'
import router from './routerConfig'
import 'vue-event-calendar/dist/style.css' //^1.1.10, CSS has been extracted as one file, so you can easily update it.
import vueEventCalendar from 'vue-event-calendar'
import Calendar from 'vuejs-datepicker';

Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.use(VueFire);
Vue.component('calendar', Calendar);
Vue.component('datepicker', Datepicker);
Vue.use(vueEventCalendar, {locale: 'en'});
Vue.use(VueResource);


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
})
