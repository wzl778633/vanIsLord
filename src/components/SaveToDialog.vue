<template>
  <el-dialog
      title="获取到..."
      :visible.sync="moveVisibleShell"
      v-if="moveVisibleShell"
      @close = "close"
      :append-to-body = "true"
      width="40%">
    <div class = "uploadBody">
      <div class = "uploadBlock">
        <transition name = "tp-error">
          <el-alert v-show="tpError"
                    title="你所输入的目标地址不是一个文件夹！"
                    type="error"
                    show-icon :closable="false" id = "tpErrorMessage" class="errorMsgs">
          </el-alert>
        </transition>
        <transition name = "tp-error">
          <el-alert v-show="roomError"
                    title="你所输入的目标地址不是一个文件夹！"
                    type="error"
                    show-icon :closable="false" id = "roomErrorMessage" class="errorMsgs">
          </el-alert>
        </transition>
        <p class = "hint">输入或使用选择器输入你想获取分享文件的目标路径。</p>
        <PathFinder ref = "uploadPathFinder" @pathFinderData = "getData"></PathFinder>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="moveVisibleShell = false">取 消</el-button>
    <el-button type="primary" @click="moveTo">获 取</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinMethod from "@/assets/methods/checkAndPOP";
import PathFinder from "@/components/PathFinder.vue"

export default {
  name: "SoveToDialog",
  props:["moveVisible","userId","nodeId","filename","multiMode","nodeIdsWithUserIds"],
  mixins:[mixinMethod],
  data(){
    return{
      moveVisibleShell:false,
      tpError:false,
      roomError:false,
      moveToInput:"",
    }
  },
  methods:{
    getData(input) {
      this.moveToInput = input;
    },
    close(){
      this.$emit("closeMoveTo");
    },
    async moveTo(){
      if(!this.multiMode){
        let tmp = await this.$refs.uploadPathFinder.checkPath();
        if(tmp) {
          let {data: res} = await this.$http.post("/share/saveSharedFile",
              {
                user_id: this.userId,
                node_id: this.nodeId,
                new_userid: this.$store.state.user_id,
                new_nodeId: this.moveToInput,
              }
          ).catch((error) => {
            if(error.status !== 401) {
              this.$message.error('分享获取出现未知问题，请联系Van！ Code:' + error.message);
            }}
          );
          if (res.code === 200) {
            this.$emit("closeMoveTo");
            this.$emit("reload");
            this.$emit("updateTotalBar");
            this.$notify(
                {
                  title: '获取文件成功',
                  type: 'success',
                  message: `${this.filename}已被获取至目的地！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          }else if(res.code === 404 || res.code === 461){
            this.tpError = true;
            this.roomError = false;
            if(document.getElementById('tpErrorMessage')){
              let errMsg = document.getElementById('tpErrorMessage');
              this.shakingAnime(errMsg);
            }
          }else if(res.code === 455){
            this.tpError = false;
            this.roomError = true;
            if(document.getElementById('roomErrorMessage')){
              let errMsg = document.getElementById('roomErrorMessage');
              this.shakingAnime(errMsg);
            }
          }
        }
      }else{
        let tmp = await this.$refs.uploadPathFinder.checkPath();
        if(tmp) {
          let {data: res} = await this.$http.post("/share/saveSharedFiles",
              {
                share_files: this.nodeIdsWithUserIds,
                new_userid: this.$store.state.user_id,
                new_nodeId: this.moveToInput,
              }
          ).catch((error) => {
            if(error.status !== 401) {
              this.$message.error('批量分享获取出现未知问题，请联系Van！ Code:' + error.message);
            }}
          );
          if (res.code === 200) {
            this.$emit("closeMoveTo");
            this.$emit("reload");
            this.$emit("updateTotalBar");
            this.$notify(
                {
                  title: '批量获取文件成功',
                  type: 'success',
                  message: `所有选中的分享文件已被获取至目的地！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          }else if(res.code === 404 || res.code === 461){
            this.tpError = true;
            this.roomError = false;
            if(document.getElementById('tpErrorMessage')){
              let errMsg = document.getElementById('tpErrorMessage');
              this.shakingAnime(errMsg);
            }
          }else if(res.code === 455){
            this.tpError = false;
            this.roomError = true;
            if(document.getElementById('roomErrorMessage')){
              let errMsg = document.getElementById('roomErrorMessage');
              this.shakingAnime(errMsg);
            }
          }
        }
      }

    },

  },
  components:{
    PathFinder
  },

  watch:{
    'moveVisible':{
      handler(val){
        this.moveVisibleShell = val;
      }
    }
  }
}

</script>

<style scoped>
.errorMsgs{
  margin-bottom: 10px;
}
</style>