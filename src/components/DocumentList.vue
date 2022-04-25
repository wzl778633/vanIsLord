<template>
    <!--transition-group name = "mainDev" class = "document" tag = "ul"-->
<div id ="ccc">
<ul class = "document">
  <li v-for="item in itemList" v-bind:key = "item.node_id">
    <Document :item = "item" @needRedirect = "passThough" @reload = "reload" :ref="item.node_id" v-contextmenu:contextmenu></Document>
  </li>
</ul>
  <v-contextmenu ref="contextmenu" theme="dark" @contextmenu = "initial">
    <v-contextmenu-item @click = "changeDialogShell"><i class = "bi-check2-circle"></i> 打开</v-contextmenu-item>
    <v-contextmenu-item v-if = "!this.isFolder" @click = "downloadShell"><i class = "bi-cloud-download"></i> 下载</v-contextmenu-item>
    <v-contextmenu-item @click = "moveToShell" ><i class = "bi-box-arrow-up-left"></i> 移动到...</v-contextmenu-item>
    <v-contextmenu-item @click = "deleteProgressShell"><i class = "bi-trash3"></i> 删除</v-contextmenu-item>
    <v-contextmenu-item @click = "renameShell"><i class = "bi-pen"></i> 重命名</v-contextmenu-item>
    <v-contextmenu-item v-if = "!this.isFavShell" @click = "changeFavorite"><i class = "bi-star-fill"></i> 加入收藏</v-contextmenu-item>
    <v-contextmenu-item v-else @click = "changeFavorite"><i class = "bi-star"></i> 取消收藏</v-contextmenu-item>
  </v-contextmenu>
</div>
    <!--/transition-group-->
</template>

<script>
import Document from '@/components/Document.vue'

export default {
  name: "DocumentList",
  props: ["itemList"],
  data(){
    return{
      isFavShell:false,
      isFolder: false,
      whichNode:0,
    }
  },
  components:{
    Document,
  },
  methods:{
    initial(vm){
      this.whichNode = vm.data.ref;
      this.isFavShell = this.$refs[this.whichNode][0].isFav;
      this.isFolder = this.$refs[this.whichNode][0].isFolder;
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
    moveToShell(){
      this.$refs[this.whichNode][0].moveVisible = true;
    },
    reload(){
      this.$emit("reload");
    },
    passThough(path){
      this.$emit("pass",path);
    }
  }
}
</script>

<style scoped>
*{
  margin:0px;
  padding:0px;
}

.document{
  width: 100%;
  max-height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 176px;
  grid-gap: 5px 5px;
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
  width: 100px;
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