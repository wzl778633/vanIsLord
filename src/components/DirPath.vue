<template>
  <div class = header>
    <el-breadcrumb separator-class="el-icon-arrow-right" class = "path">
      <!--el-breadcrumb-item v-for= "file in fileDoc" :key = "fileDoc.id" :to="{ path: '/' }">首页</el-breadcrumb-item-->
      <el-breadcrumb-item v-for= "name in pathName" :key = "name.node_id" class = "reshape" :to = "{path:name.file_path}" @click.native = "reload(name)">{{name.file_name}}</el-breadcrumb-item>
      <el-breadcrumb-item class = "reshape" >{{lastElement.file_name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import Vbotton from "@/components/V-botton.vue";


export default {
  name: "DirPath",
  data(){
    return{
      pathName:[],
      lastElement:"",
      newVisible:false,
      fileName:"",
      newNameError:false,
    }
  },
  methods:{
    reload(name){
      this.$emit("dirRedirect", name.file_path);
    },
  },
  computed: {
    monitor () {
      return this.$store.state.currentDecodePath;
    }
  },
  watch: {
    monitor:{
      handler: function (){
       this.pathName = this.$store.state.currentDecodePath;
       this.lastElement = this.pathName[this.pathName.length-1];
       this.pathName = this.pathName.slice(0,this.pathName.length-1);
      }
    },
    immediate:true,
  },
  mounted() {
  },
  components:{
    Vbotton,
  },
}
</script>

<style scoped>
.header{
  width: 100%;
  background-color: #444857;
  min-height: 40px;
  height: max-content;
  display: flex;
  align-items: center;
  border-radius: 0 0 15px 15px;
  min-width: max-content;
}
.path{
  max-width: 85vw;
  font-size: 1em;
  margin: 10px;
}
.reshape /deep/ .el-breadcrumb__inner{
  color:#F2F6FC;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

/deep/.el-breadcrumb__item:last-child .el-breadcrumb__inner{
  color:#F2F6FC;
  cursor: default !important;
}

/deep/.el-breadcrumb__item:last-child:hover .el-breadcrumb__inner{
  color:#F2F6FC;
  cursor: default !important;
}




</style>