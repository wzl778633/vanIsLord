<template>
<div id = "finderContainer">

  <el-input v-model="input" placeholder="请输入正确的路径，以用户名根目录开始。e.g '/tom/....'" @blur = "checkPath" @input = "mustCheck" id = "pathfinderInput">
    <i v-if= "isPass" class="el-icon-circle-check el-input__icon" slot="suffix" style="color: #67C23A">
    </i>
  </el-input>
  <transition name = "pathfinder-error">
    <el-alert v-if="errorPop"
              title="路径有误"
              description="你输入的路径格式不正确或其中的文件夹不存在！建议使用PathFinder选择器以照顾弱智的您"
              type="error"
              show-icon :closable="false" id = "pathfinderMessage">
    </el-alert>
  </transition>
  <el-tree
      show-checkbox
      :props="props"
      lazy
      :load="treeLoad"
      node-key="node_id"
      check-strictly
      @check="handleClick"
      ref="treeForm"
  >

  </el-tree>

</div>
</template>

<script>
import mixinMethod from "@/assets/methods/checkAndPOP.vue";
export default {
  name: "PathFinder",
  mixins:[mixinMethod],
  data() {
    return {
      state: '',
      props: {
        label: 'file_name',
        children: 'children',
        isLeaf: 'is_Leaf'
      },
      input:"",
      isPass:false,
      errorPop: false,
      noNeedForCheck:false,
      whereToGo:0,
      i:0,
    };

  },
  methods: {
    handleClick(data,checked, node) {

      this.input = data.file_path;
      this.whereToGo = data.node_id;
        if(checked){
          this.$refs.treeForm.setCheckedNodes([]);
          this.$refs.treeForm.setCheckedNodes([data]);
          this.noNeedForCheck = true;
          this.isPass = true;
          if(this.errorPop){
            this.errorPop = false;
            this.recover(null,"pathfinderInput","pathfinderMessage");
          }

          //交叉点击节点
        }else{
          this.$refs.treeForm.setCheckedNodes([]);
          this.input = "";
          this.noNeedForCheck = false,
          this.isPass = false,
          this.whereToGo = 0;

          //点击已经选中的节点，置空
        }
      this.$emit("pathFinderData", this.whereToGo);
    },
    mustCheck(){
      this.noNeedForCheck = false;
      this.isPass = false;
    },
    treeLoad(node, resolve) {
      if(node.level == 0) {
        return resolve([{
          file_name: this.$store.state.user_name,
          node_id: 1,
          file_path: "/"+this.$store.state.user_name,
          is_Leaf: false
        }]);
      }
      if(node.level >= 1) {
        return this.sonTreeLoad(node,resolve);
      }
    },

    async sonTreeLoad(node,resolve){
      let {data:res} = await this.$http.post(
          '/file/queryAllFolder',{
            user_id:this.$store.state.user_id,
            node_id:node.data.node_id,
          });
      if(res.code === 200){
        resolve(res.data.content);
      }
    },
    async checkPath(){
      if(this.noNeedForCheck){
        return true;
      }
      await this.$http.post(
          "/file/checkPath",
          {
            user_id: this.$store.state.user_id,
            file_path: this.input
          },
      ).then((data)=>{
            let res = data.data;
            if(res.code == 200){
              this.isPass = true;
              this.errorPop = false;
              this.whereToGo = res.data;
              console.log(this.whereToGo);
              this.recover(null,"pathfinderInput","pathfinderMessage");
              return true;
            }else{
              this.isPass = false;
              this.errorPop = true
              this.errorDealing(null,"pathfinderInput","pathfinderMessage");
              return false;
            }
          }
      ).catch((error) => {
        this.$message.error("路径检查出现未知异常，请联系Van! Code: " + error.message);
        return false;
      });
    }

  }

}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}

finderContainer{
  width: 100%;
}
#pathfinderMessage{
  margin-top: 10px;
}
.pathfinder-error-enter-active{
  animation: shaking .3s linear;
}

</style>