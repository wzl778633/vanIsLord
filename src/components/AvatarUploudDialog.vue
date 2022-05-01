<template>
  <el-dialog
      title="上传头像"
      :visible.sync="uploadVisible"
      v-if="uploadVisible"
      :append-to-body = "true"
      @close = "cancel"
      width="30%">
    <div class = "uploadBody">
      <div class = "uploadBlock">
        <el-upload
            action=""
            :limit = "1"
            :on-change = "limitReached"
            :on-remove = "limitRemove"
            :class="islimitReached ? 'hide' : ''  "
            :before-upload="beforeAvatarUpload"
            ref="upload"
            :http-request = "changeAvatar"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>

    <transition name = "pathfinder-error">
      <el-alert v-if="errorPop"
                title="图片有误"
                description="图片必须为PNG或者JPG格式，且不能超过5MB！！"
                type="error"
                show-icon :closable="false" id = "pathfinderMessage">
      </el-alert>
    </transition>


    <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="submitUpload">上 传</el-button>
    </span>
  </el-dialog>
</template>

<script>




import mixinMethod from "@/assets/methods/checkAndPOP";

export default {
  name: "AvatarUploudDialog",
  props:["isOpen"],
  mixins:[mixinMethod],
  data(){
    return{
      uploadVisible:true,
      dialogImageUrl: '',
      dialogVisible: false,
      islimitReached:false,
      checkTypeAndSize :false,
      errorPop: false,
    }
  },

  methods: {
    limitReached(file, fileList){
      this.islimitReached = (fileList.length >= 1);
    },
    limitRemove(){
      this.islimitReached = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    cancel(){
      this.dialogImageUrl= '';
      this.dialogVisible= false;
      this.islimitReached=false;
      this.checkTypeAndSize =false;
      this.errorPop= false;
      this.$emit('closeAvatarUpload' );
    },
    async changeAvatar(file){
      if(this.checkTypeAndSize){
        const formData = new FormData();
        formData.append("file",file.file);
        formData.append("user_id",this.$store.state.user_id)
        await this.$http.post("/user/updatePhoto",formData,
            {
              headers:{
                "Content-Type": "multipart/form-data"
              }
            }
            ).then((data) =>
        {
          if(data.data.code === 200){
            this.$notify(
                {
                  title: '头像上传成功',
                  type: 'success',
                  message: `已成功上传新的头像！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
            this.$emit("reload")
          }
        }).catch((error) => {
          if(error.status !== 401) {
            this.$message.error('头像上传出现未知问题，请联系Van！ Code:' + error.message);

          }
        });
      }



    },
    submitUpload() {
      this.$refs.upload.submit();
      if(this.checkTypeAndSize){
        if(this.errorPop){
          this.errorPop = false;
        }
        this.$refs.upload.clearFiles();
        this.limitRemove();
        this.$emit('closeAvatarUpload' );
      }else{
        this.errorPop = true;
        if(document.getElementById("pathfinderMessage")){
          let errMsg = document.getElementById("pathfinderMessage");
          this.shakingAnime(errMsg);
        }
      }

    },
    dealError() {
      this.$message.error("同时只能有5个文件上传任务！");
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png') ;
      const isLt2M = file.size / 1024 / 1024 < 5;
      this.checkTypeAndSize = isJPG && isLt2M;
    }

  },

  watch: {
    'isOpen':{
      handler: function (val){
        if(val){
          this.uploadVisible = true;
        }else{
          this.uploadVisible = false;
        }
      },
      immediate:true,
    },
  },
}
</script>

<style scoped>
.uploadBody{
  width: 100%;
}
.uploadBlock{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/deep/.el-upload--picture-card {
  transition: all 0.3s ease-in-out 1s;
}

/deep/.hide .el-upload--picture-card {
  transition: none;
  width: 0;
  opacity: 0;
}

.pathfinder-error-enter-active{
  animation: shaking .3s linear;
}
#pathfinderMessage{
  margin-top: 10px ;
}
</style>