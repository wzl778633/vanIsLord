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
export default {
  name: "DirPath",
  data(){
    return{
      pathName:[],
      lastElement:"",
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

}
</script>

<style scoped>
.header{
  width: 100%;
  background-color: #444857;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 0 0 15px 15px;
  min-width: max-content;
}
.path{
  font-size: 1em;
  margin: 10px;
}
.reshape /deep/ .el-breadcrumb__inner{
  color:#F2F6FC;
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