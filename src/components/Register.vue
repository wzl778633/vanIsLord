<template>
  <div class="register">
    <el-card class = "loginCard">
      <div slot="header" class="title">注册</div>
      <div class = "inside">
        <div v-if="isRegisted">
          <div class="enter inputName">Account 账户名: </div>
          <el-input v-model="account" placeholder="Please enter your Account" @keyup.enter.native= "register" class = "enter" @input = "inputCheck"></el-input>
          <transition name = "password-error">
            <el-alert v-show="userNamePasswordError"
                      title="用户名已被注册！"
                      type="error"
                      show-icon :closable="false" id = "userNameErrorMessage" class="errorMsgs">
            </el-alert>
          </transition>

          <div class="enter inputName">Password 密码: </div>
          <el-input v-model="password" placeholder="密码必须为六位且至少包含至少一个大写字母，一个小写字母，一个数字，与一个特殊字符" show-password class = "enter" @keyup.enter.native= "register" @blur = "checkAvailable" id = "passwordText" ></el-input>
          <transition name = "password-error">
            <el-alert v-show="passwordError"
                      title="密码必须包含至少一个大写字母，一个小写字母，一个数字，与一个特殊字符"
                      type="error"
                      show-icon :closable="false" id = "errorMessage" class="errorMsgs">
            </el-alert>
          </transition>
          <div class="enter inputName">Re-enter Password PLZ 重输入密码以确认: </div>
          <el-input v-model="rePassword" placeholder="Please Re-enter your Password to confirm" show-password class = "enter" @keyup.enter.native= "register" @blur = "checkSame" id = "rePasswordText"></el-input>

          <transition name = "password-error">
            <el-alert v-show="rePasswordError"
                      title="两次密码输入不相同！请检查！"
                      type="error"
                      show-icon :closable="false" id = "reErrorMessage" class="errorMsgs">
            </el-alert>
          </transition>
          <div class="enter inputName">Email Address 邮箱地址: </div>
          <el-input v-model="email" placeholder="Please enter your email address" class = "enter" type="email" @keyup.enter.native= "register" @blur="checkEmailFormat" id = "emailText"></el-input>

          <transition name = "password-error">
            <el-alert v-show="emailPasswordError"
                      title="邮箱已被使用！若该邮箱是您的邮箱，请您登陆！"
                      type="error"
                      show-icon :closable="false" id = "sameEmailErrorMessage" class="errorMsgs">
            </el-alert>
          </transition>
          <transition name = "password-error">
            <el-alert v-show="emailFormatError"
                      title="CNM，邮箱格式不正确！"
                      type="error"
                      show-icon :closable="false" id = "emailFormatErrorMessage" class="errorMsgs">
            </el-alert>
          </transition>

          <div class="enter inputName">CodeName 暗号（disabled）: </div>
          <el-input v-model="codeName" placeholder="输入不正确的暗号会被拒绝注册" @keyup.enter.native= "register" class = "enter"></el-input>
          <el-button type="primary" class = "enter bot" @keyup.enter.native= "register" @click = "register">Welcome to VanIsLord！</el-button>
        </div>
        <div v-else style="text-align: center">
          <el-result icon="success" title="注册成功" subTitle="您已名列VanIsLord平台之中，请务必遵守Van的条例">
          </el-result>
          <el-button type="primary" round @click = "backToLogin">我要登录！</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>


import mixinMethod from "@/assets/methods/checkAndPOP.vue";

export default {
  name: 'Register',
  mixins:[mixinMethod],
  data(){
    return{
      account: "",
      password: "",
      rePassword: "",
      email: "",
      codeName: "",
      passwordError:false,
      rePasswordError:false,
      userNamePasswordError:false,
      emailPasswordError:false,
      emailFormatError:false,
      isRegisted: true,
    }

  },

  methods: {

    inputCheck(event) {
      this.account = this.charCheck(this.account);
    },

    checkAvailable(event) {
      let flag = this.checkPasswordAvailable(event, "passwordText", "errorMessage");
      if (flag) {
        this.rePasswordError = false;
        this.userNamePasswordError = false;
        this.emailPasswordError = false;
        this.emailFormatError = false;
        this.passwordError = flag;
      } else {
        this.passwordError = flag;
      }

    },


    checkSame(event) {
      let flag = this.checkIfSame(event, "rePasswordText", "reErrorMessage");
      if (flag) {
        this.passwordError = false;
        this.userNamePasswordError = false;
        this.emailPasswordError = false;
        this.emailFormatError = false;
        this.rePasswordError = flag;
      } else {
        this.rePasswordError = flag;
      }
    },

    checkEmailFormat(event) {
      let flag = this.checkEmail(event, "emailText", "emailFormatErrorMessage");
      if (flag) {
        this.passwordError = false;
        this.rePasswordError = false;
        this.userNamePasswordError = false;
        this.emailPasswordError = false;
        this.emailFormatError = flag;
      } else {
        this.emailFormatError = flag;
      }
    },

    backToLogin(){
      this.isRegisted = true;
      this.$emit("registFinished",this.account,this.email);
    },

    async register(event) {
      const response = await fetch("http://192.168.1.143:9090/user/signin/test", {
        method: 'POST',
        mode: 'cors',
        cache: "default",
        credentials: "include",
        headers: {
          'Origin': "http://192.168.1.169:9070",
          'Content-Type': 'application/json'
        },
        redirect: "follow",
        referrerPolicy: 'same-origin',
        body: JSON.stringify({user_name: this.account, user_email: this.email, user_pwd: this.password})
      });
      let loginData;
      response.json().then((data) => {
        loginData = data
        if (loginData.code == "200") {
          console.log("注册成功");
          this.isRegisted = false;
        } else if (loginData.code == "404") {
          console.log("注册失败 用户名");
          if (this.userNamePasswordError) {
            this.shakingAnime(document.getElementById("userNameErrorMessage"));
          } else {
            this.passwordError = false;
            this.rePasswordError = false;
            this.emailPasswordError = false;
            this.emailFormatError = false;
            this.userNamePasswordError = true;
          }

        } else if (loginData.code == "405") {
          console.log("注册失败 用户名");
          if (this.emailPasswordError) {
            this.shakingAnime(document.getElementById("sameEmailErrorMessage"));
          } else {
            this.passwordError = false;
            this.rePasswordError = false;
            this.emailFormatError = false;
            this.userNamePasswordError = false;
            this.emailPasswordError = true;
          }

        }
      }).catch((error) => {
        this.$message.error('注册出现未知问题，请联系Van！ Code:' + error.message);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

@import "../css/global.css";

.loginCard{
  width: 450px;

}
.inputName {
  font-size: 14px;
}

.inputName {
  /*border: 1px solid black;*/
}

.enter{
  margin-bottom: 15px;
}

.enter.bot{
  margin-top: 20px;
  width: 100%;
  align-self: end;
}

.errorMsgs{
  margin-bottom: 10px;
}
.password-error-enter-active{
  animation: shaking .3s linear;
}

.password-error-leave-active{
  transition: all 0s ease-in-out;
}
.password-error-leave-to{
  opacity: 0;
}

</style>
