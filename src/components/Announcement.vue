<template>
  <div class="announceStage" @mouseover = "showText" @mouseout = "hideText" @click = "handleClick">
    <svg class="icon bi" width="30" height="30" :fill="color" id = "announceIcon">
      <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#exclamation-circle'"></use>
    </svg>
    <transition name = "announceShow">
      <p v-show="isHover" id = 'announceContent'>公告</p>
    </transition>
    <el-dialog
        title="VanIsLord 夜镇 V1.0.0 公告"
        :visible.sync="isClicked"
        :append-to-body = true
        top = "5vh"
        width="55%"
        center>
      <hr>
      <div class = "text">
        <span>首先，感谢你使用VanIsLord夜镇系统</span><br><br>
        <span>本系统主要基于Chromes(V8内核浏览器)，致力于以群为单位的文件存储与资源交换，给各位提供一个相对自由、封闭的资源环境</span><br><br>
        <span>我希望在不久的未来，你可以存放放任何你想要的文件，不受限制的与群友分享你的任何资源，并与VanIsLord Jellyfin视频网站连接数据</span><br><br>
        <span>目前，VanIsLord只实现了基础的网盘存储功能，作为一切的基石，但功能已相对完整</span><br><br>
        <span>将来会开放更多客制化的功能，同时，如果你有好的想法和建议，也欢迎私聊告诉我</span><br><br>
        <span>基于我们现有的设备（DS720+ 小NAS）和可怜的硬盘空间（一块16t狼盘），现在每位用户使用大小限制为250GB。如果你觉得本系统还阔以并希望改善体验，欢迎捐款以升级服务器（所有捐助会全部用于服务器升级）</span><br><br>
        <span>允许的最大同时上传文件为4个，不支持文件夹上传，但支持批量上传</span><br><br>
        <span>本系统的开发人员只有两位（Van/YiXing Wu）,且完全从零开始的开发,我们已经尽量保证版本的稳定，但如果遇见任何bug，请联系我</span><br><br>
        <span>但也请你不要破坏性的使用本系统，做出一些正常人不会做的操作（什么上传文件中途删除目的地文件夹啊 尽管这个我们已经限制了）</span><br><br>
        <span>目前已知的问题有：部分UI不支持FireFox，资源占用可能较大，某些屏幕过小的设备可能存在页面溢出</span><br><br>
        <span>如果你了解开发/网络安全/部署/测试等并希望提出改进意见或加入开发，本系统已开源公开发布在docker hub与Github（https://github.com/wzl778633/vanIsLord），我们接受任何技术支持</span><br><br>
        <span>还有，<em>请勿请勿请勿</em>四处宣传本系统。以免迎来不必要的麻烦（自己用用得了，硬要说也不合法，对吧）</span><br><br>

        <span>已经开发完全的功能：</span><br>
        <ul style="list-style: none; font-size: 0.9em;">
          <li>&#x1F6EB 各类文件上传存储，无论大小！（理论上 不支持文件夹上传）</li>
          <li>&#x1F4C2 基本的文件分类，实时统计！（废话）</li>
          <li>&#x1F44B 拖动上传！无论在哪里都可以！（分类文件夹除外）</li>
          <li>&#x1F3A5 视频，图片，在线预览！几乎支持所有类型！（不支持的视频会被转码！现在的硬件情况仅支持一位用户同一时间有一个视频在转码）</li>
          <li>&#x1F528 支持所有外部下载工具！</li>
          <li>&#x1F31F 收藏夹</li>
          <li>&#x1F320 炫酷的UI，体验Van带给你夜空下的私人世界！</li>
        </ul>
        <br>
        <span>计划中的功能：</span><br>
        <ul style="list-style: none; font-size: 0.9em; ">
          <li>&#x1F917 现有功能优化（包括文件视图，列表，搜索等等）</li>
          <li>&#x1F468 Piazza 大咕咕广场 群友文件分享聚集地！</li>
          <li>&#x1F6E0 小工具 各式各样的工具！例如用于快速改名以一键将你的番剧电影上传至VanIsLord Jellyfin视频网站！</li>
          <li>&#x1F4CB 留言板 畅所欲言 留下你的需求看看别人有没有！</li>
          <li>&#x1F3BC 音乐播放器</li>
          <li>&#x1F685 数据库内已有文件秒传（已经实现，但出于稳定原因暂未开放）</li>
          <li>&#x1F494 传断了？没问题 换个电脑一样接着继续传！（已经实现，但出于稳定原因暂未开放）</li>
          <li>  And More...</li>
        </ul>
        <span>最后，再次感谢你使用VanisLord系统</span><br><br>
        <span style="float: right"><em>--Tom "Van" Wang & YiXing "star_wyx" Wu</em></span>

      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="isClicked = false">取 消</el-button>
    <el-button type="primary" @click="isClicked = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Announcement",
  data(){
    return{
      color: "#ded12f",
      isHover:false,
      isClicked:false
    }
  },
  methods:{
    showText(){
      this.isHover = true;
    },
    hideText(){
      this.isHover = false;
    },
    handleClick(){
      this.isClicked = true;
    }
  },
  watch:{
    'isHover':{
      handler(val){
        if(val){
          const body = document.querySelector("body");
          body.style.overflow = "hidden";
        }else{
          const body = document.querySelector("body");
          body.style.overflow = "hidden";
        }
      }
    }
  }

}
</script>

<style scoped>
.announceStage{
  width: 35px;
  height: max-content;
  text-align: center;
  overflow: visible;
}

#announceContent{
  color: white;
  margin: 0;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}

#announceContentHover {
  overflow: hidden;
  height: 0;
  color: white;
  margin: 0;
  transition: all 0.2s ease-in-out;
}
#announceIcon{
  transition: all 0.2s ease-in-out;
}

.announceStage:hover > #announceIcon{
  transform: scale(1.2);
  filter: drop-shadow(0px 0px 20px #f6bc06);
}

.text{
  font-size: 1.15em;
  color: black;
}

.announceShow-enter-active,.announceShow-leave-active{
  transition: all .1s ease-in-out;
}
.announceShow-enter,.announceShow-leave-to{
  transform: translateY(30px);
  opacity: 0;

}
</style>