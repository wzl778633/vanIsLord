<template>
  <div class = "backStage">
    <div class = "background">
      <img alt="background" src="@/assets/imgs/background.png" class="backImg">
      <img alt="background" src="@/assets/imgs/background.png" class="backImg">
      <img alt="background" src="@/assets/imgs/background.png" class="backImg">
      <img alt="background" src="@/assets/imgs/background.png" class="backImg">
    </div>
  </div>

</template>

<script>
export default {
  name: "Background"
}
</script>

<style scoped>

.backStage{
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

}
.background{
  position: absolute;
  width: 3840px;
  height: 2028px;

  top: -1080px;
  left: -1920px;
  animation: moving 15s linear infinite normal;
}
.backImg{
  margin: 0;
  padding: 0;
  float: left;
}


@keyframes moving {
  0% {
    transform: translateX(0) translateY(0); /* 自身节点*/

  }

  100% {
    transform: translateX(50%) translateY(50%);

  }
}
</style>