<template>
  <el-dialog
      title="选择你想要组建聊天室的用户"
      :visible.sync="userSelectDialogShowShell"
      v-if="userSelectDialogShowShell"
      :append-to-body = "true"
      @close = "closeDialog"
      width="55%">
    <div class = "userList_stage">
      <el-transfer
          filterable
          filter-placeholder="输入以便搜索"
          :titles="['全部镇民', '已选择镇民']"
          :render-content="renderFunc"
          v-model="value"
          :data="userList">
      </el-transfer>
    </div>

    <span slot="footer" class="dialog-footer">
    <el-button @click="closeDialog">取 消</el-button>
    <el-button type="primary" @click="createRoom">创建房间</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "UserSelectDialog",
  props: ["userSelectDialogShow","userTotalList","usersAlreadyInRoom"],
  data(){
    return{
      userList:[],
      value:[],
      userSelectDialogShowShell : false,
    }
  },
  methods:{
    renderFunc(h, option){
      let src = option.avatar;
      return <span style="display: flex; justify-content: flex-start; align-items: center;"><el-avatar size={25} src = {src} ></el-avatar><p style="margin:0 0 0 5px">{option.label }</p></span>;
    },
    createRoom(){
      if(this.value.length <= this.usersAlreadyInRoom.length){
        this.$message({
          type: 'error',
          message: '请至少选择一位新的镇民！'
        });
      }
      else{
        this.$emit("closeUserSelectWithUserList",this.value);
      }
    },
    closeDialog(){
      this.$emit("closeUserSelectWithUserList");
    }
  },
  watch:{
    'userSelectDialogShow':{
      handler(val){
        this.userSelectDialogShowShell = val;
        if(val){
          this.userList = [];
          this.value = [];
          const tmpUserList = this.userTotalList;
          tmpUserList.forEach((name, index) => {
            this.userList.push({
              label: name.username,
              key: name._id,
              user_id: name._id,
              avatar: name.avatar,
            });
          });
          const tmpAlreadyUserList = this.usersAlreadyInRoom;
          tmpAlreadyUserList.forEach((name, index) => {
              this.userList.push({
                label: name.username,
                key: name._id,
                user_id:name._id,
                avatar:name.avatar,
                disabled: true,
              });
          });

          this.value = this.usersAlreadyInRoom.map(x=>x._id);
        }
      }
    }
  }
}
</script>

<style scoped>
.userList_stage{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>