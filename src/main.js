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
import 'animate.css';
import VueCompositionApi from "@vue/composition-api";
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'
import {Base64} from 'js-base64'



import VueSocketIO from 'vue-socket.io'

 Vue.use(new VueSocketIO({
     debug: true,
     //connection: '192.168.1.143',
     connection: 'https://aijiangsb.com:9070',
     options:{
         autoConnect: false,
     }
 }));


Vue.use(ChatWindow);
Vue.use(Viewer);
Vue.use(VueCompositionApi);
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
        if (!axios.isCancel(error)) {
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
                }
                ;
                return Promise.reject(error.response);
            }
        }else{
            return Promise.resolve(error.message);
        }
    }
);

Vue.prototype.$http = axios;
Vue.prototype.$Base64 = Base64;
//Vue.prototype.$addr=  'http://192.168.1.143:9090';
//Vue.prototype.$addr= 'http://192.168.1.169:9090';
Vue.prototype.$addr= 'https://aijiangsb.com:9070/api';
Vue.config.productionTip = false

new Vue({
    sockets: {
        connecting() {
            console.log('正在连接')
        },
        disconnect(){
            console.log("断开链接");
        },
        connect_failed() {
            console.log('连接失败')
        },
        connect() {
            console.log("链接成功",this.$socket.id);
            this.$socket.emit('getUserId',this.$store.state.user_id,localStorage.loginToken);
        },
        reconnect(){
            console.log("重新链接");
            //this.$socket.emit('getUserId',this.$store.state.user_id,localStorage.loginToken);
        },
    },
  router : routerObj,
  store,

  render: h => h(App)
}).$mount('#app')
