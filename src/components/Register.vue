<template>

  <div class="register">
    <el-card class = "loginCard">
      <div slot="header" class="title">注册</div>
      <overlay-scrollbars  :options = "defaultStyle" id = "register">
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
          <el-input v-model="password" placeholder="六位以上/至少一个大写字母 小写字母 数字 特殊字符" show-password class = "enter" @keyup.enter.native= "register" @blur = "checkAvailable" id = "passwordText" ></el-input>
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


          <div class="enter inputName">CodeName 暗号: </div>
          <el-input v-model="codeName" placeholder="输入不正确的暗号会被拒绝注册" @keyup.enter.native= "register" class = "enter" id = "codeTextInput" @blur="checkCodeCurr"></el-input>
          <transition name = "password-error">
            <el-alert v-show="codeFormatError"
                      title="Nope! 暗号不对，你是间谍，滚犊子！"
                      type="error"
                      show-icon :closable="false" id = "codeFormatErrorMessage" class="errorMsgs">
            </el-alert>
          </transition>


          <el-button type="primary" class = "enter bot" @keyup.enter.native= "register" @click = "register">Welcome to VanIsLord！</el-button>
        </div>
        <div v-else style="text-align: center">
          <el-result icon="success" title="注册成功" subTitle="您已名列VanIsLord名单之中，请务必遵守Van的条例">
          </el-result>
          <el-button type="primary" round @click = "backToLogin">我要登录！</el-button>
        </div>

      </div>
      </overlay-scrollbars>
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
      codeFormatError:false,
      isRegisted: true,
      defaultStyle: {

        overflowBehavior : {
          x : "hidden",
        },
        scrollbars: { autoHide : "leave",},

      }
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
        this.codeFormatError = false;
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
        this.codeFormatError = false;
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
        this.codeFormatError = false;
        this.emailFormatError = flag;
      } else {
        this.emailFormatError = flag;
      }
    },

    checkCodeCurr(){
      let flag =  this.checkCodeName(null,"codeTextInput","codeFormatErrorMessage");
      if (flag) {
        this.passwordError = false;
        this.rePasswordError = false;
        this.userNamePasswordError = false;
        this.emailPasswordError = false;
        this.emailFormatError = false;
        this.codeFormatError = flag;
      } else {
        this.codeFormatError = flag;
      }
    },
    backToLogin(){
      this.isRegisted = true;
      this.$emit("registFinished",this.account,this.email);
      this.account = "";
      this.password= "";
      this.rePassword= "";
      this.email="";
      this.codeName= "";
    },

    async register(event) {
      this.checkAvailable(event);
      this.checkEmailFormat();
      this.checkSame();
      this.checkCodeCurr();

      if (!this.codeFormatError && !this.passwordError && !this.rePasswordError && !this.emailFormatError) {
        let loginData;
        //const response = await fetch("http://192.168.1.143:9090/user/signin", {
        await this.$http.post("/user/signin", {
              user_name: this.account,
              user_email: this.email,
              user_pwd: this.password
        }
        ).then((data) => {
          loginData = data.data
          if (loginData.code == "200") {
            console.log("注册成功");
            this.passwordError = false;
            this.rePasswordError = false;
            this.emailPasswordError = false;
            this.emailFormatError = false;
            this.codeFormatError = false;
            this.userNamePasswordError = false;
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
              this.codeFormatError = false;
                this.userNamePasswordError = true;
            }

          } else if (loginData.code == "405") {
            console.log("注册失败 邮箱");
            if (this.emailPasswordError) {
              this.shakingAnime(document.getElementById("sameEmailErrorMessage"));
            } else {
              this.passwordError = false;
              this.rePasswordError = false;
              this.emailFormatError = false;
              this.userNamePasswordError = false;
                this.emailPasswordError = true;
              this.codeFormatError = false;
            }

          }
        }).catch((error) => {
          if (error.status !== 401) {
            this.$message.error('注册出现未知问题，请联系Van！ Code:' + error.message);
          }
        });
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

@import "../css/global.css";

#register{

height: 56.6vh;
max-height: max-content;
box-sizing: border-box;
padding: 10px;

}
.register{
  width: 450px;

}
.loginCard{
  width: 450px;

}
.inputName {
  font-size: 14px;
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
