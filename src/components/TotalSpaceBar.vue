<template>
  <transition name = "totalbarShow">
  <div v-if="!isMainCollapse" class = "totalSpaceBarStage">
    <p class="totalSpaceBarText">总使用量 ：<span class = "totalSpaceBarinnerText">{{realSize}} / 250GB</span></p>
    <div id = "totalSpaceBar">
      <el-progress :text-inside="true" class = "totalbar" :stroke-width= "10" :percentage="percentage" :color="colors" :format="format"></el-progress>
    </div>
  </div>
  </transition>
</template>

<script>

export default {
  name: "TotalSpaceBar",
  props:["isMainCollapse"],
  data(){
    return{
      percentage:0,
      colors: [
        {color: '#5cb87a', percentage: 20},
        {color: '#1989fa', percentage: 40},
        {color: '#5e6ada', percentage: 60},
        {color: '#e89b22', percentage: 80},
        {color: '#f11e1e', percentage: 100}
      ],
      realSize:"",
    }
  },
  methods:{
    format(percentage) {
      return;
    },
    async update(){
      let {data:res} = await this.$http.post("/user/availableSpace",{
        user_id:this.$store.state.user_id,
      });
      if(res.code === 200){
        this.percentage = Number(res.data.percentage);
        this.realSize =  res.data.size;
      }
    }
  },
  created() {
    this.update();
  },
}
</script>

<style scoped>
.totalSpaceBarStage{
  width: 214px;
  margin: 10px 3px;
  text-align: center;

}
.totalSpaceBarText{
  color: white;
  margin: 2px;
  font-size: 0.8em;
  font-family: "AaGothic (Non-Commercial Use)";
}
.totalSpaceBarText .totalSpaceBarinnerText{
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
#totalSpaceBar{

  box-sizing: border-box;
  width: 100%;
  padding: 6px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.25);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
  justify-content: center;
  align-items: center;

}

.totalbar{
  width: 100%;
  line-height:0;

}
.totalbar /deep/ .el-progress__text{
  color: white;
}
.totalbar /deep/ .el-progress-bar{
  margin: 0;
}
.totalbar /deep/ .el-progress-bar__outer{
  background-color: transparent;
}
.totalbar /deep/ .el-progress-bar__inner{
  background-image:
      linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
}
.totalbarShow-enter-active{
  transition: all 0.3s ease-in-out 0.3s;
}
.totalbarShow-enter{
  transform: translateX(-30px);
  opacity: 0;

}
.totalbarShow-leave-active {
  transition: all 0.3s ease-in-out;
}
.totalbarShow-leave-to{
  transform: translateX(-154px);
  opacity: 0;
}
</style>