<template>
<div id = "dragArea" class="dragActive"
     @drop = "dropEvent"
     @dragleave = "dropEventLeave"
     @dragenter = "dropEventEnter"
     @dragover = "dropEventOver">

  <p style="font-size: 2em">拖动到这里面以上传文件至当前目录</p>

</div>
</template>

<script>
import mixinMethod from "@/assets/methods/UpAndDownload.vue";
export default {
  name: "DragArea",
  mixins:[mixinMethod],
  data(){
    return{
      dragActive:false,
    }
  },
  methods:{
    async dropEvent(event) {
      this.dragActive = false;
      event.stopPropagation();
      event.preventDefault();
      this.$store.commit("updateState/updateIDtoGo",this.$store.state.node_id);
      await this.dragUploadFile(event.dataTransfer.files);
      this.$emit("dragClose");
    },
    dropEventLeave(event){
      event.stopPropagation();
      event.preventDefault();
      this.$emit("dragClose");
      this.dragActive = false;
    },
    dropEventEnter(event){
      event.stopPropagation();
      event.preventDefault();
      this.dragActive = true;
    },
    dropEventOver(event){
      event.stopPropagation();
      event.preventDefault();
      this.dragActive = true;
    },

  },

}
</script>


<style scoped>
#dragArea{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dragActive{
  opacity: 1;
  background-color: rgba(30, 30, 30, 0.95);
  border-radius: 30px;
  border: 10px dashed #9055FF;
  animation: light 5s linear infinite;
}

@keyframes light {
0% {filter: hue-rotate(0deg);}
50% {filter: hue-rotate(90deg);}
100% {filter: hue-rotate(0deg);}
}
</style>