<template>
<div class = "stage" @click = "choose" v-contextmenu:contextmenu>
    <div class = "documentBlock" @mouseenter = "changeHeight" @mouseleave = "recover">
      <vue-star ref = "vueStar" class="favorite" animate="animated rubberBand" color="#FFD580">
        <i slot="icon" class="bi-star-fill" @click = "changeFavorite"></i>
      </vue-star>
      <svg v-if="isNotImage" class="icon bi" width="80" height="80" :fill="color" :id = "'s'+item.node_id">
        <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + item.content_type"></use>
      </svg>
      <img v-else :id = "'s'+item.node_id" :src="imgSrc" style="width: 140px; height: 80px; object-fit: cover" >
      <p id = "showName">{{ item.file_name }}</p>
  </div>
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
      <img v-else :id = "'s'+item.node_id" :src="imgSrc" style="width: 95%; height: auto; object-fit:contain" >
    </div>
    <div class = "showDialogInfoStage">
      <div class = "showDialogInfoBlock"></div>
      <div class = "showDialogInfoBlock">
        <span class = "info">文件名： {{ item.file_name }}</span>
        <span class = "info">文件大小： FileSize</span>
        <span class = "info">最后修改时间： FileSize</span>
        <span class = "info">文件类型： FileSize</span>
        <div class = "infoButton">
          <Vbotton :isWorking = "false" :clickMethod = "changeDialog" :nameForButton = "'打开'" :isIcon ="false" :vStyle = "'rounded'"></Vbotton>
          <Vbotton :isWorking = "false" :clickMethod = "download" :nameForButton = "'下载'" :isIcon ="false" :vStyle = "'rounded'"></Vbotton>
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
      width="80%">
    <div id = "openDialogStage">
      <video v-if = "item.content_type == 'film'" :src="liveSrc" controls autoplay class ="openedInnerBlock"></video>
      <iframe v-else-if="item.content_type == 'filetype-pdf'" :src="liveSrc" class ="openedInnerBlock text"></iframe>
      <iframe v-else-if="item.content_type == 'filetype-txt'" :src="liveSrc" class ="openedInnerBlock text" ></iframe>
      <audio v-else-if= "item.content_type == 'music-note-beamed'" :src="liveSrc"  controls autoplay class ="openedInnerBlock music"></audio>
      <img v-else-if= "item.content_type == 'image'" :src="liveSrc" alt="opened picture" class ="openedInnerBlock image">
    </div>
  </el-dialog>

  <v-contextmenu ref="contextmenu" theme="dark">
    <v-contextmenu-item @click = "changeDialog"><i class = "bi-check2-circle"></i> 打开</v-contextmenu-item>
    <v-contextmenu-item @click = "download"><i class = "bi-cloud-download"></i> 下载</v-contextmenu-item>
    <v-contextmenu-item><i class = "bi-box-arrow-up-left"></i> 移动到...</v-contextmenu-item>
    <v-contextmenu-item @click = "deleteProgress"><i class = "bi-trash3"></i> 删除</v-contextmenu-item>
    <v-contextmenu-item v-if = "!this.isFav" @click = "changeFavorite"><i class = "bi-star-fill"></i> 加入收藏</v-contextmenu-item>
    <v-contextmenu-item v-else @click = "changeFavorite"><i class = "bi-star"></i> 取消收藏</v-contextmenu-item>
  </v-contextmenu>
</div>


</template>

<script>

import Vbotton from "@/components/V-botton";
import VueStar from 'vue-star'

export default {

  name: "Document",
  props: ["item"],
  inject:['reload'],
  data() {
    return {
      color: "",
      dialogVisible: false,
      openDialogVisible:false,
      isNotImage:true,
      isFav: false,
      imgSrc:"",
      liveSrc : "",
      hash:"",
    }
  },
  created() {
    switch (this.item.content_type) {
      case "folder-fill":
        this.color = "orange";
        break;
      case "filetype-doc":
      case "filetype-docx":
        this.color = "deepskyblue";
        break;
      case "file-earmark":
        this.color = "grey";
        break;
      case "film":
        this.color = "#0B63F6";
        break;
      case "music-note-beamed":
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
      case "image":
        this.color = "#d57bff";
        const suffix = /\.([0-9A-z]+)$/i.exec(this.item.file_name)[1];
        if(this.item.base64){
          if(suffix == "png"){
            this.isNotImage = false;
            this.imgSrc = "data:image/png;base64," + this.item.base64;
          }else if(suffix == "jpeg" || suffix == "jpg"){
            this.isNotImage = false;
            this.imgSrc = "data:image/jpeg;base64," + this.item.base64;
          }else if(suffix == "gif"){
            this.isNotImage = false;
            this.imgSrc = "data:image/gif;base64," + this.item.base64;
          }else if(suffix == "ico"){
            this.isNotImage = false;
            this.imgSrc = "data:image/gif;base64," + this.item.base64;
          }
        }
        break;
      default:
        this.color = "black";
        break;
    }
    if(this.item.isFavorite){
      this.isFav = this.item.isFavorite;
    }
  },
  mounted() {
    let y = document.getElementById('s'+ this.item.node_id);
    y.style.setProperty("color", this.color, "important");
    if(this.item.isFavorite){
      this.$refs.vueStar.$data.active = true;
      this.$refs.vueStar.$data.toggleColor = true;
    }
  },

  methods: {
    change(){
      this.reload();
    },
    async changeFavorite(event){
      if(this.isFav){

        let{data:res} = await this.$http.post("/file/favoriteFile", {
              user_id:this.$store.state.user_id,
              node_id:this.item.node_id,
              is_favorites:false
      });

        if(res.code === 200){
          this.isFav = false;
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
        });
        if(res.code === 200){
          this.isFav = true;
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
    },
    deleteProgress(){
      this.$confirm('你确定是否删除该文件？', '你确定吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '算了',
        type: 'warning'
      }).then(() => {
        let {data:res} = this.$http.post("/file/deleteFile",
            {
              user_id:this.$store.state.user_id,
              node_id:this.item.node_id,
            }
        );

        if(res.code === 200){
          if(this.item.content_type == "folder-fill" ){
            this.$store.commit("deleteFile",this.item.node_id);
          }else{
            this.$store.commit("deleteFolder",this.item.node_id);
          }

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
      if(this.item.content_type == "film"||this.item.content_type == "image"||this.item.content_type == "filetype-pdf"||this.item.content_type == "music-note-beamed"||this.item.content_type == "filetype-txt"){

        if(this.item.content_type == "image"){
          await this.downloadRequest();
          this.dialogVisible = false;
          this.openDialogVisible = true;
        }
        else{
          await this.getHash();
          this.liveSrc = `http://192.168.1.143:9090/vopen/${this.hash}`;
          this.dialogVisible = false;
          this.openDialogVisible = true;
        }

      }else{
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
      if (this.item.content_type == "folder-fill") {
           this.$emit("needRedirect","/mainpage/disk" + this.item.file_path);
      }else{
        this.dialogVisible = true;
      }
    },
    changeHeight(event){
      let c = event.target;
      let doc = c.parentNode;

      if(c.clientHeight !== 180){
        c.style.gridTemplateRows = "0.5fr 1fr";
        doc.style.transition = "all 0s";
      }
      doc.style.height = c.clientHeight + "px";



    },
    recover(event){
      let c = event.target;
      let doc = c.parentNode;
      doc.style.height = "100%";

        c.style.gridTemplateRows = "1fr 1fr";
        doc.style.transition = "all 0.3s ease-in-out";

    },

    async downloadRequest(){
      await this.$http.get("/file/download",
          {
            params:{
              user_id:this.$store.state.user_id,
              node_id:this.item.node_id,
            },
            responseType: 'blob',
            headers:{
              "Range": "bytes=0-",
            }
          }

      ).then((data) => {
        let blobUrl = window.URL.createObjectURL(data.data);
        this.liveSrc = blobUrl;
      });

    },


    async getHash(){
      let{data : res}= await this.$http.get("/file/getMd5",{
        params:{
          user_id:this.$store.state.user_id,
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
        a.href = `http://192.168.1.143:9090/vdownload/${this.hash}`;
        a.click();
    }
  },
  components:{
    Vbotton,
    VueStar
  },

  watch:{
    'isFav':{
      handler(val){
        if(val){
          this.$refs.vueStar.$data.active = true;
          this.$refs.vueStar.$data.toggleColor = true;
        }
       else{
          this.$refs.vueStar.$data.active = false;
          this.$refs.vueStar.$data.toggleColor = false;
        }
      },
    }
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
.documentBlock{
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
/*
display: flex;
flex-direction: column;
justify-content: space-around;
align-items: center;

 */
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
transform: scale(1.2);


}

.stage::before {
  content: "";
  width: 104%;
  height: 102%;
  z-index: -1;
  position: absolute;
  animation: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.stage::after {
  z-index: -1;
  height: 100%;
  width: 100%;
position: absolute;
content: "";
animation: none;
opacity: 0;
transition: opacity 0.3s;
}

.stage:hover:before {
  border-radius: 8px;
  background-image: linear-gradient(
      var(--rotate)
      , #5ddcff, #3c67e3 43%, #4e00c2);

  top: -1%;
  left: -2%;
animation: spin 2.5s linear infinite;
opacity: 1;
}

.stage:hover:after {
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  transform: scale(0.9);
  filter: blur(calc(175px / 6));
  background-image: linear-gradient(
      var(--rotate)
      , #5ddcff, #3c67e3 43%, #4e00c2);

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

.stage:hover .documentBlock{

  height: auto;
  min-height: 180px;
  max-height: fit-content;


}



#showName{
color: white;
margin: 2px;
width: 80%;
text-align: center;
font-size:0.9em;
overflow: hidden;
text-overflow: ellipsis;
-webkit-line-clamp: 3;
word-break: break-word;
  transition: all 0.3s ease-in-out;
display: -webkit-box;
-webkit-box-orient: vertical;




}
.stage:hover #showName{
  overflow: visible;
  text-overflow: unset;
  display: block;
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

.openedInnerBlock.image{
  object-fit: contain;
}
.openedInnerBlock.music{
  height: 100px;
}
.openedInnerBlock.text{
  height: 800px;
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

  top:-38px;
  right: -38px;
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
</style>