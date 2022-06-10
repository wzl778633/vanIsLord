<template>
  <el-container id = "main">
    <el-header class="frame header">
      <img @click = "backToDisk" alt="Vue logo" src="../assets/naiveLogo.png" id="logo">
      <p id = "logoText">永恒的夜空。The Eternal Night Sky</p>
    </el-header>
    <div class = "shameShadow2"></div>
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
              <el-menu-item :index="routeToDiskShare" ><i class="el-icon-sort menuIcons"></i>我的分享</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="bi-signpost-2 menuIcons"></i>
              <span slot="title">PIAZZA 大咕咕广场</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="'/mainpage/piazza'"><i class="bi-house-door menuIcons"></i>大咕咕主广场</el-menu-item>
              <el-menu-item :index="'/mainpage/shareAll/board 全部文件'" ><i class="bi-folder-symlink menuIcons"></i>全部分享文件</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/mainpage/tools" disabled>
            <i class="bi-tools menuIcons"></i>
            <span slot="title">小工具</span>
          </el-menu-item>
          <el-menu-item index="/mainpage/clipboard">
            <i class="bi-chat-right-dots-fill menuIcons"></i>
            <span slot="title">留言板</span>
          </el-menu-item>
        </el-menu>
      <el-main class="frame main">
          <ToolBar @reload = "reload" :isSharedMainPage="isSharedMainPage" :isList = "isList" :isSharedMode = "isSharedMode" :isUpload = "isUpload" :isDisk = "isDisk" :isDiskOrUpload = "isDiskOrUpload" ref="toolBar" @selectALL= "selectALL" @clearALL= "clearALL" @ListMode= "listAct" @GridMode= "gridAct"></ToolBar>
          <div v-show="isDiskOrUpload && !isSharedMainPage" class = "shameShadow"></div>
          <div v-show="isList && !isSharedMainPage" :class = "!isDisk ? 'shameShadow three':'shameShadow two'"></div>
          <router-view v-if="isRouterAlive" @reload = "reload" :isSharedMode="isSharedMode" :isList = "isList" ref = "currentComponent"></router-view>
      </el-main>
    </el-container>
    <music-quick-enter :isMainCollapse = "isCollapse" :musicOn = "musicOn" @openMusicPlayer = "openMusicPlayer" :class = "!isCollapse ?'currentmusicQuickEnter':'currentmusicQuickEnter collapse'"></music-quick-enter>
    <transition name="musicPlayerDes">
      <music-player v-show = "musicOn" :musicOn = "musicOn" ref = "player"></music-player>
    </transition>
    <total-space-bar :isMainCollapse = "isCollapse" class = "currentTotalBar" ref="totalBar"></total-space-bar>
    <UserProfile :ifRemove = "isUserOpen" @closeUser = "closeUserProfile" @reloadAvatar = "reloadAvatar"></UserProfile>
    <User :isMainCollapse = "isCollapse" class = "currentUser" @openUser = "openUserProfile" ref="user"></User>
    <v-pull-button :class = "!isCollapse ? 'mainPagePullButton' : 'mainPagePullButton hide' " :isHide = "isCollapse" @switchCollapse = "handleCollapse"></v-pull-button>
    <Announcement class = "announcement"></Announcement>
  </el-container>
</template>

<script>
import MainPart from '@/views/MainPart.vue'
import User from '@/components/User.vue'
import DragArea from "@/components/DragArea";
import ToolBar from "@/views/ToolBar";
import UserProfile from "@/components/UserProfile";
import VPullButton from "@/components/V-pullButton";
import TotalSpaceBar from "@/components/TotalSpaceBar";
import Announcement from "@/components/Announcement";
import MusicPlayer from "@/components/MusicPlayer";
import MusicQuickEnter from "@/components/musicQuickEnter";

export default {

  name: "MainPage",
  data(){
    return{
      isRouterAlive: true,
      currentRow:null,
      isCollapse: false,
      isUserOpen:false,
      isList:false,
      isSharedMode:false,
      isSharedMainPage:false,

      musicOn:false,
      routeToDisk:"/mainpage/disk/",
      routeToDiskMusic:"/mainpage/my_music",
      routeToDiskPic:"/mainpage/my_picture",
      routeToDiskVid:"/mainpage/my_video",
      routeToDiskLove:"/mainpage/my_favorite",
      routeToDiskShare:"/mainpage/my_share",
      isDisk:false,
      isUpload:false,
      isDiskOrUpload:false,
      api:"",
    }
  },
  provide() {
    return {
      reload: this.reload,
      updateTotalBar:this.updateTotalBar
    }
  },
  methods:{
    openMusicPlayer(flag){
      this.musicOn = flag;
    },
    selectALL(){
      this.$refs.currentComponent.passSelectInfo(true);
    },
    clearALL(){
      this.$refs.currentComponent.passSelectInfo(false);
    },
    listAct(){
      this.isList = true;
    },
    gridAct(){
      this.isList = false;
    },
    handleCollapse(){
      this.isCollapse = !this.isCollapse;
    },
    openUserProfile(){
      this.isUserOpen = true;
    },
    closeUserProfile(){
      this.isUserOpen = false;
    },
    backToDisk(){
      if(this.$route.fullPath !== this.routeToDisk){
        this.$router.push(this.routeToDisk);
      }

    },
    reloadAvatar(){
      this.$refs.user.refreshAvatar();
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    updateTotalBar(){
      this.$refs.totalBar.update();
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },

  },
  components:{
    MusicQuickEnter,
    MusicPlayer,
    Announcement,
    TotalSpaceBar,
    VPullButton,
    UserProfile,
    MainPart,
    User,
    ToolBar,
    DragArea,
  },
  async created() {
    this.$socket.open();
    console.log("链接启动！");
    //this.$socket.emit('getUserId',this.$store.state.user_id,localStorage.loginToken);

    this.routeToDisk = this.routeToDisk+this.$store.state.user_name;
    let{data:res} = await this.$http.post("/getHistory",{
      user_id:this.$store.state.user_id,
    });

    if(res.code === 200){
      this.$store.commit("updateState/initialUploadedFiles", res.data);
    }

    let format = {};
    let testEl = document.createElement( "video" ),
        mpeg4, h264, ogg, vp8,vp9,hevc;
    if ( testEl.canPlayType ) {
      // Check for MPEG-4 support
      mpeg4 = "" !== testEl.canPlayType( 'video/mp4; codecs="mp4v.20.8"' );
      format.mpeg4 = mpeg4;
      // Check for h264 support
      h264 = "" !== ( testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E"' )
          || testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ) );
      format.h264 = h264;
      // Check for Ogg support
      ogg = "" !== testEl.canPlayType( 'video/ogg; codecs="theora"' );
      format.ogg =ogg;
      // Check for Webm support
      vp8 = "" !== testEl.canPlayType( 'video/webm; codecs="vp8, vorbis"' );
      format.vp8 =vp8;
      vp9 = "" !== testEl.canPlayType( 'video/webm; codecs="vp9, vorbis"' );
      format.vp9 =vp9;
      // Check for hevc support
      hevc = "" !== testEl.canPlayType( 'video/mp4; codecs="hev1.1.6.L93.90"' ) ;
      format.hevc =hevc;
    }
    this.$store.commit('updataVideoFormatCheck',format);
    testEl.remove();
  },
  sockets: {

  },

  computed:{
    monitor(){
      return this.$route.fullPath;
    },
    musicMonitor(){
      return this.$store.state.musicState.isPlayerOpened;
    }
  },
  watch:{
    monitor:{
      handler(val){
        this.isSharedMode = false;
        this.isSharedMainPage=false;
        if(val.includes("/mainpage/disk") || val.includes("/mainpage/shareAll")||val.includes("/mainpage/shareUser")){
          this.isDiskOrUpload = true;
          this.isDisk = true;
          this.isUpload = false;
        }else if(val.includes("/mainpage/upload")){
          this.$store.dispatch("updateIsMultiSelectAsync",false);
          this.isDiskOrUpload = true;
          this.isUpload = true;
          this.isDisk = false;
        }
        else {
          this.isDiskOrUpload = false;
          this.isUpload = false;
          this.isDisk = false;
        }

        if(val.includes(":union")){
          this.isDiskOrUpload = false;
          this.isUpload = false;
          this.isDisk = false;
        }

        if(val.includes("/mainpage/shareAll") || val.includes("/mainpage/piazza") || val.includes("/mainpage/shareUser")){
          this.isSharedMode = true;
        }

        if(val === "/mainpage/piazza"){
          this.$store.dispatch("updateIsMultiSelectAsync",false);
          this.isDiskOrUpload = false;
          this.isUpload = false;
          this.isDisk = false;
          this.isSharedMainPage = true;
        }
      },
      immediate:true,
    },
    musicMonitor:{
      handler(val){
        if(val){
          this.musicOn = true;
          this.$store.dispatch('musicState/isListPlayAsync',false);
          setTimeout(()=>{this.$refs.player.rollingName();},300);
        }
      }
    }
  }
}
</script>

<style scoped>
#main{
  width: 100%;
  min-width: max-content;
  position: relative;
  height: 100%;
  min-height: 800px;
  background: linear-gradient(to right,#1e1f26 25%,black 100%);

}

.frame {
  padding: 0;


}
.shameShadow{
  width: 100%;
  background-color: #444857;
  position: absolute;
  height: 20px;
  top: 30px;
  right: 0;
  z-index: 0;
}
.shameShadow.two{
  top: 70px;
 background-color: rgba(175, 77, 239, 0.5);
}
.shameShadow.three{
  top: 30px;
  background-color: rgba(175, 77, 239, 0.5);
}
.shameShadow2{
  width: calc(100vw - 220px);
  background: linear-gradient(to right, #4aa996, #4f53b7, #3783b6, #8844d2);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  position: absolute;
  height: 10px;
  top: 50px;
  right: 0;
  z-index: 0;
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
  background-image: url("../assets/imgs/ccc.gif"),url("../assets/imgs/sparklesBig.gif"),linear-gradient(to right, rgba(17, 7, 12, 0.7) 10%,#06007E3F 20%, #06007E3F 90%, rgba(17, 7, 12, 0.7) 100%);
  animation: rotate 15s linear infinite , glowRotate 15s linear infinite;
  background-size: 50%;
  background-blend-mode: overlay;
  border-radius: 0 0 15px 15px;
  z-index: 2;
}
@keyframes glowRotate {
  0% {
    filter: drop-shadow(-15px -10px 10px #f0f) drop-shadow(-15px -10px 10px #324949);
  }
  25% {
    filter: drop-shadow(-15px -10px 20px #f0f) drop-shadow(-15px -10px 20px #324949);
  }
  50% {
    filter: drop-shadow(-15px -10px 10px #0080ff) drop-shadow(-15px -10px 10px #324949);
  }
  75% {
    filter: drop-shadow(-15px -10px 20px #0080ff) drop-shadow(-15px -10px 20px #324949);
  }
  100% {
    filter: drop-shadow(-15px -10px 10px #f0f) drop-shadow(-15px -10px 10px #324949);
  }
}
@keyframes rotate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.frame.main{
  max-height: 100%;
  background: #252830;
  position: relative;
  overflow: hidden;
}

.frame.aside{

  border: none;

  height: 100%;
  font-family: "AaGothic (Non-Commercial Use)";

  z-index: 1;
}
.frame.aside /deep/ .el-menu-item{
  font-size: 16px;
}
.frame.aside /deep/ .el-submenu__title{
  font-size: 16px;
}
#logo{
  padding: 0 25px;
  width: 150px;
  height: auto;
  filter:invert(100%);
  cursor: pointer;
}
#logoText{
  font-size: 1.5em;
  margin: 0px 20px;
  font-family: "AaGothic (Non-Commercial Use)";
  color: white;
}
.currentUser{
  position: absolute;
  bottom: 0%;
  z-index: 2;
}
.currentTotalBar{
  position: absolute;
  bottom: 75px;
  z-index: 2;
}
.currentmusicQuickEnter{
  position: absolute;
  bottom: 130px;
  z-index: 2;
}
.currentmusicQuickEnter.collapse{
  bottom: 70px;
}
.menuIcons{
  margin-right: 5px;
  width: 24px;
  font-size: 18px;
}

.frame.aside:not(.el-menu--collapse) {
  width: 220px;
  min-height: 550px;
}
.announcement{
  position: absolute;
  bottom: 10px;
  right: 20px;
}
.mainPagePullButton{
  position: absolute;
  left: 160px;
  bottom: 20px;
  z-index: 0;
  transition: all 0.3s ease-in-out;
}
.mainPagePullButton.hide{
  left: 4px;

}

.musicPlayerDes-enter-active,.musicPlayerDes-leave-active{
  transition: all .3s ease-in-out;
}
.musicPlayerDes-enter,.musicPlayerDes-leave-to{
  transform: translateY(30px);
  opacity: 0;

}
</style>
