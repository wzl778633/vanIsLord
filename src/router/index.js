import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/Gate.vue'
import MainPage from '../views/MainPage.vue'
import MainPart from '../views/MainPart.vue'
import ShowPart from '../views/ShowPart.vue'
import Error from '../views/ErrorPage.vue'
import UploadPage from '../views/UploadPage.vue'
import ChatRoom from "../views/ChatRoom";

import { Notification } from 'element-ui';
import PiazzaHomePage from "@/views/PiazzaHomePage";
import PiazzaPart from "@/views/PiazzaPart";

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage,
    meta: {
      isLogin: false
    }
  },
  {
    path: '/mainpage',
    name: 'MainPage',
    component: MainPage,
    children:[
      {path : 'disk/:path+', component: MainPart,},
      {path : 'upload', component: UploadPage,},
      {path : 'my_picture', component: ShowPart,},
      {path : 'my_video', component: ShowPart,},
      {path : 'my_favorite', component: ShowPart,},
      {path : 'my_share', component: ShowPart,},
      {path : 'my_music', component: ShowPart,},
      {path : 'piazza', component: PiazzaHomePage,},
      {path : 'shareAll/picture:union', component: ShowPart},
      {path : 'shareAll/video:union', component: ShowPart},
      {path : 'shareAll/music:union', component: ShowPart},
      {path : 'shareAll/:path+', component: PiazzaPart},
      {path : 'shareUser/:path/picture:union', component: ShowPart},
      {path : 'shareUser/:path/video:union', component: ShowPart},
      {path : 'shareUser/:path/music:union', component: ShowPart},
      {path : 'shareUser/:path+', component: PiazzaPart},
      {path : 'clipboard', component: ChatRoom,},
    ],
    meta: {
      isLogin: true
    },
  },
  {
    path: '*',
    name: 'Error',
    component: Error,
    meta: {
      isLogin: false
    }
  },
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to,from,next) =>{
  if(to.path.includes('/mainpage')){
    const token = localStorage.getItem('loginToken');
    if(token){
      next()
    }else{
      next('/')
      Notification.error(
          {
            title: '你未能通过Van的凝视',
            type: 'error',
            message: `无法识别你的身份，请重新登录！`,
            position: 'bottom-right',
            customClass: "message",
          });
    }
  }else{
    next()
  }
})
export default router
