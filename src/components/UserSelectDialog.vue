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
  props: ["userSelectDialogShow"],
  data(){
    const generateData = _ => {
      const data = [];
      const userList = ["tom","test","wzl778633","wadaw","hhhaaa","asdwq22"];
      userList.forEach((name, index) => {
        data.push({
          label: name,
          key: (index+100),
          user_id:index,
        });
      });
      return data;
    };
    return{
      userList:generateData(),
      value:[],
      userSelectDialogShowShell : false,
    }
  },
  methods:{
    renderFunc(h, option){
      let src = `${this.$addr}/vavatar/${option.key}?token=${localStorage.loginToken}&time=${Date.now()}`;
      return <span style="display: flex; justify-content: flex-start; align-items: center;"><el-avatar size={25} src = {src} ></el-avatar><p style="margin:0 0 0 5px">{option.label }</p></span>;
    },
    createRoom(){
      console.log(this.value);
      this.$emit("closeUserSelectWithUserList",this.value);
    },
    closeDialog(){
      this.$emit("closeUserSelectWithUserList");
    }
  },
  watch:{
    'userSelectDialogShow':{
      handler(val){
        this.userSelectDialogShowShell = val;
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