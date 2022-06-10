<template>
<div :class = "isMainCollapse ? 'musicQuickEnter hide':'musicQuickEnter'">
  <div class="music-case" @click="openMusicPlayer">
    <transition name="musicClick">
      <div v-if = "!isOpen" class="front-case">
        <svg class="bi" width="30" height="30" fill="#c5e0b4">
          <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#' + 'headphones'"></use>
        </svg>
      </div>
    </transition>

      <div class="disc">
      <div class="hole"></div>
    </div>
    <transition name="musicClick">
    <div v-if = "!isOpen" class="back-case"></div>
    </transition>
  </div>
  <p :class = "isMainCollapse ? 'musicText hide': isOpen ? 'musicText green':'musicText'">来点音乐！</p>
</div>
</template>

<script>
export default {
  name: "musicQuickEnter",
  props:["isMainCollapse","musicOn"],
  data(){
    return{
      isOpen:false,
    }
  },
  methods:{
    openMusicPlayer(){
      this.isOpen = !this.isOpen;
      this.$emit('openMusicPlayer',this.isOpen)
    }
  },
  watch:{
    'isMainCollapse':{
      handler(val,oldval){
        if(val === false && oldval === true){
          let tmp = document.querySelector(".musicText");
          tmp.style.transition = "all 0.3s ease-in-out 0.3s"
          setTimeout(()=> tmp.style.transition = "all 0.3s ease-in-out", 400);
        }

      }
    },
    'musicOn':{
      handler(val){
        if(this.isOpen !== val){
          this.isOpen = val;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.music-case{
  width         : 50px;
  height        : 50px;
  position      : relative;
  margin-bottom : 5px;
  cursor        : pointer;
}


/* Front & Back Case */
.front-case,.back-case{
  width            : 50px;
  height           : 50px;
  border-radius    : 10px;
  background-color : rgba(white, 0.1);
  position         : relative;
  z-index          : 2;
  transition       : transform .3s ease;
  will-change      : transform;
}
/* Front Case */
.front-case{
  -webkit-backdrop-filter : blur(10px);
  backdrop-filter         : blur(10px);
  display                 : flex;
  align-items             : center;
  justify-content         : center;
}

/* Back Case */
.back-case{
  z-index    : 0;
  position   : absolute;
  left       : 0;
  top        : 0;
  box-shadow : 0 3.33px 5px -1px rgba(0,0,0,.3);
}

/* Disk: Black section; */
.disc{
  width            : 43.3px;
  height           : 43.3px;
  border-radius    : 50%;
  background-color : #333;
  position         : absolute;
  top              : 3.3px;
  left             : 3.3px;
  transition       : transform .5s ease-out;
  z-index          : 1;
  overflow         : hidden;
  box-shadow       : 0 5px 10px rgba(0,0,0,.3);
  background-image : repeating-radial-gradient(circle 10em at center,rgb(10, 17, 19) 0%,rgb(2, 41, 50) 2.2%,rgb(19, 31, 33) 3.6%,rgb(11, 29, 33) 4.8%,rgb(11, 29, 33) 4.8%,rgb(16, 43, 49) 6.7%);
  will-change      : transform;

/* Dish Shine Effect */
&:before,&:after{
            content       :" ";
            border-bottom : 23.3px solid rgba(255,255,255,.1);
            border-left   : 3.3px solid transparent;
            border-right  : 3.3px solid transparent;
            height        : 0;
            width         : 1.6px;
            position      : absolute;
          }
&:before{
   left   : 0;
   right  : 0;
   margin : auto;
   top    : 50%;
 }
&:after{
   left      : 0;
   right     : 0;
   margin    : auto;
   transform : rotate(180deg);
 }
}

/* Disk: Hole Section; */
.hole{
  width            : 16.6px;
  height           : 16.6px;
  background-color : #e74c3c;
  border-radius    : 50%;
  left             : 0;
  top              : 0;
  right            : 0;
  bottom           : 0;
  margin           : auto;
  position         : absolute;
  z-index          : 1;

&:before{
   content          :" ";
   width            : 6.6px;
   height           : 6.6px;
   border-radius    : 50%;
   background-color : #efefef ;
   left             : 0;
   right            : 0;
   top              : 0;
   bottom           : 0;
   position         : absolute;
   margin           : auto;
   box-shadow       : inset 0.83px 0.83px 1.66px rgba(0,0,0,.2);
 }
}

.music-case:hover{
.front-case, .back-case{
  transform: translateX(-16.6px);
}
.disc{
  transform: translateX(16.6px) rotate(380deg);
}
}


.musicClick-enter-active{
  transition: all .3s ease-in-out;
}
.musicClick-leave-active{
  transition: all .3s ease-in-out;
}
.musicClick-enter{
  transform: translateX(-50px) !important;
  opacity: 0;
}
.musicClick-leave-to{
  transform: translateX(-50px) !important;
  opacity: 0;
}


.musicQuickEnter{
  font-family: "AaGothic (Non-Commercial Use)";
  width: 220px;
  height: 60px;
  display:flex;
  color: white;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;
}
.musicQuickEnter.hide{
  width: 64px;
}
.musicText{
  width: 80px;
  height: 20px;
  overflow: hidden;
  margin-left: 30px;
  transition: all 0.3s ease-in-out;
}
.musicText.hide{
  margin: 0px;
  width: 0px;
  transition: all 0.3s ease-in-out;
}
.musicText.green{
  color: greenyellow;
  transform: scale(1.2);
}
.music-case:hover ~ .musicText{
  transition: all 0.3s ease-in-out;
  color: greenyellow;
  transform: scale(1.2);
}
</style>