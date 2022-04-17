<template>
  <div id = "userMenu">
    <el-avatar :size="imgSize" :src="touXiangsrc" :fit = "fitMode" class = "userContent"> </el-avatar>
      <p v-show= "!isMainCollapse" class = "userContent name">{{userName}}</p>
    <el-button type="warning" icon="el-icon-star-off" circle @click = "changeValue"></el-button>
  </div>


</template>

<script>
export default {
  name: "User",
  //props:["isMainCollapse"],
  data(){
    return{
      touXiangsrc : require("@/assets/imgs/001.jpg"),
      userName : "ZiningDadi",
      fitMode : "cover",
      imgSize : 60,
      isMainCollapse : false,
    }
  },
  methods: {
    changeValue(){
      this.isMainCollapse = !this.isMainCollapse
    },
    errorHandler() {
      return true
    }
  },
  created() {
    this.userName = "你好, " + this.$store.state.user_name;
  },
  watch:{
   // "isMainCollapse":{
   //   handler(val){
   //     this.$emit("sccc",val);
   //   }
   // }
  },
  mounted() {
    if(this.isMainCollapse){
      this.imgSize = 50;
      let c = document.getElementById("userMenu");
      c.style.margin = "5px 0px";
    }else{
      this.imgSize = 60;
      let c = document.getElementById("userMenu");
      c.style.margin = "5px 5px";
    }
  },


}
</script>

<style scoped>
#userMenu{
  box-sizing: border-box;
  width: 95%;
  margin: 5px 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: #444857;
  border-radius: 50px;
  transition: all .3s ease-in-out;
}


.userContent{
  margin: 5px;
  transition: all .3s ease-in-out;
}

p{
  width: 35%;
  color: white;
}




</style>