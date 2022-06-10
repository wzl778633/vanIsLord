<template>
  <div class = "userCardStage" @click = "switchToUserFilesView">
  <div class = "userBlock">
   <el-avatar :size="100" :src="touXiangsrc" class = "profileAvatar"></el-avatar>
  <p id = "showName">{{ user.user_name }}</p>
  </div>
  </div>

</template>

<script>
export default {
  name: "UserCard",
  props:["user"],
  data(){
    return{
      touXiangsrc : `${this.$addr}/vavatar/${this.user.user_id}?token=${localStorage.loginToken}&time=${Date.now()}`,
      //touXiangsrc : `http://192.168.1.169:9090/vavatar/${this.user.user_id}?token=${localStorage.loginToken}&time=${Date.now()}`,
      //touXiangsrc : `https://aijiangsb.com:9070/api/vavatar/${this.$store.state.user_id}?token=${localStorage.loginToken}&time=${Date.now()}`,
    }
  },
  methods:{
    switchToUserFilesView(){
      this.$store.commit("nowOpenShareUserId",this.user.user_id);
      this.$store.commit("nowOpenShareUserName",this.user.user_name);
      this.$router.push(`/mainpage/shareUser/${this.user.user_name}`);
    }
  }

}
</script>

<style scoped>
.profileAvatar{
  margin-top: 10px;
  filter: drop-shadow(0px 0px 10px rgba(150, 150, 150, 0.5));
}
.userBlock{
  position: absolute;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: #252830;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 1fr;
  justify-items:center;
  align-items:center;
  transition: all 0.3s ease-in-out;
}
.userCardStage{
  position: relative;
  padding: 3px;
  box-sizing: border-box;
  margin: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: #252830;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  justify-content:center;
  align-items: center;
}
.userCardStage:hover{
  z-index: 99999;
  transform: scale(1.2);
}
.userCardStage::before {
  content: "";
  width: 104%;
  height: 102%;
  z-index: -1;
  position: absolute;

  border-radius: 8px;
  background-image: linear-gradient(
      var(--rotate)
      , #5ddcff, #3c67e3 43%, #4e00c2);
  top: -1%;
  left: -2%;

  animation: none;
  opacity: 0;
  transition: opacity 0.3s;
}
.userCardStage::after {
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  transform: scale(0.9);
  filter: blur(calc(200px / 6));
  background-image: linear-gradient(
      var(--rotate)
      , #5ddcff, #3c67e3 43%, #4e00c2);

  z-index: -1;
  height: 100%;
  width: 100%;
  position: absolute;
  content: "";
  animation: none;
  opacity: 0;
  transition: opacity 0.3s;
}
.userCardStage:hover:before {
  animation: spin 2.5s linear infinite;
  opacity: 1;
}
.userCardStage:hover:after {
  animation: spin 2.5s linear infinite;
  opacity: 1;
}
@keyframes spin {
  0% {
    --rotate: 0deg;
  }
  100% {
    --rotate: 360deg;
  }
}
.stage:hover .userBlock{
  height: auto;
  min-height: 200px;
  max-height: fit-content;
}
#showName{
  color: white;
  margin: 2px;
  width: 80%;
  text-align: center;
  font-size:1.1em;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  word-break: break-word;
  transition: all 0.3s ease-in-out;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>