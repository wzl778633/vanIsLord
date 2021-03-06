import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const updateModule = {
  namespaced:true,
  state: () => ({
    idToGo:1,
    dangerChecker: false,
    tmpElement:{},
    preparedFiles: [],
    uploadingFiles: [],
    pausedFiles: [],
    waitingFiles:[],
    uploadedFiles: [],
    uploadVisible: false,
  }),


  mutations: {
    pushFile(state, [file, filesize]){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let dates = date.getDate();
      state.preparedFiles.unshift({
        name: file.name,
        size: filesize,
        realSize:file.size,
        finishSize:0,
        speed:"计算中",
        id: file.uid,
        leftTime:"计算中",
        lastTime:Date.now(),
        status:"准备中..",
        complete: 0,
        tmpComplete:0,
        date: `${year}-${month}-${dates}`,
        hash:"",
        fileType:"question-octagon",
        filePartList:[],
        pausedList:[],
        calculating:false,
        noErrorFlag: true,
        isFinished: false,
        isPause:false,
        isGG:false,
      });
    },

    updateHash(state, [uid,hash]){
      for (let element of state.preparedFiles){
        if(element.id === uid){
          element.hash = hash;
          element.status = "排队中..";
          break;
        }
      }
    },
    popFile(state){
      state.tmpElement = state.waitingFiles.pop();
    },

    pushToUploading(state,flag){
      if(flag) {
        state.tmpElement.isPause = false;
        state.tmpElement.status = '正在上传';
      }
        state.uploadingFiles.unshift(state.tmpElement);
        state.tmpElement = {};


    },

    //更新下载，时间，速度，唯一的缺点是无法显示一秒以内上传完毕的信息；
    addCompleteNess(state, [uid, loadThisTime]){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.tmpComplete = element.tmpComplete + loadThisTime;
          element.complete = Number(((element.tmpComplete/element.realSize)*100).toFixed(2));
          if(element.complete > 100){
            element.complete = 100;
          }
          if(Date.now() - element.lastTime >= 1000 && !element.calculating){
            element.calculating = true;

            let nowTime = new Date().getTime();

            let intervalSize = element.tmpComplete - element.finishSize;
            element.finishSize = element.tmpComplete;

            let intervalTime = (nowTime - element.lastTime)/1000;//时间单位为毫秒，需转化为秒

            let speed = intervalSize/intervalTime;
            let bSpeed = speed; //保存以b/s为单位的速度值，方便计算剩余时间
            let units = 'bytes/s';//单位名称
            if(speed/1024>1){
              speed = speed/1024;
              units = 'Kbs/s';
            }
            if(speed/1024>1) {
              speed = speed / 1024;
              units = 'MBs/s';
            }
            element.speed = speed.toFixed(2) + units;
            //element.complete = Number((element.finishSize/element.realSize).toFixed(2))*100;
            let leftTime = Math.ceil((element.realSize - element.finishSize)/ bSpeed);
            if(leftTime < 0){
              leftTime = 0;
            }
            let hour = parseInt(leftTime / 3600);
            let minute = parseInt((leftTime - (hour * 3600)) / 60);
            let sec = leftTime - (hour * 3600) - (minute * 60);
            let str = "";
            str = hour > 0 ? hour + '小时' : '';
            str = minute > 0 ? str + minute + '分钟' : str + '';
            str = sec > 0 ? str + sec + '秒' : str + '0秒';
            element.leftTime = str;
            element.lastTime = nowTime;
            element.calculating = false;
          }

          break;
        }
      }

    },

    updateCompleted(state, uid){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.status = "完成上传";
          element.complete = 100;
          element.isFinished = true;
          element.filePartList = [];
          this.commit("updateState/removeFile",element);
          state.uploadedFiles.unshift(element);
          break;
        }
      }
    },
    updateStatus(state, [uid,status]){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.status = status;
          break;
        }
      }
    },

    //真正的abort
    realAbort(state, [uid,status]){
      if(status === '排队中..') {
        for (let element of state.waitingFiles){
          if(element.id === uid){
            element.status = "上传中断";
            element.isFinished = true;
            element.filePartList = [];
            state.waitingFiles.splice(state.waitingFiles.indexOf(element), 1);
            state.uploadedFiles.unshift(element);
            break;
          }
        }
      }
      else if(status === '正在上传'){
        for (let element of state.uploadingFiles){
          if(element.id === uid){
            element.status = "上传中断";
            element.isFinished = true;
            element.filePartList = [];
            this.commit("updateState/removeFile",element);
            state.uploadedFiles.unshift(element);
            break;
          }
        }
      }
      else if(status === '已暂停'){
        for (let element of state.pausedFiles){
          if(element.id === uid){
            element.status = "上传中断";
            element.isFinished = true;
            element.filePartList = [];
            state.pausedFiles.splice(state.pausedFiles.indexOf(element), 1);
            state.uploadedFiles.unshift(element);
            break;
          }
        }
      }

    },
    //异步更新abort状态 为真abort做准备
    updateAbort(state, uid){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.isGG = true;
          element.status = "中止中..";
          break;
        }
      }
    },
    updateWaitAbort(state, uid){
      for (let element of state.waitingFiles){
        if(element.id == uid){
          element.isGG = true;
          element.status = "中止中..";
          break;
        }
      }
    },
    updatePausedAbort(state, uid){
      for (let element of state.pausedFiles){
        if(element.id == uid){
          element.isGG = true;
          element.status = "中止中..";
          break;
        }
      }
    },


    updateCompleteFailed(state, uid){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.status = "上传失败";
          element.noErrorFlag = false;
          element.isFinished = true;
          element.filePartList = [];
          this.commit("updateState/removeFile",element);
          state.uploadedFiles.unshift(element);
          break;
        }
      }
    },

    updateTotallyCompleteFailed(state, uid){
      for (let element of state.preparedFiles){
        if(element.id == uid) {
          if(element.size == ""){
            element.size = '未知';
          }
          element.status = "上传发起失败";
          element.noErrorFlag= false;
          element.isFinished= true;
          element.isPause=false;
          element.isGG=false;
          element.hash = 'error',
          state.preparedFiles.splice(state.preparedFiles.indexOf(element), 1);
          state.uploadedFiles.unshift(element);
        }
      }
    },

    updatePartList(state, [uid,partList]){
      for (let element of state.preparedFiles){
        if(element.id === uid){
          element.filePartList = partList;
          let tmp = state.preparedFiles.splice(state.preparedFiles.indexOf(element), 1)[0];
          state.waitingFiles.unshift(tmp);
          break;
        }
      }
    },

    removeFile(state, element){
          state.uploadingFiles.splice(state.uploadingFiles.indexOf(element), 1);
    },
    initialUploadedFiles(state,files){
      state.uploadedFiles = files;
    },
    removeRecord(state, uid){
      for (let element of state.uploadedFiles){
        if(element.id == uid){
          state.uploadedFiles.splice(state.uploadedFiles.indexOf(element), 1);
          break;
        }
      }

    },
    updateFileType(state,[uid,type]){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.fileType = type;
          element.status = "正在上传";
          break;
        }
      }
    },
    updateVisable(state,flag){
      state.uploadVisible = flag;
    },
    updateIDtoGo(state,id){
      state.idToGo = id;
    },

    //上传状态改变 解除暂停
    updatePausedStatus(state,uid){
        for (let element of state.pausedFiles) {
          if (element.id === uid && element.isPause === true) {
            let tmp = state.pausedFiles.splice(state.pausedFiles.indexOf(element), 1)[0];
            tmp.status = "排队中..";
            state.waitingFiles.unshift(tmp);
            break;
          }
        }


    },
    //移动到暂停列表
    updatePausedAndMove(state,[flag,uid]){
      if(flag == true){
        for (let element of state.uploadingFiles) {
          if (element.id === uid && element.isPause === false) {
            element.status = "暂停中..";
            element.isPause = true;
            break;
          }
        }
      }
    },
    //保存暂停列表，并且把filepartList 改掉
    pauseList(state, [element, list]){
      let tmpElement = element;
      tmpElement.filePartList = [];
      tmpElement.pausedList = list;
      state.uploadingFiles.splice(state.uploadingFiles.indexOf(element),1,tmpElement);
    },

    moveToTheEndOfWait(state,uid){
      for (let element of state.uploadingFiles) {
        if (element.id === uid) {
          let tmp = state.uploadingFiles.splice(state.uploadingFiles.indexOf(element), 1);
          tmp = tmp[0];
          tmp.status = "已暂停"
          state.pausedFiles.unshift(tmp);
        }
      }
    }
  },
  actions:{
    popFileAsync(context){
      context.commit("popFile");
    },
    pushToUploadingAsync(context,flag){
      context.commit("pushToUploading",flag);
    },
    moveToTheEndOfWaitAsync(context,uid){
      context.commit("moveToTheEndOfWait",uid);
    },
    addCompleteNessAsync(context,[uid, loadThisTime]){
      context.commit("addCompleteNess",[uid, loadThisTime]);
    },

    updatePausedStatusAsync(context,uid){
      context.commit("updatePausedStatus",uid);
    },
    updatePausedAndMoveAsync(context,[flag,uid]){
      context.commit("updatePausedAndMove",[flag,uid]);
    },
    updateAbortAsync(context,uid){
      context.commit("updateAbort",uid);
    },

    updatePausedAbortAsync(context,uid){
      context.commit("updatePausedAbort",uid);
    },

    updateWaitAbortAsync(context,uid){
      context.commit("updateWaitAbort",uid);
    },


  },



}
const musicModule = {
  namespaced:true,
  state: () => ({
    playList: [],
    isPlayerOpened: false,
    isOnlyAddList: false,
    isRepeat: false,
    nowPlayIndex:0 + 's' + Date.now(),
  }),
  mutations: {
    removeSongFromList(state,index) {
      state.playList.splice(index,1);
    },
    initialPlayList(state,songList){
      state.playList = songList;
      //state.nowPlayIndex = 0 + 's' + Date.now();
    },
    updatePlayList(state,[song,isShare,isFav,node_id,file_name,artist,name,cover,user_id]){
      let flag = true;
      for(let element of state.playList){
        if(element.node_id === node_id){
          state.nowPlayIndex = state.playList.indexOf(element) + 's' + Date.now();
          state.isRepeat = true;
          flag = false;
          break;
        }
      }
      if(flag){
        state.playList.push({
          name: name,
          artist: artist,
          cover: cover,
          node_id:node_id,
          user_id:user_id,
          file_name:file_name,
          source: song,
          favorited: isFav,
          shared:isShare,
        });
        state.nowPlayIndex = (state.playList.length-1) + 's' + Date.now();
      }

    },
    updatePlayListWithMulti(state,list){
      for(let element of list){
        this.commit('musicState/updatePlayList', [element.source,element.shared,element.favorited,element.node_id,element.file_name,element.artist,element.name,element.cover,element.user_id]);
      }
    },
    updatePlayListFav(state, id){
      for(let element of state.playList){
        if(element.node_id === id){
          element.favorited = !element.favorited;
          break;
        }
      }
    },
    recoverRepeatFlag(state){
      state.isRepeat = false;
    },
    isListPlay(state, flag){
      state.isPlayerOpened = flag;
    },
    isOnlyAddToList(state, flag){
      state.isOnlyAddList = flag;
    },
    updatePlayListShare(state, id){
      for(let element of state.playList){
        if(element.node_id === id){
          element.shared = !element.shared;
          break;
        }
      }
    },
  },
  actions: {
    removeSongFromListAsync(context,index){
      context.commit("removeSongFromList",index)
    },
    updatePlayListFavAsync(context, id){
      context.commit("updatePlayListFav",id)
    },
    updatePlayListShareAsync(context, id){
      context.commit("updatePlayListShare",id)
    },
    isListPlayAsync(context, flag){
      context.commit("isListPlay",flag)
    },
    isOnlyAddToListAsync(context,flag){
      context.commit("isOnlyAddToList",flag);
    },
    recoverRepeatFlagAsync(context){
      context.commit("recoverRepeatFlag");
    }
  }

}


export default new Vuex.Store({
  state: {
    user_id :0,
    share_user_id:0,
    user_name:"",
    share_user_name:"",
    node_id:1,
    currentPath:"",
    isFileDrag:false,
    isElementDragging:false,
    avatarBase64:"",
    searchStr:"",
    draggingID:0,

    isMultiSelect:false,
    isMultiDragging:false,
    isAllDownloadOn:false,
    isAllDeleteOn:false,
    isAllMoveOn:false,
    isAllShareOn:false,
    isAllMusic:true,
    isAllAddListOn:false,
    isGetAllShare:false,
    allShareMode:false,

    changeFavId:"",
    changeSharedId:"",


    draggingIDs:[],
    videoFormatCheck: {},
    currentDecodePath:[],
    rightNowDirList:[],
    rightNowFileList: [],

  },

  mutations: {

    updateIsAllMusic(state,flag){
      state.isAllMusic = flag;
    },
    updateChangeFavId(state,id){
      state.changeFavId = id;
    },
    updateChangeSharedId(state,id){
      state.changeSharedId = id;
    },

    nowOpenShareUserName(state, name){
      state.share_user_name = name;
    },
    nowOpenShareUserId(state, id){
      state.share_user_id = id;
    },

    updateIsAllShareOn(state,[flag,flag2]){
      state.isAllShareOn = flag;
      state.allShareMode = flag2;
    },
    updateIsAllMoveOn(state,flag){
      state.isAllMoveOn = flag;
    },
    updateIsGetAllShareOn(state,flag){
      state.isGetAllShare = flag;
    },
    updateIsAllAddListOn(state,flag){
      state.isAllAddListOn = flag;
    },
    updateIsAllMoveOnDrag(state,flag){
      state.isAllMoveOnDrag = flag;
    },
    updateIsAllDeleteOn(state,flag){
      state.isAllDeleteOn = flag;
    },
    updateIsFileDrag(state,flag){
      state.isFileDrag = flag;
    },

    updateIsAllDownloadOn(state,flag){
      state.isAllDownloadOn = flag;
    },
    updateIsMultiSelect(state,flag){
      state.isMultiSelect = flag;
    },
    updateIsMultiDragging(state,flag){
      state.isMultiDragging = flag;
    },
    updateDraggingIDs(state,arr){
      state.draggingIDs = arr;
    },
    updataVideoFormatCheck(state,format){
      state.videoFormatCheck = format;
    },
    determineUserID(state, UserID){
      state.user_id = UserID;
    },

    determineUserName(state,UserName){
      state.user_name = UserName;
    },
    updateDirList(state,newDirList){
      state.rightNowDirList = newDirList;
    },
    updateFileList(state,newFileList){
      state.rightNowFileList = newFileList;
    },
    updatePath(state,newPath){
      state.currentPath = newPath;
    },
    updateNodeId(state,id){
      state.node_id = id;
    },

    updatedraggingID(state,id){
      state.draggingID = id;
    },
    updateDecodePath(state,newPath){
      state.currentDecodePath = newPath;
    },
    changeDragState(state,flag){
      state.isElementDragging = flag;
    },
    deleteFolder(state,nodeid){
     for(let element of state.rightNowDirList){
       if(element.node_id == nodeid){
         state.rightNowDirList.splice(state.rightNowDirList.indexOf(element), 1);
         break;
       }
     }
    },
    deleteFile(state,nodeid) {
      for(let element of state.rightNowFileList){
        if(element.node_id == nodeid){
          state.rightNowFileList.splice(state.rightNowFileList.indexOf(element), 1);
          break;
        }
      }
    },
    updateSearchStr(state,str){
      state.searchStr = str;
    },
    initial(state,content){
      this.commit("updateDirList",content[0]);
      this.commit("updateFileList",content[1]);
    },


  },
  actions: {
    updateChangeFavIdAsync(context,id){
      context.commit("updateChangeFavId",id)
    },
    updateChangeSharedIdAsync(context,id){
      context.commit("updateChangeSharedId",id)
    },
    updateSearchStrAsync(context,str){
      context.commit("updateSearchStr",str);
    },
    updatedraggingIDAsync(context,id){
      context.commit("updatedraggingID",id);
    },
    updateIsMultiSelectAsync(context,flag){
      context.commit("updateIsMultiSelect",flag);
    }
  },
  modules: {
    updateState:updateModule,
    musicState:musicModule,
  }
})
