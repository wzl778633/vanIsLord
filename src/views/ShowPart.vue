<template>
  <div class = "mainShell">

    <FakeHeader v-if = "isList && !isSharedMode" @sortByName = "sortBy(0)" @sortByTime = "sortBy(1)" @sortBySize = "sortBy(2)" :nameState = "nameCounter" :sizeState = "sizeCounter" :timeState = "timeCounter"></FakeHeader>
    <FakeHeader v-if = "isList && isSharedMode" :isSharedMode="true" @sortByName = "sortBy(0)" @sortByTime = "sortBy(1)" @sortBySize = "sortBy(2)" @sortByUser = "sortBy(3)" :nameState = "nameCounter" :sizeState = "sizeCounter" :timeState = "timeCounter" :userState = "userCounter"></FakeHeader>
    <overlay-scrollbars   :class = "isList ? 'withHeader':'noHeader'" :options = "defaultStyle">
      <div id ="ccc">
        <DocumentList id = "dList" :itemList="items" @pass = "whichDecode" @reload = "reloadPass" :isSharedMode ="isSharedMode" :isList = "isList" ref="list"></DocumentList>
      </div>
    </overlay-scrollbars>
  </div>
</template>

<script>
import DragArea from "@/components/DragArea.vue"
import DocumentList from "@/components/DocumentList.vue"

import { mapState } from 'vuex'
import axios from "axios";
import FakeHeader from "@/components/FakeHeader";

export default {
  name: "ShowPart",
  props:["isList","isSharedMode"],
  data(){
    return{

      items:[],
      api:"",
      nameCounter:0,
      timeCounter:0,
      sizeCounter:0,
      userCounter:0,
      loading:null,
      allListFlag : false,
      defaultStyle: {
        className: 'os-theme-thick-light',
        overflowBehavior : {
          x : "hidden",
        },
        scrollbars: { autoHide : "leave",
        },

      }
    }
  },
  components:{
    FakeHeader,
    DragArea,
    DocumentList,
  },
  methods:{
    passSelectInfo(flag){
      this.$refs.list.selectALL(flag);
    },
    sortBy(i){
      //name
      if(i === 0){
        if(this.nameCounter === 0){
          this.items.sort(function (x,y){
            if (x.file_name > y.file_name) {
              return -1;
            }
            if (y.file_name > x.file_name) {
              return 1;
            }
            return 0;
          });
          this.nameCounter++;
        }else if(this.nameCounter === 1){
          this.items.sort(function (x,y){
            if (x.file_name > y.file_name) {
              return 1;
            }
            if (y.file_name > x.file_name) {
              return -1;
            }
            return 0;
          });
          this.nameCounter--;
        }
      }
      //time
      else if(i === 1){
        if(this.timeCounter === 0){
          this.items.sort(function (x,y){
            if (x.uploadTime > y.uploadTime) {
              return -1;
            }
            if (y.uploadTime> x.uploadTime) {
              return 1;
            }
            return 0;
          });
          this.timeCounter++;
        }else if(this.timeCounter === 1){
          this.items.sort(function (x,y){
            if (x.uploadTime > y.uploadTime) {
              return 1;
            }
            if (y.uploadTime > x.uploadTime) {
              return -1;
            }
            return 0;
          });
          this.timeCounter--;
        }
      }
      //size need rework
      else if(i === 2){
        if(this.sizeCounter === 0){
          this.items.sort(function (x,y){
            if (x.fileSize > y.fileSize) {
              return -1;
            }
            if (y.fileSize > x.fileSize) {
              return 1;
            }
            return 0;
          });
          this.sizeCounter++;
        }else if(this.sizeCounter === 1){
          this.items.sort(function (x,y){
            if (x.fileSize > y.fileSize) {
              return 1;
            }
            if (y.fileSize > x.fileSize) {
              return -1;
            }
            return 0;
          });
          this.sizeCounter--;
        }
      }
      //user
      else if(i === 3){
        if(this.userCounter === 0){
          this.items.sort(function (x,y){
            if (x.user_name > y.user_name) {
              return -1;
            }
            if (y.user_name > x.user_name) {
              return 1;
            }
            return 0;
          });
          this.userCounter++;
        }else if(this.userCounter === 1){
          this.items.sort(function (x,y){
            if (x.user_name > y.user_name) {
              return 1;
            }
            if (y.user_name > x.user_name) {
              return -1;
            }
            return 0;
          });
          this.userCounter--;
        }
      }
    },
    reloadPass(){
      this.$emit("reload");
    },
    updateItems(){
      this.items.splice(0, this.items.length);
      //setTimeout (() => {
      for(let element of this.rightNowFileList){
        this.items.push(element);
      }
      //}, 350);
    },

    async requestOn(){
      let userId;
      if(this.isSharedMode){
        if(this.allListFlag){
          userId = 0;
        }else{
          userId = this.$store.state.share_user_id;
        }
      }else{
        userId =  this.$store.state.user_id;
      }
      this.loading = this.$loading({
        target:".mainShell",
        lock: true,
        fullscreen:false,
        text: '正在加载，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let {data: res} = await this.$http.post(
          `${this.api}`,
          {
            "user_id": userId,
            "real_user_id": this.$store.state.user_id,
          },
      ).catch((error) => {
          this.loading.close();
            if(error.status !== 401) {
              this.$message.error('文件查询出现未知问题，请联系Van！ Code:' + error.message);
            }
      });
      if(res.code == 200){
        this.$store.commit("updateFileList",res.data.content);
        this.updateItems();
        this.loading.close();
        }

    },

    whichDecode(path){
      if(this.isSharedMode){
        this.sharedDecode(path);
      }
      else{
        this.decode(path);
      }
    },

    async sharedDecode(path){
      let allListFlag = false;
      this.$store.commit("updatePath",path);
      let arr = path.split("/");
      arr = arr.slice(3,arr.length);
      if(arr[0] === 'board 全部文件'){
        allListFlag = true;
      }
      let result = [];
      this.loading = this.$loading({
        target:".mainShell",
        lock: true,
        fullscreen:false,
        text: '正在加载，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let {data : res} = await this.$http.post(
          "/share/browsePath",
          {
            user_id:this.$store.state.user_id,
            "content": arr,
          },
      ).catch((error) => {
        this.loading.close();
        if(error.status !== 401){
          this.$message.error('路径查询出现未知问题，请联系Van！ Code:' + error.message);
        }

      });
      if(res.code === 200){
        let id;
        for(let i of res.data){
          if(i.user_id || i.user_id === 0){
            id = i.user_id;
          }
          else{
            if(allListFlag){
              i.file_path = "/mainpage/shareAll" +  i.file_path;
              result.push(i);
            }
            else{
              i.file_path = "/mainpage/shareUser" +  i.file_path;
              result.push(i);
            }
          }
        }
        this.$store.commit("updateDecodePath",result);
        this.$store.commit("nowOpenShareUserId",id);
        await this.shareRequestOn(result[result.length-1].node_id, result[result.length-1].file_path,allListFlag);

      }else if(res.code == 453){
        this.loading.close();
        this.$router.push("/404error");
      }

    },

    async shareRequestOn(id = this.$store.state.node_id,filePath,allListFlag){
      let {data: res} = await this.$http.post(
          "/share/query",
          {
            "user_id": this.$store.state.share_user_id,
            "real_user_id": this.$store.state.user_id,
            node_id:Number(id),
            isAll:allListFlag,
          },
      ).catch((error) => {
        if(error.status !== 401) {
          this.$message.error('文件夹查询出现未知问题，请联系Van！ Code:' + error.message);
        }
      });
      if(res.code == 200){
        this.$store.commit("updateDirList",res.data[0]);
        this.$store.commit("updateFileList",res.data[1]);
        //this.updateItems();
        if(filePath === this.$route.fullPath){
          this.updateItems();
        }else{
          this.$router.push(this.$store.state.currentPath);
          this.updateItems();
        }
        this.loading.close();
      }
    },
    async decode(path){
      this.$store.commit("updatePath",path);
      let arr = path.split("/");
      arr = arr.slice(3,arr.length);
      let result = [];
      this.loading = this.$loading({
        target:".mainShell",
        lock: true,
        fullscreen:false,
        text: '正在加载，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let {data : res} = await this.$http.post(
          "/file/browsePath",
          {
            "user_id": this.$store.state.user_id,
            "content": arr,
          },
      ).catch((error) => {
        this.loading.close();
            if(error.status !== 401) {
              this.$message.error('路径查询出现未知问题，请联系Van！ Code:' + error.message);
            }
      });
      if(res.code == 200){
        for(let i of res.data){
          i.file_path = "/mainpage/disk" +  i.file_path;
          result.push(i);
        }
        this.$store.commit("updateDecodePath",result);
        await this.dirRequestOn(result[result.length-1].node_id, result[result.length-1].file_path);

      }else if(res.code == 453){
        this.loading.close();
        this.$router.push("/404error");
      }

    },

    async dirRequestOn(id = this.$store.state.node_id,filePath){
      let {data: res} = await this.$http.post(
          "/file/query",
          {
            "user_id": this.$store.state.user_id,
            "node_id": Number(id),
          },
      ).catch((error) => {
        this.loading.close();
        if(error.status !== 401) {
          this.$message.error('文件夹查询出现未知问题，请联系Van！ Code:' + error.message);
        }
      });
      if(res.code == 200){
        this.$store.commit("updateDirList",res.data[0]);
        this.$store.commit("updateFileList",res.data[1]);
        if(filePath === this.$route.fullPath){
          this.updateItems();
        }else{
          this.$router.push(this.$store.state.currentPath);
          this.updateItems();
        }
        this.loading.close();
      }
    },
  },
  computed:{
    ...mapState(["rightNowDirList"]),
    ...mapState(["rightNowFileList"]),
    monitor(){
      return this.$route.fullPath;
    }
  },
  watch:{
    monitor:{
      handler(){
        switch (this.$route.fullPath) {
          case "/mainpage/my_picture":
            this.api = "/file/queryImage";
            break;
          case "/mainpage/my_video":
            this.api = "/file/queryFilm";
            break;
          case "/mainpage/my_favorite":
            this.api = "/file/queryFavorites";
            break;
          case "/mainpage/my_share":
            this.api = "/file/queryShare";
            break;
          case "/mainpage/my_music":
            this.api = "/file/queryMusic";
            break;
          default:
            this.api = "/file/queryImage";
            break;
        }

        if(this.$route.fullPath.includes("/mainpage/shareAll")){
          this.allListFlag = true;
          if(this.$route.fullPath.includes("picture:union")){
            this.api = "/share/queryImage";
          }else if(this.$route.fullPath.includes("video:union")){
            this.api = "/share/queryVideo";
          }else if(this.$route.fullPath.includes("music:union")){
            this.api = "/share/queryMusic";
          }
        }else if(this.$route.fullPath.includes("/mainpage/shareUser")){
          this.allListFlag = false;
          if(this.$route.fullPath.includes("picture:union")){
            this.api = "/share/queryImage";
          }else if(this.$route.fullPath.includes("video:union")){
            this.api = "/share/queryVideo";
          }else if(this.$route.fullPath.includes("music:union")){
            this.api = "/share/queryMusic";
          }
        }

        this.requestOn();
      },
      immediate:true
    }
  },


}
</script>

<style scoped>
*{
  margin:0px;
  padding:0px;

}
.mainShell{
  width: 100%;
  height:100%;
  position: relative;


}

.withHeader{
  width: 100%;
  height:calc(100vh - 150px);
  box-sizing: border-box;
  padding: 5px 20px 20px 20px;
}
.noHeader{
  width: 100%;
  height:calc(100vh - 110px);
  box-sizing: border-box;
  padding: 20px;
}

#ccc{
  box-sizing: border-box;
  width: 100%;
  padding-bottom: 170px;
}


</style>