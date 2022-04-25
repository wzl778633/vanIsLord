<template>
  <el-dialog
      title="重命名"
      :visible.sync="renameVisibleShell"
      @close = "close"
      :destroy-on-close = "true"
      :append-to-body = "true"
      width="40%">
    <div class = "uploadBody">
      <div class = "uploadBlock">
        <div class="enter inputName">请输入新的名称 (注意不允许重名): </div>
        <el-input v-model="fileName" placeholder="请输入新名称" class = "enter" id="fileNameInput"></el-input>
        <transition name = "newName-error">
          <el-alert v-show="newNameError"
                    title="文件名不能为空！"
                    type="error"
                    show-icon :closable="false" id = "newNameErrorMessage" class="errorMsgs">
          </el-alert>
        </transition>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="submitUpload">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinMethod from "@/assets/methods/checkAndPOP";

export default {
  name: "RenameDialog",
  props:["renameVisible"],
  mixins:[mixinMethod],
  data(){
    return{
      fileName:"",
      newNameError:false,
      renameVisibleShell:false,
    }
  },
  methods:{
    close(){
      this.$emit('closeRename')
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
                this.$emit("closeRename");
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
  },
  watch:{
    'renameVisible':{
      handler(val){
          this.renameVisibleShell = val;
      }
    }
  }
}
</script>

<style scoped>
.enter{
  margin-bottom: 15px;
}

.errorMsgs{
  margin-bottom: 10px;
}
</style>