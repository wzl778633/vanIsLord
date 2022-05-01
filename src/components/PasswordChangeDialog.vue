<template>
  <el-dialog
      title="重设密码"
      :visible.sync="uploadVisible"
      v-if="uploadVisible"
      @close = "cancel"
      width="50%">
    <div class = "uploadBody">
      <div class = "uploadBlock">

        <transition name = "password-error">
          <el-alert v-show="passwordCheckError"
                    title="旧密码不正确！请检查！"
                    type="error"
                    show-icon :closable="false" id = "checkErrorMessage" class="errorMsgs">
          </el-alert>
        </transition>
        <div class="enter inputName">Old Password 旧密码: </div>
        <el-input v-model="oldPassword" placeholder="请输入旧密码" show-password class = "enter" @keyup.enter.native= "register" @blur = "checkNewAvailable" id = "oldPasswordText" ></el-input>
        <transition name = "password-error">
          <el-alert v-show="oldPasswordError"
                    title="密码必须为六位且至少包含一个大写字母，一个小写字母，一个数字，与一个特殊字符"
                    type="error"
                    show-icon :closable="false" id = "oldErrorMessage" class="errorMsgs">
          </el-alert>
        </transition>
        <div class="enter inputName">New Password 新密码: </div>
        <el-input v-model="password" placeholder="请输入新密码，至少一个大写字母，一个小写字母，一个数字，与一个特殊字符" show-password class = "enter" @keyup.enter.native= "register" @blur = "checkAvailable" id = "passwordText" ></el-input>
        <transition name = "password-error">
          <el-alert v-show="passwordError"
                    title="密码必须为六位且至少包含一个大写字母，一个小写字母，一个数字，与一个特殊字符"
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

      </div>
    </div>


    <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="submitUpload">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>




import mixinMethod from "@/assets/methods/checkAndPOP";

export default {
  name: "PasswordChangeDialog",
  props:["isOpen"],
  mixins:[mixinMethod],
  data(){
    return{
      password: "",
      rePassword: "",
      oldPassword: "",
      uploadVisible:true,
      passwordError:false,
      rePasswordError:false,
      oldPasswordError:false,
      passwordCheckError:false,
    }
  },

  methods: {

    cancel(){
      this.password="";
      this.rePassword="";
      this.oldPassword="";
          this.passwordError=false;
          this.rePasswordError=false;
          this.oldPasswordError=false;
          this.passwordCheckError=false;
      this.$emit('closePasswordChange' );
    },

    checkAvailable(event) {
      let flag = this.checkPasswordAvailable(event, "passwordText", "errorMessage");
      if (flag) {
        this.rePasswordError = false;
        this.passwordError = flag;
        this.oldPasswordError = false;
      } else {
        this.passwordError = flag;
      }

    },

    checkNewAvailable(event) {
      let flag = this.checkOldPasswordAvailable(event, "oldPasswordText", "oldErrorMessage");
      if (flag) {
        this.rePasswordError = false;
        this.passwordError = false;
        this.oldPasswordError = flag;
      } else {
        this.oldPasswordError = flag;
      }

    },
    checkSame(event) {
      let flag = this.checkIfSame(event, "rePasswordText", "reErrorMessage");
      if (flag) {
        this.passwordError = false;
        this.rePasswordError = flag;
        this.oldPasswordError = false;
      } else {
        this.rePasswordError = flag;
      }
    },



    async submitUpload() {
      if((this.rePasswordError || this.passwordError || this.oldPasswordError) === false) {
        await this.$http.post("/user/changePwd", {
          user_id: this.$store.state.user_id,
          old_pwd: this.oldPassword,
          new_pwd: this.password
        }).then((data) => {
              let res = data.data;
              if (res.code === 200) {
                this.$notify(
                    {
                      title: '密码修改成功',
                      type: 'success',
                      message: `已成功修改密码！请重新登录！`,
                      position: 'bottom-right',
                      customClass: "message",
                    }
                );
                this.passwordCheckError = false;
                this.password = "",
                this.rePassword = "",
                this.oldPassword = "",
                this.$emit('closePasswordChangeWithS');
              } else if (res.code === 401) {
                this.passwordError = false;
                this.rePasswordError = false;
                this.oldPasswordError = false;
                this.passwordCheckError = true;
                if (document.getElementById("checkErrorMessage")) {
                  let errMsg = document.getElementById("checkErrorMessage");
                  this.shakingAnime(errMsg);
                }
              }
            }
        ).catch((error) => {
          if(error.status !== 401) {
            this.$message.error('修改密码出现未知问题，请联系Van！ Code:' + error.message);
          }
        });

        this.$emit('closeAvatarUpload');
      }
    },


  },

  watch: {
    'isOpen':{
      handler: function (val){
        if(val){
          this.uploadVisible = true;
        }else{
          this.uploadVisible = false;
        }
      },
      immediate:true,
    },
  },
}
</script>

<style scoped>
.uploadBody{
  width: 100%;
}
.uploadBlock{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
}
.enter{
  margin-bottom: 15px;
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

