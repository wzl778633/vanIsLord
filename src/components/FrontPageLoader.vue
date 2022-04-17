<template>
  <div id="wrap">
    <div id="list">
      <div class = "singlePage"> <div class = "pagePhotos top1"><div class = "divd"><img alt="page 1" @click = "recreate" src="../assets/imgs/001.jpg" class="realPagePhotos"></div></div></div>
      <div class = "singlePage"> <div class = "pagePhotos top2"><div class = "divd"><img alt="page 2" @click = "recreate" src="../assets/imgs/002.jpg" class="realPagePhotos"></div></div></div>
      <div class = "singlePage"> <div class = "pagePhotos top3"><div class = "divd"><img alt="page 3" @click = "recreate" src="../assets/imgs/003.png" class="realPagePhotos"></div></div></div>
      <div class = "singlePage"> <div class = "pagePhotos"><div class = "divd"><img @click = "recreate" alt="page 4" src="../assets/imgs/004.jpg" class="realPagePhotos"></div></div></div>
      <div class = "singlePage"> <div class = "pagePhotos"><div class = "divd"><img @click = "recreate" alt="page 5" src="../assets/imgs/005.png" class="realPagePhotos"></div></div></div>
      <div class = "singlePage"> <div class = "pagePhotos"><div class = "divd"><img @click = "recreate" alt="page 6" src="../assets/imgs/006.jpg" class="realPagePhotos"></div></div></div>
      <div class = "singlePage"> <div class = "pagePhotos"><div class = "divd"><img @click = "recreate" alt="page 7" src="../assets/imgs/007.jpg" class="realPagePhotos"></div></div></div>
      <div class = "singlePage"> <div class = "pagePhotos bottom1"><div class = "divd"><img @click = "recreate" alt="page 1" src="../assets/imgs/001.jpg" class="realPagePhotos"></div></div></div>
      <div class = "singlePage"> <div class = "pagePhotos bottom2"><div class = "divd"><img @click = "recreate" alt="page 2" src="../assets/imgs/002.jpg" class="realPagePhotos"></div></div></div>
      <div class = "singlePage"> <div class = "pagePhotos bottom3"><div class = "divd"><img @click = "recreate" alt="page 3" src="../assets/imgs/003.png" class="realPagePhotos"></div></div></div>
      <transition name = "exchange" type = "transition">
       <div key="needToShow" v-if = "ifRemove" @click = "remove" id = "background"></div>
      </transition>

    </div>
  </div>
</template>

<script>
export default {
  name: "FrontPageLoader",
  props: ["ifRemove"],
  data(){
    return{

    }
  },
  methods:{
    recreate(event){
        this.$emit("getImgSrc", event.target.src);
        let list = document.getElementById("list");list.className = "paused";
    },
    remove(event){

        setTimeout(() => { let list = document.getElementById("list");list.className = "active";},300);
        this.recover();
        this.$emit("getImgSrc", "");
    },
    recover(){
      let container = document.getElementById("selected");
      container.removeAttribute("id");
    }
  },

  mounted() {
    let pictures = document.getElementsByClassName("pagePhotos");
    let record = new Array();
    for (let picture of pictures){
      if(picture.className.includes("bottom")){
        let tmp = record.shift();
        picture.style.top = tmp.key1 +"%";
        picture.style.left = tmp.key2 +"%";
      }else{
        let top = Math.floor(Math.random()*42 + 4);
        let left = Math.floor(Math.random()*20);
        picture.style.top = top+"%";
        picture.style.left = left+"%";
        if(picture.className.includes("top")){
          record.push({"key1":top,"key2":left});
        }
      }
    }

    let realPictures = document.getElementsByClassName("realPagePhotos");
    for(let picture of realPictures){
      picture.addEventListener("mouseenter",function(event){
        let list = document.getElementById("list");
        list.className = "paused";
        let container = picture.parentElement;
        container.id = "selected";
      })

      picture.addEventListener("mouseleave",function(event){
        if(!document.getElementById("background")){
          let list = document.getElementById("list");
          list.className = "active";
          let container = picture.parentElement;
          container.removeAttribute("id");
        }
      })

    }
  }
}
</script>

<style scoped>
ul li {
  list-style: none;
}
* {
  margin: 0;
  padding: 0;
}
#wrap {
  height: 100%;
  position: relative;
  width: 8000px;
  overflow: hidden;
}
#list {
  height: 100%;
  position: absolute;
  animation:move 40s linear infinite normal;

}
#list.active{
  animation-play-state:running;
}
#list.paused{
  animation-play-state:paused;
}
.singlePage{
  width: 800px;
  height: 100%;
  float: left;
  position: relative;
}
.pagePhotos{
  width: 80%;
  height: 50%;
  position: absolute;
}


.divd{
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing:border-box;
  background-image:linear-gradient(to bottom right, #a95cc3, #08a1db);
  border-radius: 15px;
  box-shadow: 0 0 10px 5px black;
  transition: all 0.3s ease-in-out;
}
.realPagePhotos{

  width: 98%;
  height: 97%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  object-fit: cover;
  object-position: 10% 10%;


}
@keyframes move {
  from {
    transform: translateX(0); /* 自身节点*/
  }

  to {
    transform: translateX(-70%);
  }
}

#background{
  width: 100%;
  height: 100%;
  background-color: black;
  position: absolute;
  opacity: 0.7;
}

#selected{
  transform: scale(1.3);
  box-shadow: none;
}
.exchange-enter-active,.exchange-leave-active{
  transition: opacity 0.3s ease-in-out;
}

.exchange-enter,.exchange-leave-to{
  opacity: 0 !important;
}

</style>