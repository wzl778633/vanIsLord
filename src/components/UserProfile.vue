<template>
<div id="userProfileStage">
  <transition name = "divExchange" type = "transition">
  <div v-if = "ifRemove" id = "userProfile">
    <div class = "innerUserProfile">
      <div class="AlluserInfo">
        <el-avatar v-if="refresh" :size="180" :src="touXiangsrc" class = "profileAvatar"></el-avatar>
        <div class="userInfo">
          <p class = "info"><em>用户名：</em>{{ this.$store.state.user_name }}</p>
          <p class = "info"><em>注册邮箱：</em>{{ this.email }}</p>
          <p class = "info"><em>会员级别：</em>傻逼</p>
        </div>
      </div>
      <profile-chart v-if = "ifFinishedLoading" :size = size></profile-chart>
      <div class = "buttonGroup">
        <VBotton class = "profileButton" :isWorking = "false" :clickMethod = "openAvatarDialog" :nameForButton = "'修改头像'" :isIcon ="true" :iconClass = "'bi-person-circle'" :vStyle = "'rounded'"></VBotton>
        <VBotton class = "profileButton" :isWorking = "false" :clickMethod = "openPasswordDialog" :nameForButton = "'修改密码'" :isIcon ="true" :iconClass = "'bi-bootstrap-reboot'" :vStyle = "'rounded'"></VBotton>
      </div>
      <button class="custom-btn btn-5" @click = "exit"> <i class="bi bi-x-circle"></i><span> 退出登录</span></button>
      <el-dialog
          title="注销确认"
          :visible.sync="openExit"
          :append-to-body = "true"
          width="20%">
        <span>你确定要退出登录吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="openExit = false">取 消</el-button>
          <el-button type="primary" @click="closeConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
  </transition>
  <transition name = "exchange" type = "transition">
    <div key="needToShow" v-if = "ifRemove" @click = "remove" id = "background"></div>
  </transition>
  <AvatarUploudDialog :isOpen = "openAvatar" @closeAvatarUpload = "closeAvatarDialog" @reload = "reload"></AvatarUploudDialog>
  <PasswordChangeDialog :isOpen = "openPassword" @closePasswordChange = "closePasswordDialog" @closePasswordChangeWithS = "closePasswordDialogWithS"></PasswordChangeDialog>
</div>
</template>

<script>
import VBotton from "@/components/V-botton";


import AvatarUploudDialog from "@/components/AvatarUploudDialog";
import PasswordChangeDialog from "@/components/PasswordChangeDialog";
import ProfileChart from "@/components/ProfileChart";


export default {
  name: "UserProfile",
  components: {ProfileChart, PasswordChangeDialog, AvatarUploudDialog, VBotton},
  props: ["ifRemove"],

  data(){
    return {
      email:"",
      actualSize:[],
      size:[],
      timeThatChange:Date.now(),
      openAvatar:false,
      openPassword:false,
      //touXiangsrc : `http://192.168.1.143:9090/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${Date.now()}`,
      touXiangsrc : `${this.$addr}/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${Date.now()}`,
      openExit:false,
      ifFinishedLoading:false,
      refresh:true,
    }
  },
  methods:{
    reload(){
      this.timeThatChange = Date.now();
      this.touXiangsrc = ""
      this.$nextTick(function() {
        //this.touXiangsrc = `http://192.168.1.143:9090/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${Date.now()}`;
        this.touXiangsrc = `${this.$addr}/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${this.timeThatChange}`;
      })
      this.$emit("reloadAvatar")
    },
    closeConfirm(){
      this.openExit = false;
      this.remove();
      setTimeout(()=>{this.clean()},0);
    },
    clean(){
      this.$socket.disconnect();
      localStorage.removeItem('loginToken');
      localStorage.clear();
      if(this.$route.fullPath !== "/") {
        this.$router.replace("/");
      }
    },
    exit(){
      this.openExit = true;
    },
    remove(event){
      this.$emit("closeUser");
    },

    openAvatarDialog(){
      this.openAvatar = true;
    },
    closeAvatarDialog(){
      this.openAvatar = false;
    },

    openPasswordDialog(){
      this.openPassword = true;
    },
    closePasswordDialog(){
      this.openPassword = false;
    },
    closePasswordDialogWithS(){
      this.openPassword = false;
      this.remove();
      setTimeout(()=>{this.clean()},0);
    }

  },

  watch:{
    'ifRemove':{
      handler(val){
        const body = document.querySelector("body");
        if (val){
          body.style.overflow = "hidden";
          this.$http.post("/user/profile",{
            user_id:this.$store.state.user_id,
          }).then((data)=>{
            let res = data.data;
            if(res.code === 200){
              this.email = res.data.userEmail;
              this.actualSize = [res.data.picture,res.data.filmSize,res.data.musicSize,res.data.others,res.data.availableSize];
              this.size = res.data.ratio.map((item,index) => { return {percentage: item, actualSize:this.actualSize[index]}});
              this.ifFinishedLoading =true;
            }

          }).catch((error) => {
            if(error.status !== 401) {
              this.$message.error('获取用户资料出现未知问题，请联系Van！ Code:' + error.message);
            }
          });
        }else{
          this.ifFinishedLoading =false;
          setTimeout(()=>{body.style.overflow = "visible";},400)
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const body = document.querySelector("body");
      if (body.append) {
        body.append(this.$el);
      } else {
        body.appendChild(this.$el);
      }
    });
  },
  created() {
    //this.touXiangsrc = `https://aijiangsb.com:9070/api/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${this.timeThatChange}`;
    this.$http.post("/user/profile",{
      user_id:this.$store.state.user_id,
    }).then((data)=>{
      let res = data.data;
      if(res.code === 200){
        this.email = res.data.userEmail;
        this.actualSize = [res.data.picture,res.data.filmSize,res.data.musicSize,res.data.others,res.data.availableSize];
        this.size = res.data.ratio.map((item,index) => { return {percentage: item, actualSize:this.actualSize[index]}});
      }
    }).catch((error) => {
      if(error.status !== 401) {
        this.$message.error('获取用户资料出现未知问题，请联系Van！ Code:' + error.message);
      }
  });
  }
}
</script>

<style scoped>

@keyframes spin {
  0% {
    --rotate: 0deg;
  }
  100% {
    --rotate: 360deg;
  }
}
@property --rotate {
  syntax: "<angle>";
  initial-value: 132deg;
  inherits: false;
}
.profileAvatar{
  filter: drop-shadow(0px 0px 10px rgba(150, 150, 150, 0.5));
}
.AlluserInfo{
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.userInfo{
  width: 180px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.info{
  color: white;
}

#userProfileStage{
  width: 0%;
  height: 0%;
}
#background{
  width: 100%;
  height: 100%;
  background-color: black;
  position: absolute;
  top:0;
  opacity: 0.7;
  z-index: 998;

}
.innerUserProfile{
  width: 90%;
  height: 100%;
  background-color: #252830;
  border-radius: 30px 0 0 30px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

}
#userProfile{
  min-width: 600px;
  width: 40%;
  height: 98%;
  background-color: #252830;
  border-radius: 30px 0 0 30px;
  position: absolute;
  top:1%;
  right: -5%;
  z-index: 999;
}
#userProfile::before {
  content: "";
  width: 102%;
  height: 101%;
  z-index: -1;
  position: absolute;
  border-radius: 30px;
  background-image: linear-gradient(
      var(--rotate)
      , #5ddcff, #3c67e3 43%, #4e00c2);

  top: -0.5%;
  left: -1%;
  animation: spin 2.5s linear infinite;

}
#userProfile::after{
  z-index: -1;
  height: 100%;
  width: 100%;
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  transform: scale(1.0);
  filter: blur(calc(175px / 6));
  background-image: linear-gradient(
      var(--rotate)
      , #5ddcff, #3c67e3 43%, #4e00c2);

  animation: spin 2.5s linear infinite;

}
.exchange-enter-active,.exchange-leave-active{
  transition: opacity 0.3s ease-in-out;
}

.exchange-enter,.exchange-leave-to{
  opacity: 0 !important;
}

.divExchange-enter-active,.divExchange-leave-active{
  transition: all 0.3s ease-in-out;
}

.divExchange-enter,.divExchange-leave-to{
  transform: translateX(30px);
  opacity: 0 !important;
}


.buttonGroup{
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}

/deep/.profileButton.button-container {
  width: 230px;
}
.profileButton /deep/ #upload {
  width: 170px;
}
/deep/.profileButton.button-container::before {
  width: 180px;
}

.custom-btn {
  font-family: Helvetica, sans-serif;
  width: 60%;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  letter-spacing: 0.2em;
  font-weight: 500;
  background: transparent;
  border-radius: 30px;
  cursor: pointer;
  position: relative;
  display: inline-block;
  box-shadow: 0 4px 12px 0 rgb(20, 25, 38);
  outline: none;
  font-size: 1.1em;
}

.btn-5 {
  width: 60%;
  height: 40px;
  line-height: 42px;
  padding: 0;
  border: none;
  background: #860abd;
  transition: all 0.3s ease 0.3s;
  font-family: "AaGothic (Non-Commercial Use)";
}
.btn-5:hover {
  color: #ff0000;
  background: transparent;
  box-shadow:none;
  transition: all 0.3s ease;
}
.btn-5:before,
.btn-5:after{
  content:'';
  position:absolute;
  top:0;
  right:0;
  height:2px;
  width:0;
  background: #ff0000;
  box-shadow: 0 4px 12px 0 rgb(20, 25, 38);
  transition:300ms ease-in-out all;
}
.btn-5:after{
  right:inherit;
  top:inherit;
  left:0;
  bottom:0;
}
.btn-5:hover:before,
.btn-5:hover:after{
  width:100%;
  transition:600ms ease all;
}
</style>