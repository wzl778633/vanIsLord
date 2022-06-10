<template>

  <div :id = "!isMainCollapse ? 'userMenu' : 'userMenuHide'">
    <el-avatar :size="imgSize" :src="touXiangsrc" :fit = "fitMode" class = "userContent" id = "userAvatarV"> </el-avatar>
    <transition name = "nameShow">
      <p v-if = "!delayCollapse" id = "userContentname" @click = "sendOut">{{userName}}</p>
    </transition>
    <!--el-button v-show= "!isMainCollapse" type="warning" icon="el-icon-star-off" circle @click = "sendOut"></el-button-->
  </div>


</template>

<script>
export default {
  name: "User",
  props:["isMainCollapse"],
  data(){
    return{
      timeThatChange:Date.now(),
      //touXiangsrc : `http://192.168.1.143:9090/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${Date.now()}`,
      touXiangsrc : `${this.$addr}/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${Date.now()}`,
      userName : "ZiningDadi",
      fitMode : "cover",
      imgSize : 60,
      delayCollapse : false,
    }
  },
  methods: {
    sendOut() {
     this.$emit("openUser")
    },
    refreshAvatar(){
      this.timeThatChange = Date.now();
      this.touXiangsrc = ""
      this.$nextTick(function() {
        //this.touXiangsrc = `http://192.168.1.143:9090/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${Date.now()}`;
        this.touXiangsrc = `${this.$addr}/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${this.timeThatChange}`;
      })
    }
  },
  created() {
    //this.touXiangsrc = `https://aijiangsb.com:9070/api/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${this.timeThatChange}`;
    this.userName = "你好, " + this.$store.state.user_name;
  },

  watch:{
   "isMainCollapse":{
     handler(val){
       if(val){
         this.imgSize = 48;
         this.delayCollapse  = true;
       }else{
         this.imgSize = 60;
         setTimeout(()=>{
           this.delayCollapse  = false;
         },350);
       }
      }
    }
  },
  mounted() {
    let c = document.getElementById('userAvatarV');
    c.style.cursor = 'pointer';
    c.addEventListener('click',() => {
      this.sendOut();
    });
  },


}
</script>

<style scoped>
#userMenu{
  margin: 5px 3px !important;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #444857;
  border-radius: 50px;
  transition: all 0.3s ease-in-out;
  width:214px;
  height: max-content;

}
#userMenu:hover {
  box-shadow: 0px 0px 10px -2px #ff32ff,0px 0px 10px -2px #314cfd;
}
#userMenuHide{

  margin: 5px 3px !important;
  background-color: #444857;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 50px;
  transition: all 0.3s ease-in-out;
  width:58px;

}
#userMenuHide:hover {
  box-shadow: 0px 0px 10px -2px #ff32ff,0px 0px 10px -2px #314cfd;
}
.userContent{
  margin: 5px;
  transition: all 0.3s ease-in-out;

}
/deep/ .userContent{
  filter: drop-shadow(0px 0px 10px #1618174C);
}
#userContentname{
  font-family: "AaGothic (Non-Commercial Use)";
  font-size: 1.1em;
  box-sizing: border-box;
  width: 35%;
  height: 100%;
  color: white;
  margin: 0px 25px;
  opacity: 1;
  cursor: pointer;
}


.nameShow-enter-active{
  transition: all 0.3s ease-in-out;
}
.nameShow-enter{
  transform: translateX(-30px);
  opacity: 0 !important;

}

</style>