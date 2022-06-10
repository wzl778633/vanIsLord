<template>
  <div class = "cccheader">
    <div class = "headerItem dummy"></div>
    <div :class = "isSharedMode ? 'headerItem name shareMode': 'headerItem name'"><span>文件名称</span>  <i @click = "sortByName" class = "bi-arrow-right-circle headIcon name"></i></div>
    <div v-if="isSharedMode" class = "headerItem user"><span>分享用户</span>  <i @click = "sortByUser" class = "bi-arrow-right-circle headIcon user"></i></div>
    <div class = "headerItem time"><span>上传时间</span>  <i @click = "sortByTime" class = "bi-arrow-right-circle headIcon time"></i></div>
    <div class = "headerItem size"><span>大小</span>  <i @click = "sortBySize" class = "bi-arrow-right-circle headIcon size"></i></div>
    <div :class = "isSharedMode ? 'headerItem tool shareMode': 'headerItem tool'"><span>快捷操作</span></div>
  </div>
</template>

<script>
export default {
  props:["nameState","userState","sizeState","timeState","isSharedMode"],
  name: "FakeHeader",
  methods:{
    sortByName(){
      this.$emit("sortByName");
    },
    sortByTime(){
      this.$emit("sortByTime");
    },
    sortBySize(){
      this.$emit("sortBySize");
    },
    sortByUser(){
      this.$emit("sortByUser");
    }
  },
  watch:{
    'nameState':{
      handler(val){
        let iconN = document.querySelector(".headIcon.name");
        let iconS = document.querySelector(".headIcon.size");
        let iconT = document.querySelector(".headIcon.time");
        iconS.className = "bi-arrow-right-circle headIcon size";
        iconT.className = "bi-arrow-right-circle headIcon time";
        if(this.isSharedMode){
          let iconU = document.querySelector(".headIcon.user");
          iconU.className = "bi-arrow-right-circle headIcon user";
        }
        if(val === 0){
          iconN.className = "bi-arrow-right-circle headIcon name up";
        }else{
          iconN.className = "bi-arrow-right-circle headIcon name down";
        }
      }
    },
    'sizeState':{
      handler(val){
        let iconN = document.querySelector(".headIcon.name");
        let iconS = document.querySelector(".headIcon.size");
        let iconT = document.querySelector(".headIcon.time");
        if(this.isSharedMode){
          let iconU = document.querySelector(".headIcon.user");
          iconU.className = "bi-arrow-right-circle headIcon user";
        }
        iconN.className = "bi-arrow-right-circle headIcon name"
        iconT.className = "bi-arrow-right-circle headIcon time"
        if(val === 0){
          iconS.className = "bi-arrow-right-circle headIcon size up";
        }else{
          iconS.className = "bi-arrow-right-circle headIcon size down";
        }
      }
    },
    'timeState':{
      handler(val){
        let iconN = document.querySelector(".headIcon.name");
        let iconS = document.querySelector(".headIcon.size");
        let iconT = document.querySelector(".headIcon.time");
        if(this.isSharedMode){
          let iconU = document.querySelector(".headIcon.user");
          iconU.className = "bi-arrow-right-circle headIcon user";
        }
        iconN.className = "bi-arrow-right-circle headIcon name"
        iconS.className = "bi-arrow-right-circle headIcon size"
        if(val === 0){
          iconT.className = "bi-arrow-right-circle headIcon time up";
        }else{
          iconT.className = "bi-arrow-right-circle headIcon time down";
        }
      }
    },
    'userState':{

      handler(val){
        let iconN = document.querySelector(".headIcon.name");
        let iconS = document.querySelector(".headIcon.size");
        let iconT = document.querySelector(".headIcon.time");
        iconN.className = "bi-arrow-right-circle headIcon name";
        iconS.className = "bi-arrow-right-circle headIcon size";
        iconT.className = "bi-arrow-right-circle headIcon time";
        if(this.isSharedMode){
          let iconU = document.querySelector(".headIcon.user");
          if(val === 0){
            iconU.className = "bi-arrow-right-circle headIcon user up";
          }else{
            iconU.className = "bi-arrow-right-circle headIcon user down";
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.cccheader{
  width: 100%;
  height: 40px;
  border-radius: 0 0 15px 15px;
  min-width: max-content;
  display: flex;
  background-color: rgba(175, 75, 239, 0.5);
  align-items: center;
}
.headIcon{
  display: inline-block;
}
.headIcon:before{
  transition: all 0.3s ease-in-out;
}
.headIcon.up:before{
  transform: rotate(-90deg);
}
.headIcon.down:before{
  transform: rotate(90deg);
}
.headerItem{
  color: white;

}
.headerItem.dummy{
  width: 40px;
  margin: 0 15px;
}
.headerItem.name{
  width: 50%;
  flex-grow: 1;
}
.headerItem.name.shareMode{
  width: 40%;
}
.headerItem.user{
   width: 5%;
   margin-right: 25px;
   margin-left: 15px;
   flex-grow: 0.5;
}
.headerItem.size{
  width: 5%;
  flex-grow: 0.5;
}
.headerItem.time{
  width: 5%;
  flex-grow: 0.5;
}
.headerItem.tool.shareMode{
  width: 88px;
  margin: 0 40px 0 20px;
}

.headerItem.tool{
  width: 88px;
  margin: 0 70px 0 20px;
}
</style>