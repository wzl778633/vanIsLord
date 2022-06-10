<template>
  <div class = "mainShell" >
<div class = "piazzaMainPageStage">
  <div class = "howManyUser"><p>共有 <em> {{users.length}}</em> 名镇民有分享他们的文件</p></div>
  <overlay-scrollbars :options = "defaultStyle" style="width: 100%;
  height:calc(100vh - 110px);
  box-sizing: border-box;
  padding: 85px 25px 25px;">
    <UserList id = "dList" :userList="users" @reload = "reloadPass" ></UserList>
  </overlay-scrollbars>
</div>
  </div>
</template>

<script>
import UserList from "@/components/UserList";
export default {
  name: "PiazzaHomePage",
  components: {UserList},
  data(){
    return{
      users:[],
      defaultStyle: {
        className: 'os-theme-thick-light',
        overflowBehavior : {
          x : "hidden",
        },
        scrollbars: { autoHide : "leave",},
      }
    }
  },
  methods:{
    reloadPass(){
      this.$emit("reload");
    },
  },
  async mounted(){
    let{data : res}= await this.$http.get("/share/queryUser",{params:{
          user_id:this.$store.state.user_id,
      }});
    if(res.code === 200){
      this.users = res.data;
    }
  }
}
</script>

<style scoped>
*{
  width: 100%;
  height: 100%;
}
.mainShell{
  width: 100%;
  height:100%;
  position: relative;

}
.piazzaMainPageStage{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.howManyUser{
  position: absolute;
  background-image: url("../assets/imgs/sparklesBig.gif");
  border-radius: 0px 0px 30px 30px;
  background-size: 100%;
  background-position: 40% 40%;
  z-index: 5;
  background-blend-mode: overlay;
  width: 93%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.howManyUser>p{
  color: white;
  width: max-content;
  height: max-content;
  text-align: center;
  font-family: "AaGothic (Non-Commercial Use)";
  font-size:1.3em;
}
.howManyUser>p>em{
  font-size:2.0em;
  font-style: normal;
}
</style>