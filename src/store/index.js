import Vue from 'vue'
import Vuex from 'vuex'
import fa from "element-ui/src/locale/lang/fa";

Vue.use(Vuex)
const updateModule = {
  namespaced:true,
  state: () => ({
    idToGo:1,
    tmpElement:{},
    uploadingFiles: [],
    waitingFiles:[],
    uploadedFiles: [],
    uploadVisible: false,
  }),


  mutations: {
    pushFile(state, [file, filesize,hash]){
      state.waitingFiles.unshift({
        name: file.name,
        size: filesize,
        realSize:file.size,
        finishSize:0,
        speed:"",
        id: file.uid,
        leftTime:"",
        status:"排队中...",
        complete: 0,
        tmpComplete: 0 ,
        hash:hash,
        fileType:"folder-fill",
        filePartList:[],
        pausedList:[],
        noErrorFlag: true,
        isFinished: false,
        isPause:false,
        isGG:false,
      });
    },

    popFile(state){
      state.tmpElement = state.waitingFiles.pop();
    },

    pushToUploading(state){
      state.uploadingFiles.unshift(state.tmpElement);
      state.tmpElement = {};
    },
    updateCompleteNess(state, uid){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.tmpComplete = element.complete;
          element.finishSize = element.finishSize + (5*1024*1024);
          break;
        }
      }

    },
    addCompleteNess(state, [uid, complete,speed,leftTime]){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.speed = speed;
          element.leftTime = leftTime;
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
          this.commit("updateState/removeFile",uid);
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
    realAbort(state, uid){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.status = "上传中断";
          element.isFinished = true;
          element.filePartList = [];
          this.commit("updateState/removeFile",uid);
          state.uploadedFiles.unshift(element);
          break;
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
    updateCompleteFailed(state, uid){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          element.status = "上传失败";
          element.noErrorFlag = false;
          element.isFinished = true;
          element.filePartList = [];
          this.commit("updateState/removeFile",uid);
          state.uploadedFiles.unshift(element);
          break;
        }
      }
    },

    updateTotallyCompleteFailed(state, file){
          let element = {
            name: file.name,
            size: '未知',
            realSize:file.size,
            id: file.uid,
            status:"上传发起失败",
            complete: 0,
            hash:'error',
            fileType:"question-octagon",
            noErrorFlag: false,
            isFinished: true,
            isPause:false,
            isGG:false,
          }
          state.uploadedFiles.unshift(element);
    },

    updatePartList(state, [uid,partList]){
      for (let element of state.waitingFiles){
        if(element.id === uid){
          element.filePartList = partList;
          break;
        }
      }
    },
    removeFile(state, uid){
      for (let element of state.uploadingFiles){
        if(element.id == uid){
          state.uploadingFiles.splice(state.uploadingFiles.indexOf(element), 1);
          break;
        }
      }

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

    removeFileAsync(context,uid){
      context.commit("updateState/removeFile",uid);
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
  },



}



export default new Vuex.Store({
  state: {
    user_id :"",
    user_name:"tom",
    node_id:1,
    currentPath:"",
    avatarBase64:"",

    //lastPath:"",
    currentDecodePath:[],
    rightNowDirList:   [],
    rightNowFileList: [],

  },

  mutations: {
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
