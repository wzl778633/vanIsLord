<template>
  <el-dialog
      title="上传文件"
      :visible.sync="uploadVisible"
      width="70%">
    <div class = "uploadBody">

      <div class = "uploadBlock">
        <p class = "hint">Step 1. 输入或使用选择器输入你想上传的目标路径。</p>
       <PathFinder ref = "uploadPathFinder" @pathFinderData = "getData"></PathFinder>
      </div>
      <div class = "uploadBlock">
        <p class = "hint">Step 2. 选择你要上传文件。</p>
      <el-upload
          class="area"
          drag
          multiple
          ref="upload"
          action=""
          :http-request = "uploadFile"
          :auto-upload="false">
        <i class="bi-cloud-arrow-up" style="font-size: 6rem; opacity: 0.6"></i>
        <div class="el-upload__text">将文件拖到此处，或 <el-button slot="trigger" size="small" type="primary" >选取文件</el-button></div>

      </el-upload>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
    <el-button @click="uploadVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitUpload">上 传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import PathFinder from "@/components/PathFinder.vue"
import mixinMethod from "@/assets/methods/UpAndDownload.vue";

export default {
  name: "UploadDialog",
  mixins:[mixinMethod],
  data(){
    return{
      uploadVisible : false,
      uploadPath:"",
      fileType: "folder-fill"
    }
  },
  components:{
    PathFinder
  },
  methods: {
    getData(input) {
      this.uploadPath = input;
    },

    async submitUpload() {
        let tmp = await this.$refs.uploadPathFinder.checkPath();
        if(tmp){
            this.$store.commit("updateState/updateIDtoGo",this.uploadPath);
            this.$refs.upload.submit();
            this.$refs.upload.clearFiles();
            this.uploadVisible = false;
        }
    },
    dealError() {
      this.$message.error("同时只能有5个文件上传任务！");
    }
  },
  computed: {
    monitor () {
      return this.$store.state.updateState.uploadVisible;
    }
  },
  watch: {
    monitor:{
      handler: function (){
        if(this.$store.state.updateState.uploadVisible){
          this.uploadVisible = true;
        }
      },
      immediate:true,
    },
    uploadVisible(val, oldVal){
      if(oldVal == false){
        this.$store.commit("updateState/updateVisable", false);
      }
    }
  },
}
</script>

<style scoped>
.uploadBody{
  display: flex;
  justify-content: space-around;
}
.uploadBlock{
  width: 45%;
}

.hint{
  text-align: center;
  padding: 3px;
}
/deep/ .el-upload{
  width: 100%;
}
/deep/ .el-upload .el-upload-dragger{
  width: 100%;
}
</style>