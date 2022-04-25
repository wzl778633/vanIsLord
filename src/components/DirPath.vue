<template>
  <div class = header>
    <el-breadcrumb separator-class="el-icon-arrow-right" class = "path">
      <!--el-breadcrumb-item v-for= "file in fileDoc" :key = "fileDoc.id" :to="{ path: '/' }">首页</el-breadcrumb-item-->
      <el-breadcrumb-item v-for= "name in pathName" :key = "name.node_id" class = "reshape" :to = "{path:name.file_path}" @click.native = "reload(name)">{{name.file_name}}</el-breadcrumb-item>
      <el-breadcrumb-item class = "reshape" >{{lastElement.file_name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <Vbotton slot="reference" :clickMethod = "handleClick" :nameForButton = "'新建文件夹'" :isIcon ="true" :iconClass = "'bi-folder-plus'" class = "folderButton" :vStyle = "'rounded'"></Vbotton>
    <el-dialog
        title="在当前文件夹中创建新文件夹"
        :visible.sync="newVisible"

        :destroy-on-close = "true"
        width="40%">
      <div class = "uploadBody">
        <div class = "uploadBlock">
          <div class="enter inputName">新文件夹的名称: </div>
          <el-input v-model="fileName" placeholder="请输入新名称" class = "enter" id="fileNameInput"></el-input>
          <transition name = "newName-error">
            <el-alert v-show="newNameError"
                      title="文件夹名不能为空！"
                      type="error"
                      show-icon :closable="false" id = "newNameErrorMessage" class="errorMsgs">
            </el-alert>
          </transition>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="submitUpload">确定新建</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import Vbotton from "@/components/V-botton.vue";
import mixinMethod from "@/assets/methods/checkAndPOP";


export default {
  name: "DirPath",
  mixins:[mixinMethod],
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
    close(){
      this.newVisible = false;
    },
    async submitUpload(){
      if(this.fileName === ""){
        this.newNameError = true
        this.errorDealing(null,"fileNameInput","newNameErrorMessage");
      }else{
        await this.$http.post("/file/newdir", {
          user_id: this.$store.state.user_id,
          node_id: this.$store.state.node_id,
          file_name: this.fileName,
        }).then((data) => {
              let res = data.data;
              if (res.code === 200) {
                this.$notify(
                    {
                      title: '新文件夹创建成功',
                      type: 'success',
                      message: `已成功创建新文件夹${this.fileName}！`,
                      position: 'bottom-right',
                      customClass: "message",
                    }
                );
                this.fileName = "";
                this.newVisible = false;
                this.$emit("reload")
              }
            }
        ).catch((error) => {
          if(error.status !== 401) {
            this.$message.error('文件夹创建出现未知问题，请联系Van！ Code:' + error.message);
          }
        });

      }

    },
    handleClick(){
      this.newVisible = true;
    },
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

.folderButton{
 position: absolute;
 right: 0;
}

/deep/.folderButton.button-container {
  width: 205px;
}
.folderButton /deep/ #upload {
  width: 150px;
  height: 28px;
}
/deep/.folderButton.button-container::before {
  width: 160px;
  height: 28px;
}
.enter{
  margin-bottom: 15px;
}

.errorMsgs{
  margin-bottom: 10px;
}
</style>