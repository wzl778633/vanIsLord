<template>
  <div class = "mainShell">
    <overlay-scrollbars  :options = "defaultStyle" style=" width: 100%; height:calc(100vh - 100px); box-sizing: border-box;
  padding: 20px;">
      <div id ="ccc">
        <DocumentList id = "dList" :itemList="items" @pass = "decode"></DocumentList>
      </div>
    </overlay-scrollbars>
  </div>
</template>

<script>
import DragArea from "@/components/DragArea.vue"
import DocumentList from "@/components/DocumentList.vue"

import { mapState } from 'vuex'
import axios from "axios";

export default {
  name: "ShowPart",
  props:["whichApi"],
  data(){
    return{

      items:[],
      api:"",
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
    DragArea,
    DocumentList,
  },
  methods:{
    updateItems(){
      this.items.splice(0, this.items.length);
      //setTimeout (() => {
      for(let element of this.rightNowFileList){
        this.items.push(element);
      }
      //}, 350);
    },

    async requestOn(){
      let {data: res} = await this.$http.post(
          `${this.api}`,
          {
            "user_id": this.$store.state.user_id,
          },
      ).catch((error) => {
            if(error.status !== 401) {
              this.$message.error('文件查询出现未知问题，请联系Van！ Code:' + error.message);
            }
      });
      if(res.code == 200){
        this.$store.commit("updateFileList",res.data.content);
        this.updateItems();
        }

    },
    async decode(path){
      this.$store.commit("updatePath",path);
      let arr = path.split("/");
      arr = arr.slice(3,arr.length);
      let result = [];
      let {data : res} = await this.$http.post(
          "/file/browsePath",
          {
            "user_id": this.$store.state.user_id,
            "content": arr,
          },
      ).catch((error) => {
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
          case "/mainpage/my_torrent":
            this.api = "/file/queryTorrent";
            break;
          case "/mainpage/my_music":
            this.api = "/file/queryMusic";
            break;
          default:
            this.api = "/file/queryImage";
            break;
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



#ccc{
  box-sizing: border-box;
  width: 100%;
  padding-bottom: 170px;
}


</style>