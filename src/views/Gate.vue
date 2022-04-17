<template>
    <el-container id="main">
      <Background id="b"/>
      <el-main id="mainPage">
        <img src="@/assets/imgs/onlyLogo.png" id = "smallLogo"/>
        <transition appear
                    appear-class="main-appear"
                    appear-to-class="main-appear-to"
                    appear-active-class="main-appear-active">
        <FrontPageLoader @getImgSrc = "getValueFromSon" :ifRemove = "imgShow" ref="child"/>
        </transition>
        <transition name = "blackBack">
          <img v-if = "imgShow" :src="whatYouClick" alt = "pageToShow" @click = "remove" id = "p">
        </transition>
      </el-main>
      <transition appear
                  appear-class="aaaside-appear"
                  appear-to-class="aaaside-appear-to"
                  appear-active-class="aaaside-appear-active">
        <el-aside width="500px" id="side">
          <div class="container" id ="c1">
            <transition appear
                        appear-class="first-appear"
                        appear-to-class="first-appear-to"
                        appear-active-class="first-appear-active">
              <img alt="Vue logo" src="../assets/logo.png" id="logo" class="inner">
            </transition>
          </div>
        <transition name = "login-and-regist" mode="out-in"
                    appear
                    appear-class="login-and-regist-appear"
                    appear-to-class="login-and-regist-appear-to"
                    appear-active-class="login-and-regist-appear-active">
         <keep-alive><component :is = "logComponents" :defaultName = "defaultUserName" :defaultEmail = "defaultEmailName" @registFinished = "changeBackToLogin" id = "cc"></component></keep-alive>
        </transition>

        <div class="container" id ="c2">
            <el-link type="primary" class="inner" @click = "changeComponents">
              <transition name = "textTypo" mode="out-in"
                          appear
                          appear-class="textTypo-appear"
                          appear-to-class="textTypo-appear-to"
                          appear-active-class="textTypo-appear-active">
                <span v-if = "show" key = "login">
                  没有账户？点我注册
                </span>
                <span v-else key = "regist">
                  我想起了我的账户了，我要滚回去登录！
                </span>
              </transition>
            </el-link>
        </div>
      </el-aside>
      </transition>

    </el-container>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import FrontPageLoader from '@/components/FrontPageLoader.vue'
import Background from '@/components/Background.vue'

export default {
  name: 'Home',
  data(){
    return{
      logComponents : Login,
      show : true,
      whatYouClick : "",
      imgShow: false,
      defaultUserName: "",
      defaultEmailName:"",
    }
  },
  components: {
    Login,
    Register,
    FrontPageLoader,
    Background,

  },
  methods:{
    remove(event){
      setTimeout(() => { let list = document.getElementById("list");list.className = "active";},300);
      this.$refs.child.recover();
      this.whatYouClick = "";
      this.imgShow = false;
    },
    getValueFromSon(srcValue){
      if(srcValue){
        this.whatYouClick = srcValue;
        this.imgShow = true;
      }
      else{
        this.whatYouClick = srcValue;
        this.imgShow = false;
      }
    },

    changeBackToLogin(account,email){
      this.defaultUserName = account;
      this.defaultEmailName = email;
      this.logComponents = Login;
    },
    changeComponents(event){
      if(this.logComponents === Login){
        this.logComponents = Register;

        //event.target.textContent = "我想起了我的账户了，我要滚回去登录！"
        this.show = false;
      }
      else{
        this.logComponents = Login;
        //event.target.textContent = "没有账户？点我注册"
        this.show = true;
      }
    }
  }
}
</script>
<style scoped>
#main{
  width: 100%;
  height: 100%;
  min-height: 850px;


}

#b{
  position: absolute;
  z-index: -1;
}
#side{
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  min-height: 850px;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  border-radius: 30px 0 0 30px;
  box-shadow: 0 0 20px 20px black;

}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

#mainPage{
  width: 100%;
  overflow: hidden;
  position: relative;
  margin: 0;
  padding: 0;

}
#smallLogo{
  position: absolute;
  width: 35%;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  mask: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  mask-image: url("@/assets/imgs/onlyLogo.png");
  filter: drop-shadow(0 0 50px #fff) drop-shadow(-10px 0 80px #f0f) drop-shadow(10px 0 80px #0ff);

}
#p{
  width: 85%;
  height: auto;
  max-height: 88%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: contain;

}
.container{
  display: flex;
  justify-content: center;
  align-items: center;

}
#c1{

  flex-grow: 0.75;
}

#c2{
  flex-grow: 2.5;

}

#cc{

  flex-grow: 1;
}
#logo{
  width: 400px;
  height: auto;
  flex-shrink: 0.5;

}
.inner{
  color: white !important;
}
.aaaside-appear-active{
  transition: all .4s ease-in-out;
}
.first-appear-active{
  transition: all .4s ease-in-out 0.4s;
}
.login-and-regist-appear-active,.textTypo-appear-active{
  transition: all .4s ease-in-out 0.8s;
}
.main-appear-active{
  transition: all .5s ease-in-out 1.2s;
}
.login-and-regist-appear,.textTypo-appear,.first-appear,.aaaside-appear{
  transform: translateX(30px);
  opacity: 0;
}
.main-appear{
  opacity: 0;
}


.login-and-regist-enter-active,.login-and-regist-leave-active{
  transition: all .5s ease-in-out;
}
.login-and-regist-enter,.login-and-regist-leave-to{
  transform: translateX(30px);
  opacity: 0;

}


.textTypo-enter-active,.textTypo-leave-active{
  transition: opacity .5s ease-in-out;
}
.textTypo-enter,.textTypo-leave-to{
  opacity: 0;
}


.blackBack-enter-active,.blackBack-leave-active{
  transition: all 0.3s ease-in-out;
}

.blackBack-enter,.blackBack-leave-to{
  opacity: 0;
}

</style>