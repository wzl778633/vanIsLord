<template>
  <!--暂时方案-->
  <div id="chatRoom" @click = "eliminateAt" @wheel = "eliminateAt">
    <chat-window
        height="100%"
        :current-user-id="currentUserId"
        :rooms-loaded="rooms_fullyLoad_flag"
        :messages-loaded="message_fullyLoad_flag"
        :rooms="rooms"
        :room-id="loadRoomProgrammatically"
        :messages="messages"
        :message-actions = "[{name: 'replyMessage',title: '回复该消息' },{name: 'editMessage',title: '编辑该消息',onlyMe: true},{name: 'deleteMessage',title: '删除该消息',onlyMe: true},]"
        ref = "ccc"
        :text-messages="{
            ROOMS_EMPTY: 'No conversation',
            ROOM_EMPTY: 'No conversation selected 未选中任何对话',
            NEW_MESSAGES: 'New message 新消息',
            MESSAGE_DELETED: 'This message has been deleted 该消息已被删除',
            MESSAGES_EMPTY: 'No message 没有消息哦',
            CONVERSATION_STARTED: 'The conversation started on 对话从这里开始:',
            TYPE_MESSAGE: 'Type your message 输入你的消息，Van听着呢',
            SEARCH: 'search 搜索房间',
            IS_ONLINE: 'online 在线',
            LAST_SEEN: 'last connection 上次在线',
            IS_TYPING: 'is typing... 正在打字中',
            CANCEL_SELECT_MESSAGE: 'Cancel selection 点我取消消息选中'
        }"
        :responsive-breakpoint ="800"
        @open-file = "download"
        @send-message = "handleSend"
        @edit-message = "handleEdit"
        @delete-message="handleDelete"
        @add-room ="addRoom"
        @fetch-messages="getThisRoomMessage"
        @menu-action-handler = "menuActionHandler"
        @send-message-reaction = "sendReaction"
        @open-user-tag = "openNewTagUserRoom"
        @open-failed-message = "reSendMessage"
        @room-info = "showAnnounce"
        :scroll-distance = "40"
        :show-files = "notEdit"
        :show-audio = "notEdit"
        :show-new-messages-divider = newMessageBarMarker
        :menu-actions="roomMenuAction"
        :accepted-files="'image/png, image/jpeg, image/jpg'"

        theme="dark"
    >
    </chat-window>
    <user-select-dialog :userSelectDialogShow = "userSelectDialogShow"  :userTotalList="userList" :usersAlreadyInRoom="usersAlreadyInRoom" @closeUserSelectWithUserList = "getUserList"></user-select-dialog>
    <new-room-name-dialog :renameDialog = "renameDialog" :roomId = "roomIdForRoomNameChange" @closeRename = "closeRename"></new-room-name-dialog>
    <AvatarUploudDialog :isOpen = "openAvatar" :userAvatarUpload = "false" :roomId = "rightNowRoomId" @closeAvatarUpload = "closeAvatarDialog"></AvatarUploudDialog>
    <announcement-for-room :isOpen = "announcementDialogShow" @closeAnnounce = "closeAnnounce"></announcement-for-room>
  </div>

</template>

<script>
import UserSelectDialog from "@/components/UserSelectDialog";
import NewRoomNameDialog from "@/components/NewRoomNameDialog";
import AvatarUploudDialog from "@/components/AvatarUploudDialog";
import AnnouncementForRoom from "@/components/AnnouncementForRoom";

export default {
  name: "ChatRoom",
  props:["someOneAT"],
  components: {AnnouncementForRoom, NewRoomNameDialog, UserSelectDialog,AvatarUploudDialog},
  data() {
    return {
      MONTH_COS:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
      announcementDialogShow:false,
      userSelectDialogShow:false,
      roomResetMarker:false,
      newMessageBarMarker:true,
      newRoomRequestSendOut:false,
      rightNowRoomId:1,
      loadRoomProgrammatically:1,
      roomIdForUserChange:0,
      roomIdForRoomNameChange:0,
      openAvatar:false,
      notEdit:false,
      isPrivateRoom:false,


      CONST_FOR_AT:null,
      tmpUserListForCreate:[],

      message_fullyLoad_flag:false,
      rooms_fullyLoad_flag:false,

      messageLastId:0,
      renameDialog:false,
      AtCounter:0,

      rooms: [],
      roomsNeedToBeAt: [],
      messages:[],
      mayFailedMessage:[],
      usersAlreadyInRoom:[],
      userList:[],
      roomMenuAction:[],
      currentUserId: this.$store.state.user_id,

      //:room-actions="[{name: 'favoriteRoom',title: 'Pin Room'}]"
    }
  },
  created() {
    this.$socket.emit('initialRoomBegin',localStorage.loginToken);
  },
  mounted() {
    this.initialAt();
  },
  methods:{
    showAnnounce(){
      if(this.rightNowRoomId === 1){
        this.announcementDialogShow = true;
      }
    },
    closeAnnounce(){
      this.announcementDialogShow = false;
    },
    //
    //
    //暂时方案
    eliminateAt(){
      let atRemove = document.getElementById(`${this.rightNowRoomId}At`);
      if(atRemove){
        atRemove.remove();
        this.AtCounter--;
        if(this.AtCounter === 0){
          this.$emit("eliminateAt");
        }
      }
    },

    initialAt(){
      for(let el of this.rooms){
        if(el.lastMessage){
          if(el.lastMessage.isAt){
            this.AtCounter++;
            let tmp = document.getElementById(el.roomId).querySelector(".vac-text-last").querySelector(".vac-format-container").querySelector(".vac-text-ellipsis");
            let id = el.roomId + "At";
            let text = `<span id = ${id} style='color:orange'>[有人@我]</span>`;
            tmp.insertAdjacentHTML('afterbegin', text);
          }
        }
      }
    },
    openNewTagUserRoom({ user } = data){
      if(this.currentUserId === user._id){
        this.$message({
            type: 'error',
            message: '无法与自己打开一个房间!'
        });
        return;
      }

      this.$confirm(`这将打开一个与${user.username}的新房间，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let userList = [this.currentUserId,user._id];
        //console.log(userList);
        this.$socket.emit("roomUserChanged",userList,0,[],[]);
      }).catch(() => {});
    },
    openAvatarDialog(){
      this.openAvatar = true;
    },
    closeAvatarDialog(){
      this.openAvatar = false;
    },
    async download(params){
      let {msg, file} = params;
      const a = document.createElement('a');
      a.download = `${file.file.name}`;
      //a.href = `https://aijiangsb.com:9070/api/vdownload/${this.hash}?token=${localStorage.loginToken}`;
      let realUrl = file.file.url.replace('vopen','vdownload')
      a.href = realUrl;
      await a.click();
      a.remove();
    },
    handleSend({roomId, content, files, replyMessage, usersTag} = data){
      //console.log("send");
      //console.log(replyMessage);
      let tmpId = Date.now();
      let time = `${new Date().getHours()<10?'0'+new Date().getHours():new Date().getHours()}:${new Date().getMinutes()<10?'0'+new Date().getMinutes():new Date().getMinutes()}`;
      // let filesBlob;
      //
      // if (files) {
      //   files = this.formattedFiles(files);
      // }

      //console.log(files)
      let singleMessage = {
        _id: tmpId,
        indexId: tmpId,
        content: content,
        senderId: this.$store.state.user_id,
        username: this.$store.state.user_name,
        avatar: `${this.$addr}/vavatar/${this.$store.state.user_id}?time=static`,
        date: `${new Date().getFullYear()}/${(new Date().getMonth()+1)<10? '0'+ (new Date().getMonth()+1):(new Date().getMonth()+1)}/${new Date().getDate()<10? '0'+new Date().getDate():new Date().getDate()}`,
        timestamp: time,
        system: false,
        saved: false,
        distributed: false,
        seen: false,
        deleted: false,
        failure: false,
        disableActions: true,
        disableReactions: true,
        files: files,
        reactions: {},
        replyMessage: replyMessage,
        users:usersTag,
    };

      this.messages.push(singleMessage);
      // if (files) {
      //   this.uploadFile(files);
      // }

      let userIdList = [];
      for(let el of usersTag){
        userIdList.push(el._id);
      }
      let reply = [];
      if(replyMessage){
        reply.push(replyMessage._id);
        reply.push(replyMessage.senderId);
      }

      let failedTimer = setTimeout(()=>{
        for(let i = (this.messages.length-1); i >= 0 ; i--) {
          if(this.messages[i]._id === tmpId){
            this.messages[i].failure = true;
            break;
          }
        }
      },120000);
      this.mayFailedMessage.push({reply:reply,userIdList:userIdList,tmpId:tmpId,failedTimer:failedTimer});
      this.$socket.emit('sendMessage',roomId,content,null,reply,userIdList,this.$store.state.user_id,tmpId);
      this.newMessageBarMarker = false;
    },
    reSendMessage({ roomId, message } = data){
      let tmpId = message._id;
      for(let i = (this.messages.length-1); i >= 0 ; i--) {
        if(this.messages[i]._id === tmpId){
          this.messages[i].failure = false;
          break;
        }
      }

      for(let j = (this.mayFailedMessage.length-1); j >= 0; j--){
        if (this.mayFailedMessage[j].tmpId === message._id) {


          let failedTimer = setTimeout(()=>{
            for(let i = (this.messages.length-1); i >= 0 ; i--) {
              if(this.messages[i]._id === tmpId){
                this.messages[i].failure = true;
                break;
              }
            }
          },120000);

          this.mayFailedMessage[j].failedTimer = failedTimer;
          this.$socket.emit('sendMessage',roomId,message.content,null,this.mayFailedMessage[j].reply,this.mayFailedMessage[j].userIdList,message.senderId,tmpId);
          break;
        }
      }

    },

    sendReaction({ roomId, messageId, reaction, remove } = data){
      remove = remove !== undefined ? remove : false;
      this.$socket.emit('sendReaction',roomId, messageId, reaction.unicode, remove);
    },
    //
    //修改消息
    handleEdit({roomId, messageId, newContent, files, replyMessage, usersTag} = data){
      //console.log("edit");
      let userIdList = [];
      for(let el of usersTag){
        userIdList.push(el._id);
      }
      let reply = [];
      if(replyMessage){
        reply.push(replyMessage._id);
        reply.push(replyMessage.senderId);
      }
      this.$socket.emit("editMessage",roomId,messageId,newContent,reply,userIdList);
    },
    formattedFiles(files) {
      const formattedFiles = []
      files.forEach(file => {
        const messageFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          extension: file.extension || file.type,
          url: file.url || file.localUrl
        }
        if (file.audio) {
          messageFile.audio = true
          messageFile.duration = file.duration
        }
        formattedFiles.push(messageFile)
      })
      return formattedFiles
    },
    //删除消息
    handleDelete({roomId, message} = data){
      // console.log("delete")
      // console.log(roomId)
      // console.log(message)
      this.$socket.emit("deleteMessage",roomId,message._id);
      message.saved = false;
      message.distributed = false;
      message.seen = false;
    },
    //添加新房间
    addRoom(){
      // console.log("addRoom");
      this.roomIdForUserChange = 0;
      this.$socket.emit("newRoomUserList");
      this.newRoomRequestSendOut = true;
    },

    //房间操作
    menuActionHandler({ roomId, action }) {
      switch (action.name) {
        case 'inviteUser':
          this.roomIdForUserChange = roomId;
          this.$socket.emit("inviteUserList",roomId);
          break;
        case 'removeUser':
          this.$confirm('是否退出该聊天房间？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$socket.emit("removeUserFromRoom",roomId);
            this.loadRoomProgrammatically = null;
          }).catch(() => {});
          break;
        case 'deleteThisRoom':
          this.$confirm('是否删除该私人聊天房间？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$socket.emit("deleteRoom",roomId);
            this.loadRoomProgrammatically = null;
          }).catch(() => {});
          break;
        case 'changeAvatar':
          this.openAvatarDialog();
          break;
        case 'rename':
          this.nameChange(this.rightNowRoomId);
          break;
        default:
            break;
      }
    },
    // messageActionHandler({ roomId, action, message }) {
    //   switch (action.name) {
    //     case 'editMessage':
    //       this.notEdit = false;
    //   }
    // },
    //从选择器中获得所需的userlist
    async getUserList(value){
      if(value){
        this.userSelectDialogShow = false;
        if(this.roomIdForUserChange === 0){
          this.$socket.emit("roomUserChanged",value,this.roomIdForUserChange,[],[]);
        }
        else{
          let newUserList = [];
          let oldUserList = [];
          this.usersAlreadyInRoom = this.usersAlreadyInRoom.map(x=>x._id);
          for(let i = 0; i < value.length; i++){
            if(this.usersAlreadyInRoom.includes(value[i])){
              oldUserList.push(value[i]);
            }
            else{
              newUserList.push(value[i]);
            }

          }
          this.$socket.emit("roomUserChanged",value,this.roomIdForUserChange,newUserList,oldUserList);
        }

      }
      else{
        this.userSelectDialogShow = false;
      }
    },

    //上传文件
    async uploadFile(files){
      for(let file of files){
        const formData = new FormData();
        formData.append("files", file);
        formData.append("user_id", this.$store.state.user_id);
        let {data:res} = await this.$http.post("/file/upload",formData,{headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (progressEvent) => {
                file.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              },
            }
        ).catch((error) => {
          if(error.status !== 401) {
            this.$message.error("图片或者语音消息上传出现未知异常，请联系Van! Code: " + error.message);
          }
        });
        if(res.code === 200){
          file.url = `${this.$addr}/vopen/${this.hash}?token=${localStorage.loginToken}&fullfilename=${file.name}`;
        }
      }
    },

    nameChange(roomId){
      this.renameDialog = true;
      this.roomIdForRoomNameChange = roomId;
    },
    closeRename(){
      this.renameDialog = false;
    },

    //important
    getThisRoomMessage({room, options} = data){
      if(options){
        if(options.reset){
          this.rightNowRoomId = room.roomId;
          for(let el of this.rooms){
            if(el.roomId === room.roomId){
              el.unreadCount = 0;
              if(el.lastMessage){
                el.lastMessage.new = false;
              }
              break;
            }
          };
          if(room.users.length > 1){
            this.isPrivateRoom = false;
          }
          else{
            this.isPrivateRoom = true;
          }

          if(this.rightNowRoomId !== 1) {
            if(this.isPrivateRoom){
              this.roomMenuAction = [{name: 'inviteUser',title: '邀请其他用户'},{name: 'deleteThisRoom',title: '删除该房间'},{name: 'changeAvatar',title: '更改房间头像'}];
            }
            else{
              this.roomMenuAction =[{name: 'inviteUser',title: '邀请其他用户'}, {name: 'removeUser',title: '退出该房间'},{name: 'rename',title: '修改房间名称'},{name: 'changeAvatar',title: '更改房间头像'}];
            }
          }
          else{
            this.roomMenuAction = [];
          }

          for(let j = (this.mayFailedMessage.length-1); j >= 0; j--){
              clearTimeout(this.mayFailedMessage[j].failedTimer);
          }
          this.mayFailedMessage = [];
          this.message_fullyLoad_flag = false;
          this.roomResetMarker = true;
          this.newMessageBarMarker = true;
          this.messages = [];
          this.messageLastId = 0;
          this.$socket.emit("rightNowRoom",room.roomId);
        }
      }
      this.$socket.emit("fetchmessages",room.roomId,this.messageLastId);

    },
  },

  sockets: {
    initialRoom(data){
      this.rooms = data;
      this.rooms_fullyLoad_flag = true;
    },
    newMessageAdded(data){
      if(this.messages.length === 0){
        this.newMessageBarMarker = false;
      }
      else if(this.newMessageBarMarker && this.messages[this.messages.length -1].senderId === this.$store.state.user_id){
        this.newMessageBarMarker = false;
      }
      this.messages.push(data);
      this.$socket.emit('iSeen',this.rightNowRoomId,data._id,this.$store.state.user_id);

    },
    roomInfoChange(data){
      for(let el of this.rooms) {
        if(el.roomId === data.roomId){
          el.roomName = data.newRoomName;
          el.users = data.users;
          break;
        }
      }
    },
    newRoomAdded(data){
      this.rooms.push(data);
      if(this.newRoomRequestSendOut){
        this.rightNowRoomId = data.roomId;
        this.loadRoomProgrammatically = data.roomId;
      }
      this.newRoomRequestSendOut = false;
    },
    unreadUpdate(data){
      for(let el of this.rooms){
        if(el.roomId === data.roomId){
          el.unreadCount = data.unreadCount;
          el.index = data.index;
          el.lastMessage = data.lastMessage;

          if(data.lastMessage.isAt){
            if(!document.getElementById(`${el.roomId}At`)) {
              this.AtCounter++;
              let tmp = document.getElementById(el.roomId).querySelector(".vac-text-last").querySelector(".vac-format-container").querySelector(".vac-text-ellipsis");
              let id = el.roomId + "At";
              let text = `<span id = ${id} style='color:orange'>[有人@我]</span>`;
              tmp.insertAdjacentHTML('afterbegin', text);
            }
          }else if(data.lastMessage.usersTag && data.lastMessage.usersTag.length !== 0){
            if(data.lastMessage.usersTag.includes(this.currentUserId)){
              if(!document.getElementById(`${el.roomId}At`)) {
                this.AtCounter++;
                let tmp = document.getElementById(el.roomId).querySelector(".vac-text-last").querySelector(".vac-format-container").querySelector(".vac-text-ellipsis");
                let id = el.roomId + "At";
                let text = `<span id = ${id} style='color:orange'>[有人@我]</span>`;
                tmp.insertAdjacentHTML('afterbegin', text);
              }
            }
            // else{
            //   let atRemove = document.getElementById(`${el.roomId}At`);
            //   if(atRemove){
            //     atRemove.remove();
            //   }
            // }
          }
          // else{
          //   let atRemove = document.getElementById(`${el.roomId}At`);
          //   if(atRemove){
          //     atRemove.remove();
          //   }
          // }

          break;
        }
      };
    },

    senderNewMessageAdded(data){
       this.messages.push(data);
    },
    senderNewMessageSaved(data){
      if(data.roomId === this.rightNowRoomId) {
        for (let i = (this.messages.length-1); i >= 0; i--) {
          if (this.messages[i]._id === data.dummyId) {
            this.messages[i]._id = data._id;
            //this.messages[i].files = data.files;
            this.messages[i].saved = true;

            for(let j = (this.mayFailedMessage.length-1); j >= 0; j--){
              if (this.mayFailedMessage[j].tmpId === data.dummyId) {
                clearTimeout(this.mayFailedMessage[j].failedTimer);
                this.mayFailedMessage.splice(j,1);
                break;
              }
            }
            break;
          }
        }
      }
    },
    messageSeen(data){
     for(let el of this.rooms) {
        if (el.roomId === data.roomId) {
          if (el.lastMessage.senderId === this.currentUserId && data.seenList.includes(el.lastMessage._id)) {
            el.lastMessage.seen = true;
            break;
          }
        }
      }
      if(data.roomId === this.rightNowRoomId){
        for(let el of data.seenList){
          for(let i = (this.messages.length-1); i >=0 ; i--){
            if(this.messages[i]._id === el){
              this.messages[i].seen = true;
              break;
            }
          }
        }
      }
    },
    distributeFinished(data){
      //data[0] == roomID; data[1] == _id;
      for(let el of this.rooms){
        if(el.roomId === data[0]){
          if(el.lastMessage.senderId === this.currentUserId && el.lastMessage._id === data[1]){
            el.lastMessage.distributed = true;
          }
          for(let i = (this.messages.length-1); i >= 0;i--){
            if(this.messages[i]._id === data[1]){
              this.messages[i].distributed = true;
              this.messages[i].disableActions = false;
              this.messages[i].disableReactions = false;
              break;
            }
          }
          break;
        }
      }

    },

    roomDeleted(data){
      if(this.rightNowRoomId === data){
        this.rightNowRoomId = 1;
        this.loadRoomProgrammatically = 1;
      }
      for(let [index,el] of this.rooms.entries()){
        if(el.roomId === data) {
          this.rooms.splice(index,1);
        }
      }
    },
    renewMessage(data){
      this.message_fullyLoad_flag = false;
      if(data.content.length > 0){
        this.messages = data.content.concat(this.messages);
        this.messageLastId = data.content[0]._id;
      }
      if(data.MessageEnd){
        this.message_fullyLoad_flag = true;
      }
      if(this.roomResetMarker && this.messages.length > 0){
        this.$socket.emit('iSeen',this.rightNowRoomId,data.content[data.content.length-1]._id,this.$store.state.user_id);
        this.roomResetMarker = false;
      }
    },
    userListAccessed(data){
      this.userList = data.userList;
      this.usersAlreadyInRoom = data.userAlreadyInRoomList;
      this.userSelectDialogShow = true;
    },
    messageDeleted(data){
      for (let i = (this.messages.length-1); i >= 0; i--) {
        if (this.messages[i]._id === data) {
          this.messages[i].deleted = true;
          break;
        }
      }
    },
    messageEdited(data){
      if(data._id < this.messages[0]._id){
        return;
      }

        for (let i = (this.messages.length-1); i >= 0; i--) {
          if (this.messages[i]._id === data._id) {
            this.messages[i] = data;
            this.$socket.emit('iSeen',this.rightNowRoomId,data._id,this.$store.state.user_id);
            break;
          }
        }


    },
    editAtYou(data){
      for(let el of this.rooms){
        if(el.roomId === data){
          if(!document.getElementById(`${el.roomId}At`)) {
            this.AtCounter++;
            let tmp = document.getElementById(el.roomId).querySelector(".vac-text-last").querySelector(".vac-format-container").querySelector(".vac-text-ellipsis");
            let id = el.roomId + "At";
            let text = `<span id = ${id} style='color:orange'>[有人@我]</span>`;
            tmp.insertAdjacentHTML('afterbegin', text);
          }
        }
      }
    },
    changedRoomName(data){
      for(let el of this.rooms) {
        if(el.roomId === data.roomId){
          el.roomName = data.roomName;
          break;
        }
      }
    },
    userStatusChanged(data){
      if(this.rooms.length !== 0){
        for(let el of this.rooms) {
          for(let user of el.users){
            if(user._id === data._id){
              user.status.state = data.status.state;
              user.status.lastChanged = data.status.lastChanged;
              break;
            }
          }
        }
      }
    },
    reactionAdded(data){
      for (let i = (this.messages.length-1); i >= 0; i--) {
       if(this.messages[i]._id === data.messageId){
         this.messages[i].reactions = data.reactions;
         break;
       }
      }
    }
  },




  activated() {
    const scrollTop = this.$route.meta.scrollTop;
    let container = this.$refs.ccc.$children[1].$refs.scrollContainer;
    container.scrollTop = scrollTop;
  },
}
</script>

<style scoped>
#chatRoom{
  width: 100%;
  height:calc(100vh - 110px);
}

/deep/ .vac-container-scroll::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

/deep/ .vac-container-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(164, 159, 159, 0.7);
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;
  display: none;
}
/deep/ .vac-container-scroll:hover::-webkit-scrollbar-thumb {
  display: unset;
}
/deep/ .vac-container-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #a49f9f;
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;
}
/deep/ .vac-container-scroll::-webkit-scrollbar-track {
  background-color: #2D2C2CFF;
  border-radius: 100vw;
  margin-block: .5em;
  transition: all 0.3s ease-in-out;
  display: none;
}
/deep/ .vac-container-scroll:hover::-webkit-scrollbar-track{
  display: unset;
}


/deep/ .vac-room-list::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

/deep/ .vac-room-list::-webkit-scrollbar-thumb {
  background-color: rgba(164, 159, 159, 0.7);
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;
  display: none;
}
/deep/ .vac-room-list:hover::-webkit-scrollbar-thumb {
  display: unset;
}
/deep/ .vac-room-list::-webkit-scrollbar-thumb:hover {
  background-color: #a49f9f;
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;

}
/deep/ .vac-tags-container::-webkit-scrollbar-track {
  background-color: #2D2C2CFF;
  border-radius: 100vw;
  margin-block: .5em;
  display: none;
}
/deep/ .vac-tags-container:hover::-webkit-scrollbar-track{
  display: unset;
}


/deep/ .vac-tags-container::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

/deep/ .vac-tags-container::-webkit-scrollbar-thumb {
  background-color: rgba(164, 159, 159, 0.7);
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;
  display: none;
}
/deep/ .vac-tags-container:hover::-webkit-scrollbar-thumb {
  display: unset;
}
/deep/ .vac-tags-container::-webkit-scrollbar-thumb:hover {
  background-color: #a49f9f;
  border-radius: 100vw;
  border: 2px #2D2C2CFF solid;

}
/deep/ .vac-tags-container::-webkit-scrollbar-track {
  background-color: #2D2C2CFF;
  border-radius: 100vw;
  margin-block: .5em;
  display: none;
}
/deep/ .vac-tags-container:hover::-webkit-scrollbar-track{
  display: unset;
}
</style>