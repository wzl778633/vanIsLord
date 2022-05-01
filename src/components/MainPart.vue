<template>
  <div class = "mainShell" >
    <DirPath  @dirRedirect = "decode" @reload = "reloadPass"></DirPath>
    <!--ul class = "document"-->


    <div class = "dragAble" @dragenter = "handleDropEvent"  @dragover = "handleDropOver">
    <overlay-scrollbars  :options = "defaultStyle" style=" width: 100%; height:calc(100vh - 150px); box-sizing: border-box;
  padding: 20px;">

        <DocumentList id = "dList" :itemList="items" @pass = "decode" @reload = "reloadPass"></DocumentList>



    </overlay-scrollbars>
    </div>

    <DragArea class = "drag" v-if = "isDrag" @dragClose = "destroyDragArea"></DragArea>

    <!--/ul-->
      <!--DragArea id = "upArea"></DragArea-->
  </div>

</template>

<script>

import DirPath from "@/components/DirPath.vue"

import DragArea from "@/components/DragArea.vue"
import DocumentList from "@/components/DocumentList.vue"

import { mapState } from 'vuex'
import axios from "axios";

export default {
  name: "MainPart",
  data(){
    return{
      items:[],
      isDrag:false,
      defaultStyle: {
        className: 'os-theme-thick-light',
        overflowBehavior : {
          x : "hidden",
        },
        scrollbars: { autoHide : "leave",},

      }
    }
  },
  components:{

    DirPath,

    DragArea,
    DocumentList,
  },
  methods:{

    reloadPass(){
      this.$emit("reload");
    },
    destroyDragArea(){
      this.isDrag = false;
    },

    handleDropEvent(e){
      e.stopPropagation();
      e.preventDefault();
      this.isDrag = true;
    },

    handleDropOver(e){
      e.stopPropagation();
      e.preventDefault();
      this.isDrag = true;
    },


    updateItems(){
      this.items.splice(0, this.items.length);
      //setTimeout (() => {

        for(let element of this.rightNowDirList){
          this.items.push(element);
        }
        for(let element of this.rightNowFileList){
          this.items.push(element);
        }

      //}, 350);
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
        if(error.status !== 401){
          this.$message.error('路径查询出现未知问题，请联系Van！ Code:' + error.message);
        }

      });
      if(res.code == 200){
        for(let i of res.data){
          i.file_path = "/mainpage/disk" +  i.file_path;
          result.push(i);
        }
        this.$store.commit("updateDecodePath",result);
        this.$store.commit("updateNodeId",result[result.length-1].node_id);
        await this.requestOn(result[result.length-1].node_id, result[result.length-1].file_path);

      }else if(res.code == 453){
        this.$router.push("/404error");
      }

    },

    async requestOn(id = this.$store.state.node_id,filePath){
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
    initial(event){
      event.target.style.setProperty("z-index","9999");
    },
    reset(event){
      event.target.style.setProperty("z-index","-1");
    }
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
        this.$store.commit("updatePath",this.$route.fullPath);
        this.decode(this.$store.state.currentPath);
      }
    }
  },
  mounted() {
    this.$store.commit("updatePath",this.$route.fullPath);
    this.decode(this.$store.state.currentPath);
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

.dragAble{
  width: 100%;
  height: 100%;
}
.drag{
  position: absolute;
  top: 40px;
  z-index: 9999;
}




</style>