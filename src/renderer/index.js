import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element';
import './plugins/tailwind/tailwind.less';
import '../../server/app';

Vue.config.productionTip = false;

new Vue({
  router,
  render : (h) => h(App),
}).$mount('#app');
