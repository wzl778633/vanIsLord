<template>
  <div :id = "isDiskOrUpload || isList || isSharedMainPage ? 'toolBarNoLight' : 'toolBar'">

    <div class = "function one">
      <el-button-group>
        <el-button type="primary" @click="backward" id = "backward" size = "small" round><i class = "bi-box-arrow-left"></i> 返回</el-button>
        <el-button type="primary" @click="forward" id = "forward" size = "small" round><i class = "bi-box-arrow-right"></i> 前进</el-button>
      </el-button-group>

      <el-dropdown v-show="(isDisk || !isDiskOrUpload) && !isSharedMainPage && isSharedMode" trigger="click" @command="switchShareFileMode">
        <el-button type="primary" class = "viewMode menu" size = "mini">
          {{shareMode}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="dropdownMenu">
          <el-dropdown-item command="1">正常文件模式</el-dropdown-item>
          <el-dropdown-item command="2">全部图片检索</el-dropdown-item>
          <el-dropdown-item command="3">全部视频检索</el-dropdown-item>
          <el-dropdown-item command="4">全部音乐检索</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input
          v-show="!isUpload && !isSharedMainPage"
          v-model="search"
          size="mini"
          prefix-icon="el-icon-search"
          style="width: 200px; margin: 0 20px"
          @input = "sendOut"
          class = "globalSearch"
          placeholder="在本页面搜索相关文件"
      />
      <el-button-group v-show="(isDisk || !isDiskOrUpload) && !isSharedMainPage">
        <el-button type="primary" @click="allSelect" id = "allSelect" size = "mini" round><i class = "bi-check2-square"></i> 全选</el-button>
        <el-button type="primary" @click="allClear" id = "allClear" size = "mini" round><i class = "bi-slash-square"></i> 清除</el-button>
      </el-button-group>

    </div>
    <div class  = "function second">
      <transition name = "forAll">
      <div v-show = "isMultiSelect" class = "controlPanel">
        <transition name = "forAll">
          <p v-show = "isMultiSelect" class = "allTitle">批量操作:</p>
        </transition>
        <transition name = "forAll">
          <el-button v-show = "isMultiSelect && isAllMusic" type="primary" @click="allAddToList" class = "viewMode left extra" size = "mini" ><i class = "bi-music-note-list"></i> 加入列表</el-button>
        </transition>
        <transition name = "forAll">
          <el-button-group  class= "forAllTool" v-show="isMultiSelect && !isSharedMode">
            <el-button type="primary" @click="allShare($event,false)" class = "viewMode left" size = "mini" ><i class = "bi-share"></i> 取消</el-button>
            <el-button type="primary" @click="allShare($event, true)" class = "viewMode left" size = "mini" ><i class = "bi-share-fill" style="display:inline-block; transform: rotateY(180deg)"></i> 分享</el-button>
          </el-button-group>
        </transition>
        <transition name = "forAll">
          <el-button-group  class= "forAllTool" v-show="isMultiSelect">
            <el-button type="primary" @click="allDownload" class = "viewMode right" size = "mini"><i class = "bi-cloud-download"></i></el-button>
            <el-button v-if="!isSharedMode" type="primary" @click="allDelete" class = "viewMode left" size = "mini" ><i class = "bi-trash3"></i></el-button>
            <el-button v-if="!isSharedMode" type="primary" @click="allMove" class = "viewMode left" size = "mini" ><i class = "bi-box-arrow-up-left"></i></el-button>
            <el-button v-else type="primary" @click="allGetShare" class = "viewMode left" size = "mini" ><i class = "bi-reply-fill" style="display:inline-block; transform: rotateY(180deg)"></i></el-button>
          </el-button-group>
        </transition>
      </div>
      </transition>

        <el-radio-group class = "forAllTool" v-show="(isDisk || !isDiskOrUpload) && !isSharedMainPage" v-model="ccc" size="mini" @change="listAndGridMode">
          <el-radio-button :label="1" class = "viewModeSingleSelect"><i class = "bi-list"></i></el-radio-button>
          <el-radio-button :label="2" class = "viewModeSingleSelect"><i class = "bi-grid"></i></el-radio-button>
        </el-radio-group>

      <!--Download></Download-->
      <Vbotton v-show="isDisk && !isSharedMode" :clickMethod = "handleClick" :nameForButton = "'新建文件夹'" :isIcon ="true" :iconClass = "'bi-folder-plus'" class = "folderButton" :vStyle = "'rounded'"></Vbotton>
      <Upload></Upload>
    </div>

    <new-dir-dialog @reload = "reloadPass" @closeNewDir = "closeNewDir" :newVisible = "newVisible"></new-dir-dialog>
  </div>

</template>

<script>
import Upload from "@/components/Upload";
import Vbotton from "@/components/V-botton";
import NewDirDialog from "@/components/NewDirDialog";

export default {
  name: "ToolBar",
  inject:['reload'],
  props:['isDisk','isDiskOrUpload','isUpload','isSelected','isSharedMode',"isList","isSharedMainPage"],
  data(){
    return{
      newVisible:false,
      search:"",
      shareMode:"正常文件模式",
      isMultiSelect:false,
      isAllMusic:false,
      ccc:2,
    }
  },
  components:{
    NewDirDialog,
    Upload,
    Vbotton
  },
  methods:{
    switchShareFileMode(i){
      let path;
      if(this.$route.fullPath.includes("/mainpage/shareAll")){
        if(i === '1'){
          path = "/mainpage/shareAll/board 全部文件";
          this.shareMode = "正常文件模式";
        }else if(i === '2'){
          path = "/mainpage/shareAll/picture:union";
          this.shareMode = "全部图片检索";
        }else if(i === '3'){
          path ="/mainpage/shareAll/video:union";
          this.shareMode = "全部视频检索";
        }else if(i === '4'){
          path ="/mainpage/shareAll/music:union";
          this.shareMode = "全部音乐检索";
        }
      }else if(this.$route.fullPath.includes("/mainpage/shareUser")){
        let arr = this.$route.fullPath.split("/");
        this.$store.commit("nowOpenShareUserName",arr[3]);
        if(i === '1'){
          path =`/mainpage/shareUser/${this.$store.state.share_user_name}`;
          this.shareMode = "正常文件模式";
        }else if(i === '2'){
          path =`/mainpage/shareUser/${this.$store.state.share_user_name}/picture:union`;
          this.shareMode = "全部图片检索";
        }else if(i === '3'){
          path =`/mainpage/shareUser/${this.$store.state.share_user_name}/video:union`;
          this.shareMode = "全部视频检索";
        }else if(i === '4'){
          path =`/mainpage/shareUser/${this.$store.state.share_user_name}/music:union`;
          this.shareMode = "全部音乐检索";
        }
      }
      if(this.$route.path !== path){
        this.$router.push(path);
      }
    },

    allDelete(){
      this.$store.commit("updateIsAllDeleteOn",true);
    },
    allDownload(){
      this.$store.commit("updateIsAllDownloadOn",true);
    },
    allMove(){
      this.$store.commit("updateIsAllMoveOn",true);
    },

    allSelect(){
      this.$emit("selectALL");
    },
    allClear(){
      this.$emit("clearALL");
    },
    allShare(e,flag){
      this.$store.commit("updateIsAllShareOn",[true,flag]);
    },
    allAddToList(){
      this.$store.commit("updateIsAllAddListOn",true);
    },
    allGetShare(){
      this.$store.commit("updateIsGetAllShareOn",true);
    },
    listAndGridMode(e){
      if(e === 1){
        this.$emit("clearALL");
        this.$emit("ListMode");
      }else{
        this.$emit("clearALL");
        this.$emit("GridMode");
      }
    },
    listMode(){
        this.$emit("clearALL");
        this.$emit("ListMode");
    },
    gridMode(){
        this.$emit("clearALL");
        this.$emit("GridMode");
    },
    handleClick(){
      this.newVisible = true;
    },
    closeNewDir(){
      this.newVisible = false;
    },
    reloadPass(){
      this.$emit("reload");
    },
    backward(){
      this.$router.back();

    },
    forward(){
      this.$router.forward();

    },
    sendOut(){
      this.$store.dispatch("updateSearchStrAsync",this.search);
    },
    clear(){
      this.search = "";
      this.$store.dispatch("updateSearchStrAsync",this.search);
    }
  },

  computed:{
    monitor() {
      return this.$store.state.isMultiSelect;
    },
    musicMonitor(){
      return this.$store.state.isAllMusic;
    }
  },
  watch:{
    '$route':{
      handler(val){
        this.clear();
        if(!val.path.includes(':union')){
          this.shareMode = "正常文件模式";
        }
      }
    },
    monitor:{
      handler(val){
        this.isMultiSelect = val;
      }
    },
    musicMonitor:{
      handler(val){
        this.isAllMusic = val;
      },
      immediate:true,
    }
  }

}
</script>

<style scoped>

#toolBarNoLight{
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #4aa996, #4f53b7, #3783b6, #8844d2);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  filter: drop-shadow(0px -5px 7px #4aa996) drop-shadow(0px -5px 7px #4f53b7);
  border-radius: 0 0 15px 15px;
  z-index: 100;
}
#toolBar{
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #4aa996, #4f53b7, #3783b6, #8844d2);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite,glowRotate 15s linear infinite;
  border-radius: 0 0 15px 15px;
  z-index: 10;

}

@keyframes glowRotate {
  0% {
    filter: drop-shadow(0px -10px 10px #4aa996) drop-shadow(0px -10px 10px #4f53b7);
  }
  25% {
    filter: drop-shadow(0px -10px 20px #4aa996) drop-shadow(0px -10px 20px #4f53b7);
  }
  50% {
    filter: drop-shadow(0px -10px 10px #3783b6) drop-shadow(0px -10px 10px #8844d2);
  }
  75% {
    filter: drop-shadow(0px -10px 20px #3783b6) drop-shadow(0px -10px 20px #8844d2);
  }
  100% {
    filter: drop-shadow(0px -10px 10px #4aa996) drop-shadow(0px -10px 10px #4f53b7);
  }
}

.forAllTool{
  margin: 0px 5px;
}
.function{
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.function.one{
  padding:10px;
}

/deep/.folderButton.button-container {
  width: 185px;
}
.folderButton /deep/ #upload {
  width: 150px;
  height: 28px;
}
/deep/.folderButton.button-container::before {
  width: 140px;
  height: 28px;
}
.viewMode{
  background-color: #bd38d7;

}
.viewMode.menu{
  margin-left: 20px;
}
.viewModeSingleSelect /deep/ .el-radio-button__inner{
  background: #ECECECFF;

}
.viewModeSingleSelect /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner{
  background-color: #bd38d7;
  border-color: #bd38d7;
}


#backward,#allSelect{
  font-family: "AaGothic (Non-Commercial Use)";
  background-image: linear-gradient(to left, #bd38d7 70%, #d2b31b);
  background-size: 400%;
  background-position: 100%;
  transition: 0.3s;
  border: none;
  box-shadow: -4px 2px 10px -5px  rgb(20, 25, 38);
}
#backward:hover,#allSelect:hover{
  background-position: 5%;
}
#forward,#allClear{
  font-family: "AaGothic (Non-Commercial Use)";
  background-image: linear-gradient(to right, #bd38d7 70%, #d2b31b);
  background-size: 400%;
  background-position: 0%;
  transition: 0.3s;
  border: none;
  box-shadow: 4px 2px 10px -5px rgb(20, 25, 38);
}

#forward:hover,#allClear:hover{
  background-position: 95%;
}

.globalSearch /deep/ .el-input__inner {
  background-color: rgba(37, 40, 48, 0.8);
  color: white;
  border: 1px solid transparent;
}

.globalSearch /deep/ .el-input__inner:hover{
  border-color: #A85DC3;
  border-top-color: #A85DC3;
  border-right-color: #A85DC3;
  border-bottom-color: #A85DC3;
  border-left-color: #A85DC3;
}
.globalSearch /deep/ .el-input{
  box-shadow: 0 4px 7px -3px rgb(20, 25, 38);

}

.forAll-enter-active,.forAll-leave-active{
  transition: all .3s ease-in-out;
}
.forAll-enter,.forAll-leave-to{
  transform: translateX(30px);
  opacity: 0;

}
.viewMode.left.extra{
  margin-right: 5px;
}
.allTitle{
  font-family: "AaGothic (Non-Commercial Use)";
  color: white;
  font-size: 1em;
  margin: 0 8px 0 0;
}

.controlPanel{
  padding: 8px;
  border-radius: 6px;
  background-color: #252830;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>

