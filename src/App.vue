<template>
  <div id="app">
      <router-view v-if = "loadFinished" ></router-view>
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
  data(){
    return {
      loadFinished:false,
    }
  },
  created() {
    if(localStorage.loginToken){
     this.$http.post("/user/checkToken",{
        //没有userId
        token:localStorage.loginToken,
      }).then((data) =>{
        let res = data.data;
        if(res.code === 200){
          this.$store.commit("determineUserID",res.data.user_id);
          this.$store.commit("determineUserName",res.data.user_name);
          this.loadFinished = true;
          if(this.$route.fullPath !== this.$store.state.currentPath && this.$route.fullPath !== "/"){
            this.$store.commit("updatePath",this.$route.fullPath);
          }
          else if(this.$route.fullPath === "/"){
            this.loadFinished = true;
            let path = `/${res.data.user_name}`;
            this.$store.commit("updatePath","/mainpage/disk" + path);
            this.$router.replace("/mainpage/disk" + path);

          }
        }
        else if(res.code === 456){
          this.loadFinished = true;
          if(this.$route.fullPath !== "/") {
            this.$router.replace("/");
          }
          this.$notify(
              {
                title: '登录过期',
                type: 'error',
                message: `请重新登录！`,
                position: 'bottom-right',
                customClass: "message",
              }
          );
        }

      }).catch((error) => {
        this.loadFinished = true;
       if(this.$route.fullPath !== "/") {
         this.$router.replace("/");
       }
        this.$message.error('登录检查出现未知问题，此乃重大错误，请立刻联系Van！ Code:' + error.message);
      });
    }
    else{
      this.loadFinished = true;
      if(this.$route.fullPath !== "/") {
        this.$router.replace("/");
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
