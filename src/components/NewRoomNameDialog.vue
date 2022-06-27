<template>
  <el-dialog
      title="修改房间名"
      :visible.sync="renameDialogShell"
      v-if="renameDialogShell"
      width="30%">
    <transition name = "tp-error">
      <el-alert v-show="sameNameError"
                title="房间名不能为空！"
                type="error"
                show-icon :closable="false" id = "sameNameErrorMessage" class="errorMsgs">
      </el-alert>
    </transition>
    <el-input v-model="newRoomName" placeholder="请输入新的自定义房间名"></el-input>
    <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="sendOutNewName">确定修改</el-button>
      </span>
  </el-dialog>
</template>

<script>
import mixinMethod from "@/assets/methods/checkAndPOP";

export default {
  name: "NewRoomNameDialog",
  props:["renameDialog","roomId"],
  mixins:[mixinMethod],
  data(){
    return{
      renameDialogShell:false,
      sameNameError:false,
      newRoomName: "",
    }
  },
  methods:{
    close(){
      this.newRoomName="";
      this.sameNameError=false;
      this.$emit('closeRename');
    },
    sendOutNewName(){
      //this.renameDialog = false;
      if(this.newRoomName === ""){
        this.sameNameError = true;
        this.errorDealing(null,"newfileNameInput","sameNameErrorMessage");
      }
      else{
        this.$socket.emit("roomNameChanged",this.roomId,this.newRoomName);
        this.newRoomName="";
        this.sameNameError=false;
        this.$emit("closeRename");
      }

    },
  },

  watch:{
    "renameDialog":{
      handler(val){
        this.renameDialogShell = val;
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