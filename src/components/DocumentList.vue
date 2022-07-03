<template>
    <!--transition-group name = "mainDev" class = "document" tag = "ul"-->
<div id ="ccc" @dragover="needDragAll" @dragend ="clearDragState">
<ul :class = "isList ? 'document list':'document'">
  <li v-for="item in itemList.filter(data => !this.$store.state.searchStr || data.file_name.toLowerCase().includes(this.$store.state.searchStr.toLowerCase()))" v-bind:key = "isSharedMode ? (item.node_id + 'd' + item.user_id) : item.node_id">
  <keep-alive>
    <Document v-if= "!isList" @listChangeFav= "listChangeFav" @listChangeShare="listChangeShare" @openPicViewer = "openPicViewer" :timeNow="timeNow" :isSharedMode = "isSharedMode" :length = "selectedItem.length" :item = "item" @unSelected = "popSelectedItem" @selected = "pushSelectedItem" @needRedirect = "passThough" @reload = "reload" :ref="item.node_id" v-contextmenu:contextmenu></Document>
    <DocumentListMode v-else @listChangeFav= "listChangeFav" @listChangeShare="listChangeShare" @openPicViewer = "openPicViewer" :timeNow="timeNow" :isSharedMode = "isSharedMode" :length = "selectedItem.length" :item = "item" @unSelected = "popSelectedItem" @selected = "pushSelectedItem" @needRedirect = "passThough" @reload = "reload" :ref="item.node_id" v-contextmenu:contextmenu></DocumentListMode>
  </keep-alive>
  </li>
</ul>
  <div class = "nothing" v-if="isNoContent">
    <p>这里还没有东西哦！<br/>Nothing Here!</p>
  </div>
  <v-contextmenu ref="contextmenu" theme="dark" @contextmenu = "initial">
    <v-contextmenu-item @click = "changeDialogShell"><i class = "bi-check2-circle"></i> 打开</v-contextmenu-item>
    <v-contextmenu-item v-if = "!this.isFolder" @click = "downloadShell"><i class = "bi-cloud-download"></i> 下载</v-contextmenu-item>
    <v-contextmenu-item v-if = "!this.isSharedMode" @click = "moveToShell" ><i class = "bi-box-arrow-up-left"></i> 移动到...</v-contextmenu-item>
    <!--接口需求 分享移动到-->
    <v-contextmenu-item v-else @click = "saveToShell" ><i class = "bi-reply-fill" style="display:inline-block; transform: rotateY(180deg)"></i> 获取到...</v-contextmenu-item>

    <v-contextmenu-item v-if = "!this.isSharedMode" @click = "deleteProgressShell"><i class = "bi-trash3"></i> 删除</v-contextmenu-item>
    <v-contextmenu-item v-if = "!this.isSharedMode" @click = "renameShell"><i class = "bi-pen"></i> 重命名</v-contextmenu-item>
    <v-contextmenu-item v-if = "!this.isSharedShell && !this.isSharedMode" @click = "changeShare" ><i class = "bi-share-fill"></i> 分享</v-contextmenu-item>
    <v-contextmenu-item v-else-if = "this.isSharedShell && !this.isSharedMode" @click = "changeShare" ><i class = "bi-share"></i> 取消分享</v-contextmenu-item>

    <v-contextmenu-item v-if = "!this.isFavShell && !this.isSharedMode" @click = "changeFavorite"><i class = "bi-star-fill"></i> 加入收藏</v-contextmenu-item>
    <v-contextmenu-item v-else-if="this.isFavShell && !this.isSharedMode" @click = "changeFavorite"><i class = "bi-star"></i> 取消收藏</v-contextmenu-item>
    <v-contextmenu-item @click = "detailCheckShell"><i class = "bi-question-circle"></i> 详情</v-contextmenu-item>

    <v-contextmenu-item v-if = "this.isMusicShell" @click = "addNewSong"><i class = "bi-bookmark-plus"></i> 加入播放列表</v-contextmenu-item>
  </v-contextmenu>
  <img-viewer ref="viewer"></img-viewer>


  <SaveToDialog ref="saveDialog" @updateTotalBar = "updateTotalBarShell" @reload = "reload" :nodeIdsWithUserIds = "this.selectedItemWithUserId" :multiMode = "true" @closeMoveTo = "closeSaveTo"  :moveVisible = "saveVisible"></SaveToDialog>
  <move-to-dialog ref="moveDialog" @updateTotalBar = "updateTotalBarShell" @reload = "reload" @closeMoveTo = "closeMoveTo" :multiMode = "true" :nodeIds = "this.selectedItem" :moveVisible = "moveVisible"></move-to-dialog>
</div>
    <!--/transition-group-->
</template>

<script>
import Document from '@/components/Document.vue'
import DocumentListMode from "@/components/DocumentListMode";
import MoveToDialog from "@/components/MoveToDialog";
import ImgViewer from "@/components/ImgViewer";
import SaveToDialog from "@/components/SaveToDialog";

export default {
  name: "DocumentList",
  props: ["itemList","isList","isSharedMode"],
  inject:['updateTotalBar'],
  data(){
    return{
      isFavShell:false,
      isFolder: false,
      isSharedShell:false,
      isMusicShell:false,
      moveVisible:false,
      saveVisible:false,
      whichNode:0,
      $viewer:null,
      images:[],
      timeNow:Date.now(),
      isNoContent:false,
      selectedItem:[],
      selectedItemWithUserId:[],
      noneMusicList:[],
    }
  },
  components:{
    ImgViewer,
    MoveToDialog,
    Document,
    DocumentListMode,
    SaveToDialog,
  },
  methods:{
    async listChangeShare(node_id){
      for(let element of this.itemList){
        if(element.node_id === node_id){
          element.isShared = !element.isShared;
          break;
        }
      }
    },
    async listChangeFav(node_id){
      for(let element of this.itemList){
        if(element.node_id === node_id){
          element.isFavorite = !element.isFavorite;
          break;
        }
      }
    },
    async openPicViewer(nodeId,loading){
      let index;
      for(let element of this.images){
        element.realSrc =  await this.$refs[element.node_id][0].imageGetMD5andUrl();
        if(element.node_id === nodeId){
          index = this.images.indexOf(element);
        }
      }
      loading.close();
      this.$refs.viewer.show(this.images, index);
    },
    closeMoveTo(){
      this.moveVisible = false;
    },
    closeSaveTo(){
      this.saveVisible = false;
    },
    clearDragState(e){
      e.stopPropagation();
      e.preventDefault();
      if(this.selectedItem.length > 1 && this.selectedItem.indexOf(this.$store.state.draggingID) !== -1){
        this.$store.commit("updateIsMultiDragging", false);
      }
    },
    needDragAll(e){
      e.stopPropagation();
      e.preventDefault();
      if(this.selectedItem.length > 1 && this.selectedItem.indexOf(this.$store.state.draggingID) !== -1){
        this.$store.commit("updateIsMultiDragging", true);
        this.$store.commit("updateDraggingIDs",this.selectedItem);
      }
    },
    selectALL(flag){
      if(flag){
        for(let element of this.itemList){
          this.$refs[element.node_id][0].checked = flag;
          this.selectedItem.push(element.node_id);
          if(this.$refs[element.node_id][0].isMusic === false){
            this.noneMusicList.push(element.node_id);
          }
          if(this.isSharedMode){
            this.selectedItemWithUserId.push({node_id:element.node_id,user_id:element.user_id});
          }
        }
      }else{
        for(let element of this.itemList){
          this.$refs[element.node_id][0].checked = flag;
        }
        this.selectedItem = [];
        this.noneMusicList = [];
        this.selectedItemWithUserId = [];
        this.$store.commit('updateIsAllMusic',true);
      }
    },
    pushSelectedItem(id){
      this.selectedItem.push(id);
      if(this.$refs[id][0].isMusic === false){
        this.noneMusicList.push(id);
      }
      if(this.isSharedMode){
        this.selectedItemWithUserId.push({node_id:id,user_id:this.$refs[id][0].item.user_id});
      }
    },
    popSelectedItem(id){
      this.selectedItem.splice(this.selectedItem.indexOf(id),1);
      if(this.$refs[id][0].isMusic === false){
        this.noneMusicList.splice(this.noneMusicList.indexOf(id),1);
      }
      if(this.isSharedMode){
        for(let [index, el] of this.selectedItemWithUserId.entries()){
          if(el.node_id === id){
            this.selectedItemWithUserId.splice(index,1);
            break;
          }
        }
      }
    },
    initial(vm){
      this.whichNode = vm.data.ref;
      this.isFavShell = this.$refs[this.whichNode][0].isFav;
      this.isFolder = this.$refs[this.whichNode][0].isFolder;
      this.isSharedShell = this.$refs[this.whichNode][0].isShared;
      this.isMusicShell = this.$refs[this.whichNode][0].isMusic;
    },
    changeDialogShell(){
      this.$refs[this.whichNode][0].changeDialog();
    },
    downloadShell(){
      this.$refs[this.whichNode][0].download();
    },
    deleteProgressShell(){
      this.$refs[this.whichNode][0].deleteProgress();
    },
    renameShell(){
      this.$refs[this.whichNode][0].rename();
    },
    changeFavorite(){
     this.$refs[this.whichNode][0].changeFavorite();
    },

    changeShare(){
      this.$refs[this.whichNode][0].changeShared();
    },

    moveToShell(){
      this.$refs[this.whichNode][0].moveVisible = true;
    },
    saveToShell(){
      this.$refs[this.whichNode][0].saveVisible = true;
    },
    detailCheckShell(){
      this.$refs[this.whichNode][0].detailCheck();
    },
    async addNewSong(){
      this.$socket.emit("addNewSong",this.whichNode,localStorage.loginToken,(this.isSharedMode ? this.$refs[this.whichNode][0].item.user_id : this.$store.state.user_id));
      await this.$store.dispatch('musicState/isListPlayAsync',false);
      await this.$store.dispatch('musicState/isOnlyAddToListAsync', false);
    },
    reload(){
      this.$emit("reload");
    },
    passThough(path){
      this.$emit("pass",path);
    },
    updateTotalBarShell(){
      this.updateTotalBar();
    }
  },

  computed:{
    monitor(){
      return this.selectedItem.length;
    },
    downloadALLMonitor(){
      return this.$store.state.isAllDownloadOn;
    },
    deleteALLMonitor(){
      return this.$store.state.isAllDeleteOn;
    },
    moveALLMonitor(){
      return this.$store.state.isAllMoveOn;
    },
    shareAllMonitor(){
      return this.$store.state.isAllShareOn;
    },
    allAddListOnMonitor(){
      return this.$store.state.isAllAddListOn;
    },
    getAllShareOnMonitor(){
      return this.$store.state.isGetAllShare;
    }
  },
  watch:{
    'noneMusicList':{
      handler(val){
        if(this.selectedItem.length!==0){
          if(this.noneMusicList.length !==0){
            this.$store.commit('updateIsAllMusic',false);
          }
          else{
            this.$store.commit('updateIsAllMusic',true);
          }
        }
      }
    },
    'itemList':{
      handler(val){
        if(val.length === 0){
          this.isNoContent = true;
        }
        else{
          this.isNoContent = false;
          this.images = [];
          for(let [index,v] of this.itemList.entries()){
            if(v.content_type === "image"){
              let suffix = /\.([0-9A-z]+)$/i.exec(v.file_name)[1];
              suffix = suffix.toLowerCase();
              if(suffix === "png"){
                v.base64 = "data:image/png;base64," + v.base64;
              }else if(suffix === "jpeg" || suffix === "jpg"){
                v.base64 = "data:image/jpeg;base64," + v.base64;
              }else if(suffix === "gif"){
                v.base64 = "data:image/gif;base64," + v.base64;
              }else if(suffix === "ico"){
                v.base64 = "data:image/x-icon;base64," + v.base64;
              }
              let tmp = {
                node_id : v.node_id,
                name: v.file_name,
                src: v.base64,
                realSrc:"?",
              }
              this.images.push(tmp);
            }
          }

        }
      }
    },
    downloadALLMonitor:{
      handler(val){
        if(val){
          const loading = this.$loading({
            lock: true,
            text: '正在生成下载任务，请稍后...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let i = 0;
          let arr = [];
          for(let element of this.selectedItem){
            if(!this.$refs[element][0].isFolder){
              let c = new Promise((resolve, reject) => {
                setTimeout(()=>{this.$refs[element][0].download();resolve();},i*500);
              });
              arr.push(c);
            }
            i++;
          }
          Promise.all(arr).then(()=>{loading.close()})
          this.$store.commit("updateIsAllDownloadOn",false);

        }
      }
    },
    deleteALLMonitor:{
      async handler(val){
        if(val){
          this.$confirm('你确定是否删除选择的所有文件？', '你确定吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '算了',
            type: 'warning'
          }).then(async () => {
            const loading = this.$loading({
              lock: true,
              text: '正在删除中，请稍后...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            let {data: res} = await this.$http.post("/file/deleteFiles", {
              file_list: this.selectedItem,
              user_id: this.$store.state.user_id,
            }).catch((error) => {
              loading.close();
              this.$store.commit("updateIsAllDeleteOn", false);
              if (error.status !== 401) {
                this.$message.error('批量删除出现未知问题，请联系Van！ Code:' + error.message);
              }
            });
              if (res.code === 200) {
                loading.close();
                this.$emit("reload");
                this.updateTotalBar();
                this.$notify(
                    {
                      title: '批量删除文件成功',
                      type: 'success',
                      message: `选中文件已被删除！`,
                      position: 'bottom-right',
                      customClass: "message",
                    }
                );
                this.$store.commit("updateIsAllDeleteOn", false);
              }
          }).catch(() => {
            loading.close();
            this.$store.commit("updateIsAllDeleteOn", false);
            this.$notify(
                {
                  title: '傻逼',
                  type: 'error',
                  message: `取消删除文件成功！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          });
        }
      }
    },
    moveALLMonitor:{
      handler(val){
        if(val){
          this.moveVisible = true;
          this.$store.commit("updateIsAllMoveOn",false);
        }
      }
    },
    shareAllMonitor:{
      async handler(val){
        if(val === true){
          let flag = this.$store.state.allShareMode;
          let tmp = this.selectedItem;
          if(val){
            let{data:res} = await this.$http.post("/share/shareFiles", {
              file_list: this.selectedItem,
              user_id: this.$store.state.user_id,
              is_shared:flag,
            }).catch((error) => {
              if(error.status !== 401) {
                this.$message.error('批量分享删减出现未知问题，请联系Van！ Code:' + error.message);
              }}
            );

            if(res.code === 200){
              //await this.$store.dispatch("updateChangeSharedIdAsync", this.item.node_id + "s" + Date.now());
              for(let element of tmp){
                if(this.$refs[element][0].isShared !== flag){
                  await this.$store.dispatch("updateChangeSharedIdAsync", element + "s" + Date.now());
                }
              }
              if(flag){
                this.$notify(
                    {
                      title: '批量分享成功',
                      type: 'success',
                      message: `选中文件已经分享至大咕咕广场，可被所有镇民访问！`,
                      position: 'bottom-right',
                      customClass: "message",
                    }
                );
              }else{
                this.$notify(
                    {
                      title: '取消分享成功',
                      type: 'error',
                      message: `选中文件不再能被其他镇民访问！`,
                      position: 'bottom-right',
                      customClass: "message",
                    }
                );
              }
            }

          }
          this.$store.commit("updateIsAllShareOn",[false,null]);
        }
      }
    },
    allAddListOnMonitor:{
      handler(val){
        if(val){
          if(this.isSharedMode){
            this.$socket.emit('addNewSongsShared',this.selectedItemWithUserId,localStorage.loginToken);
          }
          else{
            this.$socket.emit('addNewSongs',this.selectedItem,localStorage.loginToken,(this.isSharedMode ? this.item.user_id : this.$store.state.user_id));
          }

          this.$store.commit("updateIsAllAddListOn",false);
        }
      }
    },
    getAllShareOnMonitor:{
      handler(val){
        if(val){
          this.saveVisible = true;
          this.$store.commit("updateIsGetAllShareOn",false);
        }
      }
    },
    monitor:{
      handler(val){
        if(val > 1){
          this.$store.dispatch("updateIsMultiSelectAsync",true);
        }
        else{
          this.$store.dispatch("updateIsMultiSelectAsync",false);
        }
      },
      immediate:true,
    },
    '$route':{
      handler(){
        this.selectedItem = [];
        this.noneMusicList = [];
        this.selectedItemWithUserId = [];
        this.$store.commit('updateIsAllMusic',true);
      }
    }
  }
}
</script>

<style scoped>
*{
  margin:0px;
  padding:0px;
}
.nothing{
  width: 100%;
  height: calc(100vh - 300px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.nothing > p{
  font-family: "AaGothic (Non-Commercial Use)";
  text-align: center;
  color: white;
}
.document{
  width: 100%;
  max-height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 176px;

  /*grid-template-columns: 100%;
  grid-auto-rows: 50px;*/
  grid-gap: 5px 5px;
}
.document.list{
  width: 100%;
  max-height: 100%;
  display: grid;
  /*grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 176px;*/
  grid-template-columns: 100%;
  grid-auto-rows: 50px;
  /*grid-gap: 5px 5px;*/
}
li{

width: 100%;
height: 100%;
list-style: none;

}

.mainDev-enter-active, .mainDev-leave-active {
transition: all 0.3s;
}
.mainDev-enter, .mainDev-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

#ccc{
  box-sizing: border-box;
  width: 100%;
  padding-bottom: 170px;
}

</style>

<style>
.v-contextmenu{
  width: 125px;
  background-color: rgba(0,0,0,0.9) !important;
  border: transparent !important;
  -webkit-box-shadow: 2px 2px 8px 0 rgb(0 0 0 / 20%) !important;
  box-shadow: 2px 2px 8px 0 rgb(0 0 0 / 20%) !important;
}
.v-contextmenu .v-contextmenu-item{
  box-sizing: border-box;
  width: 100%;
  color: white !important;
}
.v-contextmenu--dark .v-contextmenu-item--hover{
  background: linear-gradient(to left,rgba(0,0,0,0.9) 50%,#E040FB 100%);
  background-size: 300% 300%;
  animation: superGradient 0.25s ease-in-out;
}

@keyframes superGradient {
  0% {
    background-position: 100% 0%;
  }
  25% {
    background-position: 75% 0%;
  }
  50% {
    background-position: 50% 0%;
  }
  75% {
    background-position: 25% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}



</style>
