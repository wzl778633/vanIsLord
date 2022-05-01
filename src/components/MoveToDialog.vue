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
                    title="禁止原地tp! (你必须移动到不同的文件夹！)"
                    type="error"
                    show-icon :closable="false" id = "tpErrorMessage" class="errorMsgs">
          </el-alert>
        </transition>
        <p class = "hint">输入或使用选择器输入你想上传的目标路径。</p>
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
  props:["moveVisible","nodeId","filename"],
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
      let tmp = await this.$refs.uploadPathFinder.checkPath();
      if(tmp) {
        let {data: res} = await this.$http.post("/file/moveFile",
            {
              user_id: this.$store.state.user_id,
              node_id: this.nodeId,
              new_nodeId: this.moveToInput,
            }
        );
        if (res.code === 200) {
          this.$emit("closeMoveTo");
          this.$emit("reload");
          this.$notify(
              {
                title: '移动文件成功',
                type: 'success',
                message: `${this.filename}已被移动至目的地！`,
                position: 'bottom-right',
                customClass: "message",
              }
          );
        }else if(res.code === 404){
          this.tpError = true;
          if(document.getElementById('tpErrorMessage')){
            let errMsg = document.getElementById('tpErrorMessage');
            this.shakingAnime(errMsg);
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