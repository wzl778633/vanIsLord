import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
const updateModule = {
  namespaced:true,
  state: () => ({
    idToGo:1,
    tmpElement:{},
    preparedFiles: [],
    uploadingFiles: [],
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
        speed:"",
        id: file.uid,
        leftTime:"",
        status:"准备中..",
        complete: 0,
        tmpComplete: 0 ,
        date: `${year}-${month}-${dates}`,
        hash:"",
        fileType:"question-octagon",
        filePartList:[],
        pausedList:[],
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

    pushToUploading(state){
      state.uploadingFiles.unshift(state.tmpElement);
      state.tmpElement = {};
    },
    updateCompleteNess(state, [uid,speed,leftTime]){
      for (let element of state.uploadingFiles){
        if(element.id === uid){
          element.speed = speed;
          element.leftTime = leftTime;
          element.tmpComplete = element.complete;
          element.finishSize = element.finishSize + (5*1024*1024);
          break;
        }
      }

    },
    addCompleteNess(state, [uid, complete]){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.complete = Number((element.tmpComplete + complete).toFixed(2));
          if(element.complete > 100){
            element.complete = 100;
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
    realAbort(state, [uid,status]){
      if(status == '排队中..') {
        for (let element of state.waitingFiles){
          if(element.id == uid){
            element.status = "上传中断";
            element.isFinished = true;
            element.filePartList = [];
            state.waitingFiles.splice(state.waitingFiles.indexOf(element), 1);
            state.uploadedFiles.unshift(element);
            break;
          }
        }
      }
      else if(status == '正在上传' || status == '已暂停'){
        for (let element of state.uploadingFiles){
          if(element.id == uid){
            element.status = "上传中断";
            element.isFinished = true;
            element.filePartList = [];
            this.commit("updateState/removeFile",element);
            state.uploadedFiles.unshift(element);
            break;
          }
        }
      }

    },
    updateAbort(state, uid){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.isGG = true;
          break;
        }
      }
    },
    updateWaitAbort(state, uid){
      for (let element of state.waitingFiles){
        if(element.id == uid){
          element.isGG = true;
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
    updatePausedStatus(state,[flag,uid]){
      if(flag == true){
        for (let element of state.uploadingFiles) {
          if (element.id === uid && element.isPause === false) {
            element.status = "已暂停";
            element.isPause = true;
            break;
          }
        }
      }else{
        for (let element of state.uploadingFiles) {
          if (element.id === uid && element.isPause === true) {
            element.status = "正在上传";
            element.isPause = false;
            break;
          }
        }
      }

    },
    pauseList(state, [element, list]){
      let tmpElement = element;
      tmpElement.filePartList = [];
      tmpElement.pausedList = list;
      state.uploadingFiles.splice(state.uploadingFiles.indexOf(element),1,tmpElement);
    },
  },
  actions:{

    removeFileAsync(context,element){
      context.commit("updateState/removeFile",element);
    },
    updateCompletedAsync(context,uid){
      context.commit("updateState/updateCompleted",uid);
    },
    updateCompleteFailedAsync(context,uid){
      context.commit("updateState/updateCompleted",uid);
    },
    updatePausedStatusAsync(context,[flag,uid]){
      context.commit("updatePausedStatus",[flag,uid]);
    },
    updateAbortAsync(context,uid){
      context.commit("updateAbort",uid);
    },

    updatePrepareAbortAsync(context,uid){
      context.commit("updatePrepareAbort",uid);
    },

    updateWaitAbortAsync(context,uid){
      context.commit("updateWaitAbort",uid);
    },
  },



}



export default new Vuex.Store({
  state: {
    user_id :"",
    user_name:"tom",
    node_id:1,
    currentPath:"",
    avatarBase64:"",
    videoFormatCheck: {},
    //lastPath:"",
    currentDecodePath:[],
    rightNowDirList:   [],
    rightNowFileList: [],

  },

  mutations: {
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

   // updateLastPath(state,newPath){
    //  state.lastPath = newPath;
  //  },
    updateDecodePath(state,newPath){
      state.currentDecodePath = newPath;
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
    initial(state,content){
      this.commit("updateDirList",content[0]);
      this.commit("updateFileList",content[1]);
    },


  },
  actions: {

  },
  modules: {
    updateState:updateModule,
  }
})
