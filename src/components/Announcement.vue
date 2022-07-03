<template>
  <div class="announceStage" @mouseover = "showText" @mouseout = "hideText" @click = "handleClick">
    <svg class="icon bi" width="30" height="30" :fill="color" id = "announceIcon">
      <use :xlink:href="require('/node_modules/bootstrap-icons/bootstrap-icons.svg')+'#exclamation-circle'"></use>
    </svg>
    <transition name = "announceShow">
      <p v-show="isHover" id = 'announceContent'>公告</p>
    </transition>
    <el-dialog
        title="VanIsLord 夜镇 V1.5.0 公告"
        :visible.sync="isClicked"
        :append-to-body = true
        top = "5vh"
        width="55%"
        center>
      <hr>
      <div class = "text">
        <span>首先，再次感谢你使用VanIsLord夜镇系统</span><br><br>
        <span>本系统主要基于Chromes(V8内核浏览器)，致力于以群为单位的文件存储与资源交换，给各位提供一个相对自由、封闭的资源环境</span><br><br>
        <span>经过近两个月的不懈努力，现在的系统已经具备大部分功能存放文件，在线预览，不受限制的分享资源，完全自制的web音乐播放器甚至是聊天系统，这一版本更新了几乎计划中的所有主要功能</span><br><br>
        <span>将来仅会增加小工具，现有功能的优化与对接jellyfin视频网站的对接功能，但如果你有功能上的建议，欢迎私聊告诉我</span><br><br>
        <span>基于我们现有的设备（DS720+ 小NAS）和可怜的硬盘空间（一块16t狼盘），每位用户的使用大小限制依旧为250GB，但我们已尽力优化储存算法以腾出更多的空间用于储存。如果你觉得本系统还阔以并希望改善体验，欢迎捐款以升级服务器（所有捐助会全部用于服务器升级）</span><br><br><br><br>
        <span>允许的最大同时上传文件为4个，依旧不支持文件夹上传，但支持批量上传</span><br><br>
        <span>文件系统大幅度升级，你可以在主网盘区多选文件并拖动移动至其他文件夹，网格表格视图切换。<em style="color:red">注意：所有的批量操作都在页面上方的工具栏中！右键与文件列表/网格中的按钮都为单文件操作！今后可能对右键菜单做优化</em></span><br><br>
        <span>分享系统正式上线，允许用户分享任何在其网盘中的已有文件，并能获取其他用户的分享文件</span><br><br>
        <span>文件预览类型得到大幅度强化，docx，ppt，压缩包，xlsx等均可在线预览！<em style="color:red">注意，对于doc/docx来说首次加载会出现一段长时间白屏用于后台转换，文件越大越复杂转换时间越长</em></span><br><br>
        <span>聊天系统每位用户会有一个固定的集体聊天室 "大咕咕广场"， 但你也可以邀请任意的其他用户私人聊天，但请你尊重每一位用户，不要只是一味的索求资源。</span><br><br>
        <span>更多功能细节详见下方</span><br><br><br><br>

        <span>本系统的开发人员只有两位（Van/YiXing Wu）,且完全从零开始的开发,我们已经尽量保证版本的稳定，但如果遇见任何bug，请立刻联系我</span><br><br>
        <span>但也请你不要破坏性的使用本系统，做出一些正常人不会做的操作</span><br><br><br><br>

        <span><em style="color:red">目前已知的问题有：</em></span><br><br>
        <span><em style="color:red">重要！HEVC 10bit编码格式的视频现不支持在线预览，会在7月初解决。所以请勿多次打开无法在第一次打开时正常播放的视频！！</em></span><br><br>
        <span><em style="color:red">重要！批量删除可能出现错误，刷新即可暂时解决</em></span><br><br>
        <span>上传的暂停/中止都必须以9mb为一个界限。http上传链接超过8分钟会被浏览器强制中断（即上传速度在8mins内低于6.4KB/S）。不支持FireFox。资源占用可能较大。某些屏幕过小的设备可能存在页面溢出</span><br><br>
        <span>如果你了解开发/网络安全/部署/测试等并希望提出改进意见或加入开发，本系统已开源公开发布在docker hub与Github（https://github.com/wzl778633/vanIsLord），我们接受任何技术支持</span><br><br>
        <span>或者你有好的画作也可以给我，我可以将其放置在登录页面彰显我们的独特</span><br><br>
        <span>还有，<em style="color:red">请勿请勿请勿</em>四处宣传本系统。以免迎来不必要的麻烦（自己用用得了，硬要说也不合法，对吧）</span><br><br>

        <span>已经开发完全的功能：</span><br>
        <ul style="list-style: none; font-size: 0.9em;">
          <li>&#x1F6EB 基于MD5的文件储存，各类文件上传存储，无论大小！基本的文件分类，实时统计（不支持文件夹上传）</li>
          <li>&#x1F4C2 网格与列表视图的互相切换，帮助你更好的整理文件！</li>
          <li>&#x1F917 文件现在可以批量操作了！可以被复数选中！可以复数或单独将文件拖动至其他文件夹！（仅在自己的网盘区）</li>
          <li>&#x1F44B 拖动上传！无论在哪里都可以！（分类文件夹除外）</li>
          <li>&#x1F3A5 视频，图片，xmlx，docx，zip等各类文件在线预览！大量新增可预览文件！部分基于kkFileView。（不支持的视频会被转码！现在的硬件情况仅支持一位用户同一时间有一个视频在转码）</li>
          <li>&#x1F528 支持所有外部下载工具，且支持批量下载！</li>
          <li>&#x1F468 Piazza 大咕咕广场 群友文件分享聚集地！</li>
          <li>&#x1F3BC 完全自制的web音乐播放器，支持主流音乐类型！</li>
          <li>&#x1F4CB 留言板 完整的聊天系统！</li>
          <li>&#x1F320 炫酷的UI，体验Van带给你夜空下的私人世界！</li>
        </ul>
        <br>
        <span>计划中的功能：</span><br>
        <ul style="list-style: none; font-size: 0.9em; ">
          <li>&#x1F6E0 现有功能优化补强，例如聊天系统，上传等</li>
          <li>&#x1F6E0 小工具 各式各样的工具！基于TMDB的改名工具以方便将你的番剧/电影上传至VanIsLord Jellyfin视频网站！</li>
          <li>&#x1F685 数据库内已有文件秒传（已经实现，但出于稳定原因暂未开放）</li>
          <li>&#x1F494 文件断点续传（已经实现，但出于稳定原因暂未开放）</li>
        </ul>
        <span>最后，再次感谢你使用VanisLord系统</span><br><br>
        <span style="float: right"><em>--Tom "Van" Wang & YiXing "star_wyx" Wu</em></span>

      </div>

      <span slot="footer" class="dialog-footer">
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