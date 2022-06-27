<template>

    <el-dialog
        title="VanIsLord 夜镇 留言板/聊天室规则"
        :visible.sync="isOpenShell"
        v-if="isOpenShell"
        :append-to-body = true
        top = "5vh"
        width="55%"
        @close = "closeDialog"
        center>
      <hr>
      <div class = "text">
        <span>欢迎来到大咕咕澡堂，大家可以在此畅所欲言，提出资源请求</span><br><br>
        <span>考虑到该聊天功能的性质（房间制聊天），留言板的房间并不能直接显示房间中的全部成员。但可以通过聊天框打下@进行查询</span><br><br>
        <span>大咕咕澡堂是所有用户都拥有的房间，在这里你可以找到所有其他用户。</span><br><br>
        <span>聊天室现有功能提供正常收发消息，开启/删除房间，回复消息，@其他人，已读系统与对消息做出表情回应</span><br><br><br><br>
        <span>关于已读：（如果你有用过telegram，那你会比较熟悉这套已读系统）</span><br><br>
        <span><i class="bi bi-check2"></i>表示该消息已被缓存至服务器数据库</span><br><br>
        <span><i class="bi bi-check2-all"></i>表示该消息已被发送至其他用户处</span><br><br><br><br>
        <span><i style="color:yellowgreen" class="bi bi-check2"></i><i style="color:yellowgreen" class="bi bi-check2-all"></i>图标颜色变为绿黄色则代表这条消息至少被房间中的一名其他用户已经看见了</span><br><br><br><br>
        <span>关于@其他人：</span><br><br>
        <span>@功能与qq，微信等主流聊天软件类似，点击消息中的@名字会开启一个与该用户的私人房间</span><br><br><br><br>
        <span>关于开启/删除房间：</span><br><br>
        <span>本系统允许你与其他用户一起开设房间，数量/人数不限，在房间人数==2时为私人房间，在房间人数==1时会在房间名处会提出警告。如果收到警告且你不再使用该房间，请删除该房间。</span><br><br>
        <span>本系统允许你邀请新用户到已有的房间。</span><br><br><br><br>
        <span>关于标记语言：</span><br><br>
        <span>如果你用过reddit，StackOverflow等论坛你应该会对高级转义文字格式（即标记语言）不陌生，这里我们也支持大部分格式转义，详细建议百度Markdown一词</span><br><br>
        <span>这里为简短的说明，只会介绍文字使用对应符号后的最终结果与相应的格式，如果要见实际效果，你可以选择自己尝试或者百度。</span><br><br>
        <span>加粗文字 Bold 符号为*，格式为 => <em>*你打的字*</em></span><br><br>
        <span>斜体文字 Italic 符号为_，格式为 => <em>_你打的字_</em></span><br><br>
        <span>添加中划线 Strikethrough 符号为~，格式为 => <em>~你打的字~</em></span><br><br>
        <span>添加下划线 Underline 符号为°，格式为 => <em>°你打的字°</em></span><br><br>
        <span>*与_可以嵌套使用 案例为 => <em>*This text is _extremely_ important*</em></span><br><br>
        <span>行内代码 Inline Code 符号为`，格式为 => <em>`你打的代码行`</em></span><br><br>
        <span>代码块 Multiline Code 符号为```，格式为 => <em>```你打的代码块```</em></span><br><br>
        <span>注意：所有符号皆为<em>英文输入法</em>原生符号。</span><br><br><br><br>
        <span>关于聊天守则：</span><br><br>
        <span>虽然说是畅所欲言，但凡事请有底线。</span><br><br>
        <span>尽量不要谈论不该谈论的事，不要攻击其他用户，要对线请去别处。</span><br><br>
        <span>请求资源可以，但不要做伸手党，不要一味的索求，学会贡献社群社群才会贡献你。</span><br><br>
        <span>有问题先百度，不要上来就发问，做一个有脑子的人。</span><br><br>
        <span>以上，祝你开心。</span><br><br>

        <span style="float: right"><em>--Tom "Van" Wang</em></span>

      </div>

      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="closeDialog">确 定</el-button>
  </span>
    </el-dialog>
</template>

<script>
export default {
  name: "AnnouncementForRoom",
  props:["isOpen"],
  data(){
    return{
      color: "#ded12f",
      isOpenShell: false,
    }
  },
  methods:{
    closeDialog(){
      this.$emit("closeAnnounce");
    }
  },
  watch:{
    'isOpen':{
      handler(val){
        this.isOpenShell = val;
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