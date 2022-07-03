<template>
<div :class = "checked? 'stage checked' : 'stage'" @dblclick = "choose" @click = "beSelectedByOutClick" :draggable="!isSharedMode" @dragstart = "dragImageChange" @dragenter = "handleDropEvent" @drag = 'aaa' @dragend = "aaaClear">
    <div class = "documentBlock">
      <el-checkbox class="selectBox" v-model="checked" @click.native= "beSelected" @change = "SelectInfoSendOut"></el-checkbox>
      <svg class="icon bi" width="40" height="40" :fill="color" :id = "'s'+item.node_id">
        <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + item.content_type"></use>
      </svg>
      <p :id = "isSharedMode?'showNameShared':'showName'">{{ item.file_name }}</p>

      <div v-if = "isSharedMode" class = "sharedAvatar">
        <!--接口需求 base64????-->
        <el-avatar :size="30" :src="touXiangSrc" class = "profileAvatar"></el-avatar>
      </div>
      <div v-if = "isSharedMode" class = "ListInfo">{{item.user_name}}</div>


      <span class = "ListInfo">{{ item.uploadTime}}</span>
      <span class = "ListInfo">{{ item.fileSizeInUnit}}</span>


      <el-button-group  :class = "!isFolder ? '':'folder'">
      <el-button v-if = "!isFolder" :class = "!isSharedMode ? 'ListButton':'ListButton shared'" type="primary" size = "small" icon="bi-cloud-download"  @click.stop = "download"></el-button>
      <el-button v-if = "!isSharedMode" :class = "!isSharedMode ? 'ListButton':'ListButton shared'"  type="danger" size = "small" icon="el-icon-delete" @click.stop = "deleteProgress"></el-button>
        <!--接口需求 分享和移动-->
      <el-button v-else :class = "!isSharedMode ? 'ListButton':'ListButton shared'" type="success" size = "small" @click.stop = "saveVisible = true"><i class = "bi-reply-fill" style="display:inline-block; transform: rotateY(180deg)"></i></el-button>

      </el-button-group>


      <vue-star v-if = "!isSharedMode" ref = "vueStar" class="favorite" animate="animated rubberBand" color="#FFD580">
        <i slot="icon" class="bi-star-fill" @click = "changeFavorite"></i>
      </vue-star>
      <vue-star v-if = "!isSharedMode" ref = "vueShare" class="share" animate="animated rubberBand" color="#92d050">
        <i slot="icon" class="bi-share" @click = "changeShared"></i>
      </vue-star>

      <div v-if = "isDrag && isFolder && !isSelf && !isSharedMode" id="folderDragArea"
           @drop = "dropEvent"
           @dragleave = "dropEventLeave"
           @dragenter = "dropEventEnter"
           @dragover = "dropEventOver"><p style="font-size: 1.5em; text-align: center; color: white">移动到这个文件夹</p></div>
      <div class="dragImgHide" style="font-size: 1.5em; text-align: center; color: white"> 等{{length ===0? length+1 :length}}个文件</div>
  </div>
  <RenameDialog @reload = "reload" @closeRename = "closeRename" :nodeId = "item.node_id" :renameVisible = "renameVisible"></RenameDialog>
  <MoveToDialog ref="moveDialog" @updateTotalBar = "updateTotalBarShell" @reload = "reload" :multiMode = "false" @closeMoveTo = "closeMoveTo" :filename="item.file_name" :nodeId = "item.node_id" :moveVisible = "moveVisible"></MoveToDialog>
  <SaveToDialog ref="saveDialog" @updateTotalBar = "updateTotalBarShell" @reload = "reload" :userId = "item.user_id" :multiMode = "false" @closeMoveTo = "closeMoveTo" :filename="item.file_name" :nodeId = "item.node_id" :moveVisible = "saveVisible"></SaveToDialog>
  <el-dialog
      title=""
      :visible.sync="dialogVisible"
      :append-to-body = "true"
      custom-class = "showData"
      width="60%">
    <div class = "showDialogBlock">
      <svg v-if="isNotImage" class="icon bi" width="60%" height="60%" :fill="color" :id = "'s'+item.node_id">
        <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + item.content_type"></use>
      </svg>
      <img v-else :id = "'ss'+item.node_id" :src="imgSrc" style="width: 95%; height: auto; max-height: 100%; object-fit:contain" >
    </div>
    <div class = "showDialogInfoStage">
      <div class = "showDialogInfoBlock"></div>
      <div class = "showDialogInfoBlock">
        <span class = "info">文件名： {{ item.file_name }}</span>
        <span v-if = "!isSharedMode" class = "info">文件路径： {{ realData.file_path}}</span>
        <span v-else class = "info">分享文件路径： {{ item.share_path}}</span>
        <span class = "info">文件大小： {{ item.fileSizeInUnit}}</span>
        <span class = "info">上传时间： {{ item.uploadTime}}</span>
        <span v-if = "isSharedMode" class = "info">上传人： {{ item.user_name}}</span>
        <span class = "info">文件类型： {{realData.content_type}}</span>
        <div class = "infoButton">
          <Vbotton :isWorking = "false"
                   :clickMethod = "changeDialog"
                   :nameForButton = "'打开'"
                   :isIcon ="false"
                   :vStyle = "'rounded'"></Vbotton>
          <Vbotton v-if= "!isFolder" :isWorking = "false" :clickMethod = "download" :nameForButton = "'下载'" :isIcon ="false" :vStyle = "'rounded'"></Vbotton>
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog
      :title="item.file_name"
      top = "2vh"
      :visible.sync="openDialogVisible"
      v-if="openDialogVisible"
      :append-to-body = "true"
      custom-class = "showData"
      width="90%">
    <div id = "openDialogStage">
      <video v-if = "item.content_type === 'film'" :src="liveSrc" controls autoplay class ="openedInnerBlock video"></video>
      <iframe v-else-if="item.content_type === 'filetype-pdf'" :src="liveSrc" class ="openedInnerBlock text"></iframe>
      <iframe v-else-if="item.content_type === 'filetype-txt'" :src="liveSrc" class ="openedInnerBlock text" ></iframe>
      <iframe v-else :src = "`https://aijiangsb.com:9070/preview/onlinePreview?url=${encodeURIComponent(this.$Base64.encode(liveSrc))}`" class ="openedInnerBlock text" ></iframe>
      <!--iframe v-else :src = "`${this.$addr}/onlinePreview?url=${encodeURIComponent(this.$Base64.encode(liveSrc))}`" class ="openedInnerBlock text" ></iframe-->
    </div>
  </el-dialog>
</div>


</template>

<script>

import Vbotton from "@/components/V-botton";
import VueStar from 'vue-star'
import RenameDialog from "@/components/RenameDialog";
import MoveToDialog from "@/components/MoveToDialog";
import SaveToDialog from "@/components/SaveToDialog";

export default {
  name: "DocumentListMode",
  props: ["item","length","isSharedMode","timeNow"],
  inject:['updateTotalBar'],
  data() {
    return {
      color: "",
      dialogVisible: false,
      openDialogVisible:false,

      isNotImage:true,
      isFav: false,
      isMusic:false,
      isFolder:false,
      isDrag:false,
      isSelf:false,
      isImgChanged:false,
      isMultiSelect:false,
      isShared:false,
      checked:false,

      imgSrc:"",
      liveSrc : "",
      hash:"",
      renameVisible:false,
      moveVisible:false,
      saveVisible:false,
      onlyOneTranscodeError: false,
      realData:{},
      notCheckYet : true,

      touXiangSrc:null,
      supportList:[
        "film",
        "image",
        "filetype-pdf",
        "music-note-beamed",
        "filetype-txt",
        "filetype-docx",
        "filetype-doc",
        "filetype-ppt",
        "filetype-pptx",
        "filetype-doc",
        "file-earmark-zip-fill",
        "filetype-xlsx",
        "filetype-xls",
        "filetype-java",
        "filetype-js",
        "filetype-html",
      ],

    }
  },
  created() {
    switch (this.item.content_type) {
      case "folder-fill":
        this.color = "orange";
        this.isFolder = true;
        break;
      case "filetype-doc":
      case "filetype-docx":
        this.color = "deepskyblue";
        break;
      case "filetype-xlsx":
      case "filetype-xls":
        this.color = "#07ff1c";
        break;
      case "file-earmark":
        this.color = "#afb4cc";
        break;
      case "film":
        this.color = "#0B63F6";
        break;
      case "music-note-beamed":
        this.isMusic = true;
        this.color = "mediumspringgreen";
        break;
      case "file-earmark-zip-fill":
        this.color = "#afd529";
        break;
      case "file-earmark-arrow-down":
        this.color = "green";
        break;
      case "filetype-pdf":
        this.color = "crimson";
        break;
      case "filetype-pptx":
      case "filetype-ppt":
        this.color = "#e76d5e";
        break;
      case "filetype-txt":
        this.color = "#ffffff";
        break;
      case "filetype-js":
        this.color = "#00cb70";
        break;
      case "filetype-java":
        this.color = "#d640e7";
        break;
      case "filetype-html":
        this.color = "#6385ff";
        break;
      case "filetype-json":
        this.color = "#6dab6c";
        break;
      case "image":
        this.color = "#d57bff";
        let suffix = /\.([0-9A-z]+)$/i.exec(this.item.file_name)[1];
        suffix = suffix.toLowerCase();
        this.isNotImage = false;
        this.imgSrc = this.item.base64;
        break;
      default:
        this.color = "grey";
        break;
    }
    if(this.item.isFavorite){
      this.isFav = this.item.isFavorite;
    }
    if(this.item.isShared){
      this.isShared = this.item.isShared;
    }
  },
  mounted() {
    let y = document.getElementById('s'+ this.item.node_id);
    y.style.setProperty("color", this.color, "important");
    if(!this.isSharedMode){
      if(this.item.isFavorite){
        this.$refs.vueStar.$data.active = true;
        this.$refs.vueStar.$data.toggleColor = true;
      }
      if(this.item.isShared){
        this.$refs.vueShare.$data.active = true;
        this.$refs.vueShare.$data.toggleColor = true;
      }
    }

  },

  methods: {
    beSelectedByOutClick(){
      this.checked=!this.checked
      this.SelectInfoSendOut();
    },
    beSelected(e){
      e.stopPropagation();
    },
    SelectInfoSendOut(){
      if(this.checked){
        this.$emit("selected",this.item.node_id);
      }else{
        this.$emit("unSelected",this.item.node_id);
      }
    },
    //被拖拽的目标
    dragImageChange(e){
      this.isSelf = true;
      this.$store.dispatch("updatedraggingIDAsync",this.item.node_id);
      this.$store.commit("changeDragState",true);
      this.isImgChanged = true;
      e.target.children[0].children[8].className = "dragImg";
      e.dataTransfer.setDragImage(e.target, e.target.offsetWidth / 2.5, 45);
    },
    aaa(event){
      if(this.isImgChanged){
        event.target.children[0].children[8].className = "dragImgHide";
        this.isImgChanged = false;
      }
    },
    aaaClear(event){
      event.stopPropagation();
      event.preventDefault();
      this.isSelf = false;
      this.isDrag = false;
      this.$store.commit("updateIsMultiDragging", false);
      this.$store.commit("changeDragState",false);
    },
    //拖拽目的地
    async dropEvent(event) {
      event.stopPropagation();
      event.preventDefault();
      if(!this.$store.state.isMultiDragging){
        await this.$refs.moveDialog.blindMoveTo(this.$store.state.draggingID, this.item.node_id);
        this.isDrag = false;
      }else{
        //placeHolder 批量拖拽移动；
        await this.$refs.moveDialog.multiBlindMoveTo(this.$store.state.draggingIDs, this.item.node_id);
        this.isDrag = false;
      }

    },
    dropEventLeave(event){
      event.stopPropagation();
      event.preventDefault();
      this.isDrag = false;
    },
    dropEventEnter(event){
      event.stopPropagation();
      event.preventDefault();
      this.isDrag = true;
    },
    dropEventOver(event){
      event.stopPropagation();
      event.preventDefault();
      this.isDrag = true;
    },
    handleDropEvent(e){
      e.stopPropagation();
      e.preventDefault();
      if(this.$store.state.isElementDragging){
        this.isDrag = true;
      }else{
        this.$store.commit("updateIsFileDrag",true);
      }
    },


    reload() {
      this.$emit("reload");
    },
    updateTotalBarShell(){
      this.updateTotalBar();
    },
    closeSaveTo(){
      this.saveVisible = false;
    },
    closeMoveTo(){
      this.moveVisible = false;
    },
    closeRename(){
      this.renameVisible = false;
    },
    rename(){
      this.renameVisible = true;
    },
    async changeFavorite(event){
      if(this.isFav){

        let{data:res} = await this.$http.post("/file/favoriteFile", {
              user_id:this.$store.state.user_id,
              node_id:this.item.node_id,
              is_favorites:false
      }).catch((error) => {
          if(error.status !== 401) {
            this.$message.error('收藏删减出现未知问题，请联系Van！ Code:' + error.message);
          }}
        );

        if(res.code === 200){
          await this.$store.dispatch("updateChangeFavIdAsync", this.item.node_id+ "s" + Date.now());

          this.$notify(
              {
                title: '移除收藏成功',
                type: 'error',
                message: `${this.item.file_name}已不再是我所爱！`,
                position: 'bottom-right',
                customClass: "message",
              }
          );
        }
      }else{
        let{data:res} = await this.$http.post("/file/favoriteFile", {
          user_id:this.$store.state.user_id,
          node_id:this.item.node_id,
          is_favorites:true
        }).catch((error) => {
          if(error.status !== 401) {
            this.$message.error('分享删减出现未知问题，请联系Van！ Code:' + error.message);
          }}
        );
        if(res.code === 200){
          await this.$store.dispatch("updateChangeFavIdAsync", this.item.node_id+ "s" + Date.now());

          this.$notify(
              {
                title: '添加收藏成功',
                type: 'success',
                message: `${this.item.file_name}已添加至我的收藏！`,
                position: 'bottom-right',
                customClass: "message",
              }
          );
        }
      }
      this.$emit("listChangeFav",this.item.node_id);
    },
    async changeShared(){
      if(this.isShared){

        let{data:res} = await this.$http.post("/share/shareFile", {
          user_id:this.$store.state.user_id,
          node_id:this.item.node_id,
          is_shared:false
        }).catch((error) => {
          if(error.status !== 401) {
            this.$message.error('分享删减出现未知问题，请联系Van！ Code:' + error.message);
          }}
        );

        if(res.code === 200){
          await this.$store.dispatch("updateChangeSharedIdAsync", this.item.node_id+ "s" + Date.now());
          this.$notify(
              {
                title: '取消分享成功',
                type: 'error',
                message: `${this.item.file_name}不再能被其他镇民访问！`,
                position: 'bottom-right',
                customClass: "message",
              }
          );
        }
      }else{
        let{data:res} = await this.$http.post("/share/shareFile", {
          user_id:this.$store.state.user_id,
          node_id:this.item.node_id,
          is_shared:true
        }).catch((error) => {
          if(error.status !== 401) {
            this.$message.error('分享删减出现未知问题，请联系Van！ Code:' + error.message);
          }}
        );
        if(res.code === 200){
          await this.$store.dispatch("updateChangeSharedIdAsync", this.item.node_id+ "s" + Date.now());
          this.$notify(
              {
                title: '分享成功',
                type: 'success',
                message: `${this.item.file_name}已经分享至大咕咕广场，可被所有镇民访问！`,
                position: 'bottom-right',
                customClass: "message",
              }
          );
        }
      }
      this.$emit("listChangeShare",this.item.node_id);
    },
   deleteProgress(){
      this.$confirm('你确定是否删除该文件？', '你确定吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '算了',
        type: 'warning'
      }).then(async () => {
        let {data: res} = await this.$http.post("/file/deleteFile",
            {
              user_id: this.$store.state.user_id,
              node_id: this.item.node_id,
            }
        ).catch((error) => {
          if(error.status !== 401) {
            this.$message.error('删除出现未知问题，请联系Van！ Code:' + error.message);
          }}
        );

        if (res.code === 200) {
          this.$emit("reload");
          this.updateTotalBar();
          this.$notify(
              {
                title: '删除文件成功',
                type: 'success',
                message: `${this.item.file_name}已被删除！`,
                position: 'bottom-right',
                customClass: "message",
              }
          );
        }
      }).catch(() => {
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
    },
   async changeDialog(){
      if(this.supportList.indexOf(this.item.content_type) !== -1){
        const loading = this.$loading({
          lock: true,
          text: '正在加载，请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(!this.isNotImage){
          this.$emit("openPicViewer",this.item.node_id,loading);
          this.dialogVisible = false;
        }
        else if(this.isMusic){
          this.$socket.emit("addNewSong",this.item.node_id,localStorage.loginToken,(this.isSharedMode ? this.item.user_id : this.$store.state.user_id));
          this.dialogVisible = false;
          await this.$store.dispatch('musicState/isListPlayAsync',true);
          await this.$store.dispatch('musicState/isOnlyAddToListAsync', true);
          loading.close();
        }
        else{
          loading.close();
          await this.getOpenHash();
          if(this.onlyOneTranscodeError === true){
            this.$notify({
              title: '不要再给服务器徒增压力了！',
              type: 'error',
              message: '一次只能有一个后台转码任务，请耐心等待之前的转码完成后再尝试新的转码,如果你想要在线观看番剧与电影，建议移步至Jellyfin VanIsLord',
              position: 'bottom-right',
              customClass: "message",
            });
            this.onlyOneTranscodeError = false;
            return;
          }
          //this.liveSrc = `https://aijiangsb.com:9070/api/vopen/${this.hash}?token=${localStorage.loginToken}`;
          if(this.item.content_type === 'filetype-txt' || this.item.content_type === 'film'||this.item.content_type === 'filetype-pdf'){
            this.liveSrc = `${this.$addr}/vopen/${this.hash}?token=${localStorage.loginToken}&fullfilename=${this.item.file_name}`;
          }
          else{
            this.liveSrc = `http://172.17.0.1:9090/vopen/${this.hash}?token=${localStorage.loginToken}&fullfilename=${this.item.file_name}`;
          }
          //this.liveSrc = `http://192.168.1.143:9090/vopen/${this.hash}?token=${localStorage.loginToken}`;
          //loading.close();
          this.dialogVisible = false;
          this.openDialogVisible = true;

        }

      }else if(this.isFolder){
        if(this.isSharedMode){
          if(this.$route.fullPath.includes('/mainpage/shareAll')){
            this.$emit("needRedirect","/mainpage/shareAll" + this.item.share_path);
          }
          else{
            this.$emit("needRedirect","/mainpage/shareUser" + this.item.share_path);
          }
        }
        else{
          this.$emit("needRedirect","/mainpage/disk" +  this.item.file_path);
        }
      }
      else{
        this.$notify(
          {
            title: '暂不支持该类型文件在线预览',
                type: 'error',
              message: `${this.item.file_name}暂不支持在线预览，请等待后续更新或者卖糕的上帝出现`,
              position: 'bottom-right',
              customClass: "message",
          }
        );
      }
    },

    async choose(event) {
      if (this.isFolder) {
        if(this.isSharedMode){
          if(this.$route.fullPath.includes('/mainpage/shareAll')){
            this.$emit("needRedirect","/mainpage/shareAll" + this.item.share_path);
          }
          else{
            this.$emit("needRedirect","/mainpage/shareUser" + this.item.share_path);
          }
        }
        else{
          this.$emit("needRedirect","/mainpage/disk" +  this.item.file_path);
        }
      }else{
        //await this.detailCheck()
        await this.changeDialog();
      }
    },
    async detailCheck(){
      let userId = this.$store.state.user_id;
      if(this.notCheckYet){
        if(this.isSharedMode){
          userId = this.item.user_id;
        }
        const loading = this.$loading({
          lock: true,
          text: '正在加载，请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let {data:res} = await this.$http.get("/file/detail",{
          params:{
            user_id:userId,
            node_id:this.item.node_id,
          }
        }).catch((error) => {
          loading.close();
          if(error.status !== 401) {
            this.$message.error('转码出现未知问题，请联系Van！ Code:' + error.message);
          }
        });

        if(res.code === 200){
          loading.close();
          this.realData = res.data;
          this.realData.content_type = this.realData.content_type  === 'folder' ? '文件夹' : this.realData.content_type.toUpperCase() + ' 文件';
          this.dialogVisible = true;
          this.notCheckYet = false;
        }
      }else{
        loading.close();
        this.dialogVisible = true;
      }
    },


    async imageGetMD5andUrl(){
      await this.getHash();
      //this.liveSrc = `http://192.168.1.169:9090/vopen/${this.hash}?token=${localStorage.loginToken}`;
      this.liveSrc = `${this.$addr}/vopen/${this.hash}?token=${localStorage.loginToken}`;
      return this.liveSrc;
    },
    // async downloadRequest(){
    //   await this.$http.get("/file/download",
    //       {
    //         params:{
    //           user_id:this.$store.state.user_id,
    //           node_id:this.item.node_id,
    //         },
    //         responseType: 'blob',
    //         headers:{
    //           "Range": "bytes=0-",
    //           "Cache-control":"max-age=3600",
    //         }
    //       }
    //
    //   ).then((data) => {
    //     //createObjectURL返回一段带hash的url，并且一直存储在内存中，直到document触发了unload事件
    //     this.liveSrc = window.URL.createObjectURL(data.data);
    //   });
    //
    // },

    async getOpenHash(){
      let userId;
      if(this.isSharedMode){
        userId = this.item.user_id;
      }else{
        userId = this.$store.state.user_id;
      }
      const loading = this.$loading({
        lock: true,
        text: '正在获取链接，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let{data : res}= await this.$http.get("/file/getOpenMd5",{
        params:{
          user_id:userId,
          node_id:this.item.node_id,
        },
      });
      if(res.code === 200){
        loading.close()
        this.hash = res.data;
      }
      else if(res.code === 300){
        let str = res.data.codec;
        switch (str){
          case 'h264':
            if(this.$store.state.videoFormatCheck.h264){
              loading.close()
              this.hash = res.data.hash;
              break;
            }else {
              loading.close()
              await this.transcode();
              break;
            }
          case 'hevc':
            if(this.$store.state.videoFormatCheck.hevc){
              loading.close()
              this.hash = res.data.hash;
              break;
            }else {
              loading.close()
              await this.transcode();
              break;
            }
          case 'vp9':
            if(this.$store.state.videoFormatCheck.vp9){
              loading.close()
              this.hash = res.data.hash;
              break;
            }else {
              loading.close()
              await this.transcode();
              break;
            }
          case 'vp8':
            if(this.$store.state.videoFormatCheck.vp8){
              loading.close()
              this.hash = res.data.hash;
              break;
            }else {
              loading.close()
              await this.transcode();
              break;
            }
          case 'theora':
            if(this.$store.state.videoFormatCheck.ogg){
              loading.close()
              this.hash = res.data.hash;
              break;
            }else {
              loading.close()
              await this.transcode();
              break;
            }
          case 'mpeg4':
            if(this.$store.state.videoFormatCheck.mpeg4){
              loading.close()
              this.hash = res.data.hash;
              break;
            }else {
              loading.close()
              await this.transcode();
              break;
            }
          default:
            loading.close()
            await this.transcode();
        }

      }
    },
    async transcode(){
      const loading = this.$loading({
        lock: true,
        text: '侦测到不支持的解码格式，正在转码中.. ' +
            ' 当然你也可以选择刷新，现在打开的视频依旧会在后台继续转码，届时即可观看！ '
            + ' 注意！在后台一次只能有一个转码任务！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await this.$http.get("/file/transcode",{
        params:{
          user_id:this.$store.state.user_id,
          node_id:this.item.node_id,
        },
      }).then((data) =>
      {
        if(data.data.code === 200){
          this.hash = data.data.data
          loading.close();
        }
        else if(data.data.code === 457){
          loading.close();
          this.onlyOneTranscodeError = true;
        }
      }).catch((error) => {
        loading.close();
        if(error.status !== 401) {
          this.$message.error('转码出现未知问题，请联系Van！ Code:' + error.message);
        }
      });
    },
    async getHash(){
      let userId;
      if(this.isSharedMode){
        userId = this.item.user_id;
      }else{
        userId = this.$store.state.user_id;
      }
      let{data : res}= await this.$http.get("/file/getMd5",{
        params:{
          user_id:userId,
          node_id:this.item.node_id,
        },
      });
      if(res.code === 200){
        this.hash = res.data;
      }
    },

    async download() {
        await this.getHash();
        const a = document.createElement('a');
        a.download = `nmsl + ${this.item.file_name}`;
      //a.href = `https://aijiangsb.com:9070/api/vdownload/${this.hash}?token=${localStorage.loginToken}`;
      a.href = `${this.$addr}/vdownload/${this.hash}?token=${localStorage.loginToken}`;
      await a.click();
      a.remove();
    }
  },
  components:{
    MoveToDialog,
    RenameDialog,
    Vbotton,
    VueStar,
    SaveToDialog,
  },
  computed:{
    FavIdMonitor(){
      return this.$store.state.changeFavId;
    },
    SharedIdMonitor(){
      return this.$store.state.changeSharedId;
    }
  },
  watch:{
    FavIdMonitor:{
      handler(val){
        let realVal = Number(val.slice(0,val.indexOf("s")));
        if(realVal === this.item.node_id){
          this.isFav = !this.isFav;
        }
      }
    },
    SharedIdMonitor:{
      handler(val){
        let realVal = Number(val.slice(0,val.indexOf("s")));
        if(realVal === this.item.node_id){
          this.isShared = ! this.isShared;
        }
      }
    },
    'isSharedMode':{
      handler(val){
        //this.touXiangSrc = `http://192.168.1.169:9090/vavatar/${this.item.user_id}?token=${localStorage.loginToken}&time=${this.timeNow}`;
        this.touXiangSrc = `${this.$addr}/vavatar/${this.item.user_id}?token=${localStorage.loginToken}&time=${this.timeNow}`;
      },
      immediate:true,
    },
    'isFav':{
      handler(val){
        if(!this.isSharedMode){
          if(val){
            this.$refs.vueStar.$data.active = true;
            this.$refs.vueStar.$data.toggleColor = true;
          }
          else{
            this.$refs.vueStar.$data.active = false;
            this.$refs.vueStar.$data.toggleColor = false;
          }
        }
      },
    },
    'isShared':{
      handler(val){
        if(!this.isSharedMode) {
          if (val) {
            this.$refs.vueShare.$data.active = true;
            this.$refs.vueShare.$data.toggleColor = true;
          } else {
            this.$refs.vueShare.$data.active = false;
            this.$refs.vueShare.$data.toggleColor = false;
          }
        }
      },
    },
  }

}
</script>

<style scoped>
@property --rotate {
  syntax: "<angle>";
  initial-value: 132deg;
  inherits: false;
}

.infoButton{
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
#folderDragArea{
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px dashed #9055FF;
  animation: light 5s linear infinite;
  background-color: rgba(30, 30, 30, 0.95);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

@keyframes light {
  0% {filter: hue-rotate(0deg);}
  50% {filter: hue-rotate(90deg);}
  100% {filter: hue-rotate(0deg);}
}
.documentBlock{
  position: absolute;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: #252830;
  display: flex;
  align-items:center;
  transition: all 0.3s ease-in-out;

}

.stage{
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
.stage:hover{
z-index: 99999;

  }

  .stage::before {
    content: "";
    width: 100%;
    height: 106%;
    z-index: -1;
    position: absolute;

    animation: none;
    opacity: 1;

    transition: opacity 0.3s;
    border-bottom: 1px solid #3b3a3a;


  }

  .stage::after {
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;

    /*filter: blur(calc(175px / 6));*/
    filter: blur(calc(50px / 6));
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
.stage.checked:before {
  width: 100.5%;
  border-radius: 8px;
  background-image: linear-gradient(
      var(--rotate)
      , #5ddcff, #3c67e3 43%, #4e00c2);
  top: -3%;
  left: -0.25%;
  border: none;
  animation: spin 2.5s linear infinite;
  opacity: 1;
}
.stage.checked:after {
  animation: spin 2.5s linear infinite;
  opacity: 1;
}
.stage:hover:before {
  width: 100.5%;
  border-radius: 8px;
  background-image: linear-gradient(
      var(--rotate)
      , #5ddcff, #3c67e3 43%, #4e00c2);
  top: -3%;
  left: -0.25%;
  border: none;
  animation: spin 2.5s linear infinite;
  opacity: 1;
}
.stage:hover:after {
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

.ListInfo{
  width: 5%;
  flex-grow: 0.5;
  color: white;

  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size:0.95em;

}

.icon{
  margin: 0 10px;

}
.sharedAvatar{
  margin-right: 10px;
}
.ListButton{
  margin: 0 75px 0 20px;
  border: none;

}
.ListButton.shared{
  margin: 0 40px 0 20px;
  border: none;
}
.folder{
  margin: 0 20px 0 20px;
}
#showName{
color: white;
margin: 2px;
width: 50%;
font-size:0.95em;
overflow: hidden;
text-overflow: ellipsis;
word-break: keep-all;
font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
flex-grow: 1;

}
#showNameShared{
  color: white;
  margin: 2px;
  width: 40%;
  font-size:0.95em;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  flex-grow: 1;
}

.showDialogInfoStage{
  width: 100%;
  height: 600px;
  display: flex;
}
.showDialogInfoBlock{
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.openedInnerBlock{
  width: 100%;
  height: auto;
}
.openedInnerBlock.video{
  max-height: 80vh;
}

.openedInnerBlock.image{
  max-height: 80vh;
  object-fit: contain;
}
.openedInnerBlock.music{
  height: 100px;
}
.openedInnerBlock.text{
  height: 100vh;
  background-color: white;
}

#openDialogStage{
  width: 100%;

}
.showDialogInfoBlock .info{
  width: 80%;
  font-size: 1.2em;
}
.showDialogBlock{
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 20px;
  background-color: #252830;
  /*
  box-shadow: 10px 0 20px -10px red;
   */
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

}
.showDialogBlock::before {
  content: "";
  width: 102%;
  height: 101%;
  z-index: -1;
  position: absolute;
  border-radius: 20px;
  background-image: linear-gradient(
      var(--rotate)
      , #5ddcff, #3c67e3 43%, #4e00c2);

  top: -0.5%;
  left: -1%;
  animation: spin 2.5s linear infinite;

}
.showDialogBlock::after{
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

.favorite{
  position: absolute;
  top:-25px;
  right: -35px;
}
.share{
  position: absolute;
  top:-25px;
  right: -5px;
}
.selectBox{
  margin-left: 10px;
}
.dragImg{
  position: absolute;
  top:-30px;
  right: 700px;
}
.dragImgHide{
  position: absolute;
  display: none;
}
</style>

<style>
.showData{
  z-index: -1;
  background-color: #444857 !important;
  border-radius: 20px !important;
}

.showData .el-dialog__title{
  color: white !important;
}

.showData .el-dialog__body{
  color: white !important;
}

.VueStar__ground .VueStar__icon{
  color: #565555;
}

</style>