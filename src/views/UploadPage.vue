<template>
  <div id="uploadTable">

    <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        class = "grandTable"
        height="100%"
        :header-cell-style="center"
        :row-style="{background:'transparent',color:'white'}"
        empty-text = "你没有上传过文件 或 10天内未上传过文件"
    >
      <el-table-column
          label="文件名"
          prop= "name"
          width="300">
        <template v-slot:default="scope">
          <i :class="'bi-'+ scope.row.fileType"></i>
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="文件总大小"
          prop="size"
          width="100">
      </el-table-column>
      <el-table-column
          label="上传速度"
          prop="speed"
          width="100">
      </el-table-column>
      <el-table-column
          label="剩余时间"
          prop="leftTime"
          width="100">
      </el-table-column>
      <el-table-column
          label="状态"
          prop="status"
          width="100">
      </el-table-column>
      <el-table-column
          label="上传进度"
          prop="complete">
        <template v-slot:default="scope">
          <el-progress v-if="scope.row.noErrorFlag"  :text-inside="true" :stroke-width="24" :percentage="scope.row.complete" status="success"></el-progress>
          <el-progress v-else :text-inside="true" :format="function(){return '错误';}"  :stroke-width="24" :percentage="scope.row.complete" status="exception"></el-progress>
        </template>
      </el-table-column>

      <el-table-column
          width="250"
          align="right">
        <template v-slot:header="scope">
          <el-input
              v-model="search"
              size="mini"
              prefix-icon="el-icon-search"
              style="width: 200px"
              placeholder="输入关键字搜索"
                />
        </template>
        <template v-slot:default="scope">

          <div v-if="!scope.row.isFinished">
            <el-button v-if="!scope.row.isPause" type="warning" icon="bi-pause" @click = "paused(scope.row.id)" circle></el-button>
            <el-button v-else type="success" icon="bi-play" @click = "unPaused(scope.row.id)" circle></el-button>
            <el-button type="danger" icon="el-icon-close" @click = "abortMission(scope.row.id)" circle></el-button>
          </div>

          <div v-else>
            <el-button type="danger" icon="el-icon-delete" @click = "deleteRow(scope.row.name,scope.row.id)" circle></el-button>
          </div>



        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import mixinMethod from "@/assets/methods/UpAndDownload.vue";
export default {
  name: "Upload",
  mixins:[mixinMethod],
  data(){
    return{
      search:"",
      tableData:[],


    }
  },
  methods:{
    center({row, column, rowIndex, columnIndex}){
     if(columnIndex !== 4){
       return  {background:'#444857',color:'white'};
     }else if (columnIndex === 4){
       return  {background:'#444857',color:'white', 'text-align' : "center"};
     }
    },
    deleteRow(name,id){
      this.$confirm('你确定要删除这项上传记录吗？', '你tm到底删不删？', {
        confirmButtonText: '是的，删！',
        cancelButtonText: '算了算了',
        type: 'error'
      }).then(async () => {
        let {data:res} = await this.$http.post('/deleteHistory',{
          user_id:this.$store.state.user_id,
          id:id,
        });
        if(res.code === 200){
          this.$store.commit("updateState/removeRecord",id);
          this.$notify({
            title: '删除成功',
            type: 'success',
            message: `${name}的上传记录删除成功!`,
            position: 'bottom-right',
            customClass: "message"
          });
        }
      }).catch(() => {
        this.$notify({
          title: '你是傻逼',
          type: 'info',
          message: '已取消删除,建议你去看一下医生',
          position: 'bottom-right',
          customClass: "message",
        });
      });

    }
  },
  computed: {
    monitor () {
      return this.$store.state.updateState.uploadingFiles.concat(this.$store.state.updateState.waitingFiles).concat(this.$store.state.updateState.uploadedFiles);
    },
  },
  watch: {
    monitor:{
      handler: function (){
        this.tableData = this.$store.state.updateState.uploadingFiles.concat(this.$store.state.updateState.waitingFiles).concat(this.$store.state.updateState.uploadedFiles);
      },
      //deep:true,
      immediate:true,
    },

  },

  mounted() {
    OverlayScrollbars(document.querySelectorAll("#uploadTable .el-table__body-wrapper"), {
      className: 'os-theme-thick-light',
      scrollbars: { autoHide : "leave",},
    });
    this.tableData = this.$store.state.updateState.uploadingFiles.concat(this.$store.state.updateState.uploadedFiles);
  },

}
</script>

<style scoped>
*{
  padding: 0;
  margin: 0;
}

.grandTable{
  width: 100%;
  min-width: 900px;
  height: 100%;
  position: absolute;
  background: #252830;
}

#uploadTable{
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 600px;
}
/deep/ .el-input__inner {
  background-color: rgba(255, 255, 255, 0.247);
  color: white;
}

#uploadTable >>> .el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #A85DC3;

}

#uploadTable >>> .el-table th.gutter{   /*解决el-table加了gutter后 边框出现白边*/
  background:#444857;
}
#uploadTable >>> .el-table__row>td,#uploadTable >>>  .el-table th.is-leaf{
  border: none;
}


</style>
