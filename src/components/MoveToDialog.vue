<template>
  <el-dialog
      title="移动到..."
      :visible.sync="moveVisibleShell"
      v-if="moveVisibleShell"
      @close = "close"
      :append-to-body = "true"
      width="40%">
    <div class = "uploadBody">
      <div class = "uploadBlock">
        <transition name = "tp-error">
          <el-alert v-show="tpError"
                    title="严格禁止自己tp自己,或者tp自己的子文件夹,或该文件已存在在目标文件夹 (你必须移动到不同的文件夹！)"
                    type="error"
                    show-icon :closable="false" id = "tpErrorMessage" class="errorMsgs">
          </el-alert>
        </transition>
        <p class = "hint">输入或使用选择器输入你想移动到的目标路径。</p>
        <PathFinder ref = "uploadPathFinder" @pathFinderData = "getData"></PathFinder>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="moveVisibleShell = false">取 消</el-button>
    <el-button type="primary" @click="moveTo">移 动</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixinMethod from "@/assets/methods/checkAndPOP";
import PathFinder from "@/components/PathFinder.vue"

export default {
  name: "MoveToDialog",
  props:["moveVisible","nodeId","filename","multiMode","nodeIds"],
  mixins:[mixinMethod],
  data(){
    return{
      moveVisibleShell:false,
      tpError:false,
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
          const loading = this.$loading({
            lock: true,
            text: '文件移动中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let {data: res} = await this.$http.post("/file/moveFile",
              {
                user_id: this.$store.state.user_id,
                node_id: this.nodeId,
                new_nodeId: this.moveToInput,
              }
          ).catch((error) => {
            if(error.status !== 401) {
              this.$message.error('移动出现未知问题，请联系Van！ Code:' + error.message);
              loading.close();
            }}
          );
          if (res.code === 200) {
            this.$emit("closeMoveTo");
            this.$emit("reload");
            this.$emit("updateTotalBar");
            loading.close();
            this.$notify(
                {
                  title: '移动文件成功',
                  type: 'success',
                  message: `${this.filename}已被移动至目的地！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          }else if(res.code === 404 || res.code === 459){
            loading.close();
            this.tpError = true;
            if(document.getElementById('tpErrorMessage')){
              let errMsg = document.getElementById('tpErrorMessage');
              this.shakingAnime(errMsg);
            }
          }
        }
      }else{
        let tmp = await this.$refs.uploadPathFinder.checkPath();
        const loading = this.$loading({
          lock: true,
          text: '文件移动中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(tmp) {
          let {data: res} = await this.$http.post("/file/moveFiles",
              {
                user_id: this.$store.state.user_id,
                file_list: this.nodeIds,
                new_nodeId: this.moveToInput,
              }
          ).catch((error) => {
            if(error.status !== 401) {
              this.$message.error('批量移动出现未知问题，请联系Van！ Code:' + error.message);
              loading.close();
            }}
          );
          if (res.code === 200) {
            this.$emit("closeMoveTo");
            this.$emit("reload");
            this.$emit("updateTotalBar");
            loading.close();
            this.$notify(
                {
                  title: '批量移动文件成功',
                  type: 'success',
                  message: `所有选中文件已被移动至目的地！`,
                  position: 'bottom-right',
                  customClass: "message",
                }
            );
          }else if(res.code === 404 || res.code === 459){
            loading.close();
            this.tpError = true;
            if(document.getElementById('tpErrorMessage')){
              let errMsg = document.getElementById('tpErrorMessage');
              this.shakingAnime(errMsg);
            }
          }
        }
      }

    },
    //only for drag
    async blindMoveTo(dragId,newNodeId){
      const loading = this.$loading({
        lock: true,
        text: '文件移动中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
        let {data: res} = await this.$http.post("/file/moveFile",
            {
              user_id: this.$store.state.user_id,
              node_id: dragId,
              new_nodeId: newNodeId,
            }
        ).catch((error) => {
          loading.close();
          if(error.status !== 401) {
            this.$message.error('拖拽移动出现未知问题，请联系Van！ Code:' + error.message);
          }}
        );
        if (res.code === 200) {
          this.$emit("reload");
          this.$emit("updateTotalBar");
          loading.close();
          this.$notify(
              {
                title: '拖动移动文件成功',
                type: 'success',
                message: `文件已被移动至目的地 ${this.filename}！`,
                position: 'bottom-right',
                customClass: "message",
              }
          );
        }else if(res.code === 404){
          loading.close();
          this.$notify(
              {
                title: '拖动移动失败',
                type: 'error',
                message: `${this.filename}tmd压根不是个文件夹！`,
                position: 'bottom-right',
                customClass: "message",
              });
        }else if(res.code === 459){
          loading.close();
          this.$notify(
              {
                title: '移动失败',
                type: 'error',
                message: `文件已在文件夹 ${this.filename}中！严格禁止自己tp自己,或者tp自己的子文件夹！`,
                position: 'bottom-right',
                customClass: "message",
              });
        }

    },
    async multiBlindMoveTo(dragIds,newNodeId){
      const loading = this.$loading({
        lock: true,
        text: '文件移动中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let {data: res} = await this.$http.post("/file/moveFiles",
          {
            user_id: this.$store.state.user_id,
            file_list: dragIds,
            new_nodeId: newNodeId,
          }
      ).catch((error) => {
        if(error.status !== 401) {
          loading.close();
          this.$message.error('批量拖拽移动出现未知问题，请联系Van！ Code:' + error.message);
        }}
      );
      if (res.code === 200) {
        this.$emit("reload");
        this.$emit("updateTotalBar");
        loading.close();
        this.$notify(
            {
              title: '批量拖动移动文件成功',
              type: 'success',
              message: `文件群已被移动至目的地 ${this.filename}！`,
              position: 'bottom-right',
              customClass: "message",
            }
        );
      }else if(res.code === 404){
        loading.close();
        this.$notify(
            {
              title: '批量拖动移动失败',
              type: 'error',
              message: `${this.filename}tmd压根不是个文件夹！`,
              position: 'bottom-right',
              customClass: "message",
            });
      }else if(res.code === 459){
        loading.close();
        this.$notify(
            {
              title: '批量移动失败',
              type: 'error',
              message: `文件群中有文件 1.已在文件夹 ${this.filename}中！2.自己tp自己！3.tp自己的子文件夹！`,
              position: 'bottom-right',
              customClass: "message",
            });
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