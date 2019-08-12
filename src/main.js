import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import adapter from 'webrtc-adapter';
import store from './store/'
import 'buefy/dist/buefy.css'
import router from './router'

Vue.use(adapter)
Vue.use(Buefy)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
