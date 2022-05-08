<template>
  <div :id = "isDiskOrUpload? 'toolBarNoLight' : 'toolBar'">

    <div class = "function one">
      <el-button-group>
        <el-button type="primary" @click="backward" id = "backward" size = "small" round><i class = "bi-box-arrow-left"></i> 返回</el-button>
        <el-button type="primary" @click="forward" id = "forward" size = "small" round><i class = "bi-box-arrow-right"></i> 前进</el-button>
      </el-button-group>
      <el-input
          v-show="!isUpload"
          v-model="search"
          size="mini"
          prefix-icon="el-icon-search"
          style="width: 250px; margin: 0 20px"
          @input = "sendOut"
          class = "globalSearch"
          placeholder="输入关键字以在本页面搜索相关文件"
      />
    </div>
    <div class  = "function second">

      <!--Download></Download-->
      <Vbotton v-show="isDisk" slot="reference" :clickMethod = "handleClick" :nameForButton = "'新建文件夹'" :isIcon ="true" :iconClass = "'bi-folder-plus'" class = "folderButton" :vStyle = "'rounded'"></Vbotton>
      <Upload></Upload>
    </div>

    <new-dir-dialog @reload = "reloadPass" @closeNewDir = "closeNewDir" :newVisible = "newVisible"></new-dir-dialog>
  </div>

</template>

<script>
import Upload from "@/components/Upload";
import Vbotton from "@/components/V-botton";
import NewDirDialog from "@/components/NewDirDialog";

export default {
  name: "ToolBar",
  inject:['reload'],
  props:['isDisk','isDiskOrUpload','isUpload'],
  data(){
    return{
      newVisible:false,
      search:"",
    }
  },
  components:{
    NewDirDialog,
    Upload,
    Vbotton
  },
  methods:{
    handleClick(){
      this.newVisible = true;
    },
    closeNewDir(){
      this.newVisible = false;
    },
    reloadPass(){
      this.$emit("reload");
    },
    backward(){
      this.$router.back();

    },
    forward(){
      this.$router.forward();

    },
    sendOut(){
      this.$store.dispatch("updateSearchStrAsync",this.search);
    },
    clear(){
      this.search = "";
      this.$store.dispatch("updateSearchStrAsync",this.search);
    }
  },
  watch:{
    '$route':{
      handler(){
        this.clear();
      }
    }
  }

}
</script>

<style scoped>

#toolBarNoLight{
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #4aa996, #4f53b7, #3783b6, #8844d2);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  filter: drop-shadow(0px -5px 7px #4aa996) drop-shadow(0px -5px 7px #4f53b7);
  border-radius: 0 0 15px 15px;
  z-index: 100;
}
#toolBar{
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #4aa996, #4f53b7, #3783b6, #8844d2);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite,glowRotate 15s linear infinite;
  border-radius: 0 0 15px 15px;
  z-index: 10;

}

@keyframes glowRotate {
  0% {
    filter: drop-shadow(0px -10px 10px #4aa996) drop-shadow(0px -10px 10px #4f53b7);
  }
  25% {
    filter: drop-shadow(0px -10px 20px #4aa996) drop-shadow(0px -10px 20px #4f53b7);
  }
  50% {
    filter: drop-shadow(0px -10px 10px #3783b6) drop-shadow(0px -10px 10px #8844d2);
  }
  75% {
    filter: drop-shadow(0px -10px 20px #3783b6) drop-shadow(0px -10px 20px #8844d2);
  }
  100% {
    filter: drop-shadow(0px -10px 10px #4aa996) drop-shadow(0px -10px 10px #4f53b7);
  }
}


.function{
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.function.one{
  padding:10px;
}

/deep/.folderButton.button-container {
  width: 205px;
}
.folderButton /deep/ #upload {
  width: 150px;
  height: 28px;
}
/deep/.folderButton.button-container::before {
  width: 160px;
  height: 28px;
}

#backward{
  font-family: "AaGothic (Non-Commercial Use)";
  background-image: linear-gradient(to left, #bd38d7 70%, #d2b31b);
  background-size: 400%;
  background-position: 100%;
  transition: 0.3s;
  border: none;
  box-shadow: -4px 2px 10px -5px  rgb(20, 25, 38);
}
#backward:hover{
  background-position: 5%;
}
#forward{
  font-family: "AaGothic (Non-Commercial Use)";
  background-image: linear-gradient(to right, #bd38d7 70%, #d2b31b);
  background-size: 400%;
  background-position: 0%;
  transition: 0.3s;
  border: none;
  box-shadow: 4px 2px 10px -5px rgb(20, 25, 38);
}

#forward:hover{
  background-position: 95%;
}
.globalSearch /deep/ .el-input__inner {
  background-color: rgba(37, 40, 48, 0.8);
  color: white;
  border: 1px solid transparent;
}

.globalSearch /deep/ .el-input__inner:hover{
  border-color: #A85DC3;
  border-top-color: #A85DC3;
  border-right-color: #A85DC3;
  border-bottom-color: #A85DC3;
  border-left-color: #A85DC3;
}
.globalSearch /deep/ .el-input{
  box-shadow: 0 4px 7px -3px rgb(20, 25, 38);

}

</style>

