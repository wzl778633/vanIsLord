import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import routerObj from './router'
import store from './store'
import axios from "axios";


import ElementUI from 'element-ui';
import { Notification } from 'element-ui';
import '../theme/index.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

import 'overlayscrollbars/css/OverlayScrollbars.css';
import 'overlayscrollbars/css/os-theme-thick-light.css';
import { OverlayScrollbarsPlugin } from 'overlayscrollbars-vue';
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import 'video.js/dist/video-js.css'
import animate from 'animate.css'
import VueCompositionApi from "@vue/composition-api";

Vue.use(VueCompositionApi);
Vue.use(animate);
Vue.use(contentmenu);
Vue.use(ElementUI);
Vue.use(OverlayScrollbarsPlugin);
axios.defaults.baseURL = "/api";
//axios.defaults.headers.common['token'] = localStorage.loginToken;

axios.interceptors.request.use(function(config){
    if(localStorage.loginToken){
        config.headers.token= localStorage.loginToken
    }
    return config
})

axios.interceptors.response.use(res => {return res;},error => {
      if (error.response.status) {
        switch (error.response.status) {
          case 401:
            localStorage.removeItem('loginToken');
            routerObj.replace({
              path: '/',
              query: {redirect: routerObj.currentRoute.fullPath}
            })
            Notification.error(
                {
                  title: '不好意思，我不认识你这个MOTHERFUCKER',
                  type: 'error',
                  message: `请先登录！`,
                  position: 'bottom-right',
                  customClass: "message",
                });
            break;
        };
        return Promise.reject(error.response);
      }
    }
);

    Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router : routerObj,
  store,

  render: h => h(App)
}).$mount('#app')
