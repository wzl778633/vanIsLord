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
      touXiangsrc : `http://192.168.1.143:9090/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}`,
      userName : "ZiningDadi",
      fitMode : "cover",
      imgSize : 60,
      delayCollapse : false,
    }
  },
  methods: {

    sendOut() {
     this.$emit("openUser")
    }
  },
  created() {
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
    c.addEventListener('click',() => {
      this.sendOut();
    });
  },


}
</script>

<style scoped>
#userMenu{

  margin: 3px 3px !important;
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: #444857;
  border-radius: 50px;
  transition: all 0.3s ease-in-out;
  width:214px;
  height: max-content;
}
#userMenuHide{

  margin: 3px 3px !important;
  background-color: #444857;
  display: flex;
  justify-content: start;
  align-items: center;
  border-radius: 50px;
  transition: all 0.3s ease-in-out;
  width:58px;

}

.userContent{
  margin: 5px;
  transition: all 0.3s ease-in-out;
}

#userContentname{
  box-sizing: border-box;
  width: 35%;
  height: 100%;
  color: white;
  margin: 0px 25px;
  opacity: 1;

}


.nameShow-enter-active{
  transition: all 0.3s ease-in-out;
}
.nameShow-enter{
  transform: translateX(-30px);
  opacity: 0 !important;

}

</style>