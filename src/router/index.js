import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/Gate.vue'
import MainPage from '../views/MainPage.vue'
import MainPart from '../components/MainPart.vue'
import ShowPart from '../components/ShowPart.vue'
import Error from '../views/ErrorPage.vue'
import UploadPage from '../views/UploadPage.vue'
import { Notification } from 'element-ui';
Vue.use(VueRouter)

const routes = [
  {
    path: '/404error',
    name: 'Error',
    component: Error,
    meta: {
      isLogin: false
    }
  },
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
      {path : 'my_torrent', component: ShowPart,},
      {path : 'my_music', component: ShowPart,},
    ],
    meta: {
      isLogin: true
    },
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
