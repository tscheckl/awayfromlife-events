// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Datepicker from 'vue-datepicker/vue-datepicker-es6.vue'
import VueFire from 'vuefire'
import Firebase from 'firebase'
import VueRouter from 'vue-router'
import router from './routerConfig'


Vue.use(VueRouter);
Vue.use(VueMaterial, VueFire);
Vue.component('datepicker', Datepicker);


Vue.material.registerTheme('default', {
	primary: 'red',
	accent: 'grey',
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
