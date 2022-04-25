<template>
  <div class="Login">
    <el-card class = "loginCard">
      <div slot="header" class="title">登录</div>
      <div v-if = "isLogin" class = "inside">

        <transition name = "post-error">
          <el-alert v-if="postReturnError"
                    title="难道你是间谍？"
                    description="密码与账户名/邮箱中至少有一个输入错误，或账户不存在! "
                    type="error"
                    show-icon :closable="false" id = "postMessage">
          </el-alert>
        </transition>

        <div class="enter inputName">Account 账户:
          <el-radio-group v-model="isNameOrEmail" size="small" style="margin-bottom: 10px;" class = "bottumGroup" @change = "reset">
            <el-radio-button :label="true">用户名</el-radio-button>
            <el-radio-button :label="false">邮箱</el-radio-button>
          </el-radio-group>
        </div>
        <transition name = "whichInput" mode="out-in" @enter = "recheck">
          <el-input v-if = "isNameOrEmail" key = "accountName" v-model="account" @keyup.enter.native= "login" placeholder="Please enter your Account" class = "enter" @input = "inputCheck"></el-input>
          <el-input v-else key = "email" v-model="email" @keyup.enter.native= "login" placeholder="Please enter your Account Email" class = "enter" id = "emailEnter" @change = "emailCheck"></el-input>
        </transition>

        <transition name = "email-error">
          <el-alert v-show="emailFormatError"
                  title="CNM，邮箱格式不正确！"
                  type="error"
                  show-icon :closable="false" id = "emailFormatErrorMessage">
          </el-alert>
        </transition>

        <div class="enter inputName">Password 密码: </div>
        <el-input v-model="password" @keyup.enter.native= "login" placeholder="Please enter your Password" show-password class = "enter last" id="passwordText" @blur = "checkAvailable"></el-input>

        <transition name = "password-error">
          <el-alert v-if="passwordError"
                    title="密码必须为六位且至少包含至少一个大写字母，一个小写字母，一个数字，与一个特殊字符"
                    type="error"
                    show-icon :closable="false" id = "errorMessage">
          </el-alert>
        </transition>

        <el-button type="primary" native-type="submit" @keyup.enter.native= "login" class = "enter bot" @click = "login">求求你，让我进吧！！</el-button>
      </div>
      <div v-else class = "success">
        <i class = "el-icon-success"></i>
        <p>登录成功，正在跳转</p>
        <p>Van is always watching you!</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import mixinMethod from "@/assets/methods/checkAndPOP.vue";

export default {


  name: 'Login',
  mixins:[mixinMethod],
  props:["defaultName","defaultEmail"],
  data(){
    return{
      account: "tom",
      email:"",
      password: "WWww123456,./",
      passwordError:false,
      postReturnError:false,
      isLogin:true,
      isNameOrEmail:true,
      emailFormatError : false,
    }
  },
  activated() {
    if(this.defaultName !=="" && this.defaultEmail !==""){
      this.account = this.defaultName;
      this.email = this.defaultEmail;
    }
  },


  methods:{
    inputCheck(event){
      this.account = this.charCheck(this.account);
    },
    emailCheck(event){
      this.emailFormatError = this.checkEmail(event,"emailEnter","emailFormatErrorMessage");

    },
    reset(val){
        if(val){
          if(this.emailFormatError){
            this.emailFormatError = false;
          }
        }
    },
    recheck(event){
      if(!this.isNameOrEmail) {
        if (this.email !== "") {
          this.emailFormatError = this.checkEmail(event, "emailEnter", "emailFormatErrorMessage");
        }
      }
    },
    async login(event) {
      let input = {};
      if(this.isNameOrEmail){
        input = {
          method:'POST',
          mode:'cors',
          cache:"default",
          credentials:"include",
          headers:{
            'Origin':"http://192.168.1.169:9070",
            'Content-Type': 'application/json'
          },
          redirect:"follow",
          referrerPolicy:'same-origin',
          body:JSON.stringify({user: this.account, user_pwd:this.password})
        };
      }else{
        input = {
          method:'POST',
          mode:'cors',
          cache:"default",
          credentials:"include",
          headers:{
            'Origin':"http://192.168.1.169:9070",
            'Content-Type': 'application/json'
          },
          redirect:"follow",
          referrerPolicy:'same-origin',
          body:JSON.stringify({user: this.email, user_pwd:this.password})
        };
      }
      const response = await fetch("http://192.168.1.143:9090/user/login",input);
      let loginData;
      response.json().then((data)=> {
        loginData = data;
      if(loginData.code == "200"){
        console.log("登录成功");
        this.isLogin = false;

        this.$store.commit("determineUserID",loginData.data.user_id);
        this.$store.commit("determineUserName",loginData.data.user_name);
        this.$store.commit("initial",loginData.data.content);
        let path = `/${loginData.data.user_name}`;
        this.$store.commit("updatePath","/mainpage/disk" + path);

        localStorage.loginToken = loginData.data.token;
        if(loginData.data.base64){
          localStorage.avatar = loginData.data.base64;
        }

        this.$router.push("/mainpage/disk" + path);
      } else {
        console.log("登录失败");
        if(this.postReturnError){
          this.shakingAnime(document.getElementById("postMessage"));
        }
        else{
          this.postReturnError = true
        }

      }

      }).catch((error) => {
        if(error.status !== 401) {
          this.$message.error('登录出现未知问题，请联系Van！ Code:' + error.message);
        }

      });




    },
    checkAvailable(event){
      this.passwordError = this.checkPasswordAvailable(event,"passwordText","errorMessage");

    },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
@import "../css/global.css";
.loginCard{
  width: 450px;
}
.inside{
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}
.inputName {
  font-size: 14px;
}

.inputName {

  position: relative;

}
.bottumGroup{
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translateY(-50%);
}

#emailFormatErrorMessage, .enter{
  margin-top: 15px;
}
.enter.last{
  margin-bottom: 15px;
}

.enter.bot{
  margin-top: 20px;
  width: 100%;
  align-self: end;
}
.post-error-enter-active,.password-error-enter-active,.email-error-enter-active{
  animation: shaking .3s linear;
}

.success{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

}
.success>p{
  font-size: 20px;
  margin: 30px;
}
.el-icon-success{
  color: #67c23a;
  font-size: 50px;
  margin: 30px;
}



.whichInput-enter-active,.whichInput-leave-active{
  transition: all .3s ease-in-out;
}
.whichInput-enter,.whichInput-leave-to{
  transform: translateX(30px);
  opacity: 0;

}
</style>
