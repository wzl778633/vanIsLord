<template>
  <div id = "toolBar">
    <div class = "function one">
      <el-button-group>
        <el-button type="primary" @click="backward" size = "medium"><i class = "bi-box-arrow-left"></i> 返回</el-button>
        <el-button type="primary" @click="forward" id = "forward" size = "medium"><i class = "bi-box-arrow-right"></i> 前进</el-button>
      </el-button-group>
    </div>
    <div class  = "function second">
      <!--Download></Download-->
      <Upload></Upload>
    </div>
  </div>

</template>

<script>
import Upload from "@/components/Upload";
import Vbotton from "@/components/V-botton";

export default {
  name: "ToolBar",
  inject:['reload'],
  components:{

    Upload,
    Vbotton
  },
  methods:{
    backward(){
      this.$router.back();

    },
    forward(){
      this.$router.forward();

    }
  },
}
</script>

<style scoped>


#toolBar{
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.function{
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
.function.one{
  padding:10px
}
</style>

