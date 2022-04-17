<template>
  <div id="app">
      <router-view></router-view>
      <!--MainPage></MainPage-->
  </div>
</template>

<script>

import Loginpage from '@/views/Gate.vue'
import Mainpage from '@/views/MainPage.vue'


export default {
  components:{
    "LoginPage" : Loginpage,
    "MainPage": Mainpage
  },
  created() {
    if(localStorage.isLogin === "Yes"){
      this.$store.commit("determineUserID",localStorage.whoID);
      this.$store.commit("determineUserName",localStorage.who);
      if(this.$route.fullPath !== this.$store.state.currentPath && this.$route.fullPath !== "/"){
        this.$store.commit("updatePath",this.$route.fullPath);
      }
      else if(this.$route.fullPath === "/"){
        this.$router.replace(localStorage.rootPath);
        this.$store.commit("updatePath",localStorage.rootPath);
      }
    }
  },

}


</script>

<style>
#app{
  width: 100%;
  height: 100%;

}
 #uploadTotalBar.el-progress .el-progress-bar__inner{
   background: linear-gradient(-30deg, #00B3CC, #ED7B84,  #9055FF, #6699FF);
   background-size: 700% 700%;
   animation: gradient 15s ease infinite;

 }
.el-progress .el-progress-bar__outer{
  background: rgba(235, 238, 245, 0.3)
}

.el-popover{
  background: #1e1f26 !important;
  border: #1e1f26 !important;
}
.el-popover__title{
  color: white !important;
}
.el-popover[x-placement^="bottom"] .popper__arrow{
  border-bottom-color: #1e1f26 !important;
}
.el-popover[x-placement^="bottom"] .popper__arrow::after{
  border-bottom-color: #1e1f26 !important;
}
.message{
  background-color: #444857 !important;
  border: #444857 !important;
}
.el-notification__title,.el-notification__content{
  color: white !important;
}


</style>
