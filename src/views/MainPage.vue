<template>
  <el-container id = "main">
    <el-header class="frame header">
      <img alt="Vue logo" src="../assets/naiveLogo.png" id="logo">
    </el-header>
    <el-container class="mainPart">

        <el-menu :default-active="this.$route.fullPath"
                 class="frame aside"
                 :collapse="isCollapse"
                 :router = "true"
                 background-color="#1e1f26"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="bi-hdd menuIcons"></i>
              <span slot="title">我的网盘</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="routeToDisk"><i class="el-icon-folder menuIcons"></i>全部文件</el-menu-item>
              <el-menu-item :index="routeToDiskPic" ><i class="el-icon-picture menuIcons"></i>我的图片</el-menu-item>
              <el-menu-item :index="routeToDiskMusic"><i class="bi-music-note menuIcons"></i> 我的音乐</el-menu-item>
              <el-menu-item :index="routeToDiskVid" ><i class="el-icon-film menuIcons"></i>我的视频</el-menu-item>
              <el-menu-item :index="routeToDiskLove" ><i class="el-icon-star-on menuIcons"></i>我的收藏</el-menu-item>
              <el-menu-item :index="routeToDiskBT" ><i class="el-icon-sort menuIcons"></i>我的BT种子</el-menu-item>

            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/mainpage/piazza" disabled>
            <i class="bi-signpost-2 menuIcons"></i>
            <span slot="title">PIAZZA 大咕咕广场</span>
          </el-menu-item>
          <el-menu-item index="/mainpage/tools" disabled>
            <i class="bi-tools menuIcons"></i>
            <span slot="title">小工具</span>
          </el-menu-item>
          <el-menu-item index="/mainpage/guguboard" disabled>
            <i class="bi-chat-right-dots-fill menuIcons"></i>
            <span slot="title">留言板</span>
          </el-menu-item>
          <User class = "currentUser" @sccc = "changeC"></User>
        </el-menu>

      <el-main class="frame main">
          <ToolBar></ToolBar>

          <router-view v-if="isRouterAlive"></router-view>




        <!--MainPart></MainPart-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MainPart from '@/components/MainPart.vue'
import User from '@/components/User.vue'
import DragArea from "@/components/DragArea";
import ToolBar from "@/views/ToolBar";

export default {

  name: "MainPage",
  data(){
    return{
      highTable:[
        {features: "我的网盘"},
        {features: "PIAZZA"},
        {features: "小工具"},
        {features: "待定"}
      ],
      isRouterAlive: true,
      currentRow:null,
      isCollapse: false,

      routeToDisk:"/mainpage/disk/",
      routeToDiskMusic:"/mainpage/my_music",
      routeToDiskPic:"/mainpage/my_picture",
      routeToDiskVid:"/mainpage/my_video",
      routeToDiskLove:"/mainpage/my_favorite",
      routeToDiskBT:"/mainpage/my_torrent",
      api:"",
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  methods:{

    changeC(val){
      this.isCollapse = val;
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
  },
  components:{
    MainPart,
    User,
    ToolBar,
    DragArea,
  },
  created() {
    this.routeToDisk = this.routeToDisk+this.$store.state.user_name;
  }

}
</script>

<style scoped>
#main{
  width: 100%;
  min-width: max-content;
  height: 100%;
  min-height: 660px;
  background: linear-gradient(to right,#1e1f26 25%,#252830 100%);

}

.frame {
  padding: 0;


}
.mainPart{
  width: 100%;
  height: calc(100vh - 60px);

}
.frame.header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(-45deg, #FFCAC9, #737DFE, #9055FF, #ED7B84);
  background-size: 600% 600%;
  animation: gradient 15s ease infinite;
  border-radius: 0 0 15px 15px;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.frame.main{
  max-height: 100%;
  background: #252830;
  overflow: hidden;
}

.frame.aside{

  border: none;
  position: relative;
  height: 100%;

}

#logo{
  padding: 0 25px;
  width: 150px;
  height: auto;
  filter:invert(100%);
}
.currentUser{
  position: absolute;
  bottom: 0%;
}

.menuIcons{
  margin-right: 5px;
  width: 24px;
  font-size: 18px;
}

.frame.aside:not(.el-menu--collapse) {
  width: 220px;
  min-height: 600px;
}



</style>