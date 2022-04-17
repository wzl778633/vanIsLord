import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import routerObj from './router'
import store from './store'
import axios from "axios";


import ElementUI from 'element-ui';
import '../theme/index.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

import 'overlayscrollbars/css/OverlayScrollbars.css';
import 'overlayscrollbars/css/os-theme-thick-light.css';
import { OverlayScrollbarsPlugin } from 'overlayscrollbars-vue';
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import 'video.js/dist/video-js.css'
import animate from 'animate.css'



Vue.use(animate);
Vue.use(contentmenu);
Vue.use(OverlayScrollbarsPlugin);
axios.defaults.baseURL = "/api";
Vue.prototype.$http = axios;
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router : routerObj,
  store,

  render: h => h(App)
}).$mount('#app')
