<template>

</template>

<script>
import Worker from '@/assets/methods/test.worker.js'
export default {
  name: "UpAndDownload",
  inject:['reload','updateTotalBar'],
  data(){
    return{
      blockSize : 5*1024*1024,
    }
  },
  methods:{
    async uploadFile(file) {
      const fs = this.fileSize(file.file.size);
      this.$store.commit("updateState/pushFile", [file.file, fs]);
      this.$notify({
        title: '上传准备中！',
        type: 'info',
        message: `${file.file.name} 正在为上传做准备，请稍后！注意：文件越大，电脑内存越小，CPU越菜，所需时间越长！`,
        position: 'bottom-right',
        customClass: "message",
      });
      let worker = new Worker();
      worker.postMessage(file.file);
      worker.onmessage = (event) => {
        const hash = event.data;
        if(hash === "error"){
          this.$notify({
            title: '转换文件',
            type: 'error',
            message: `${file.file.name} 转换文件格式发生错误！`,
            position: 'bottom-right',
            customClass: "message",
          });
          this.$store.commit("updateState/updateTotallyCompleteFailed", file.file.uid);
          return;
        }else{
          this.$store.commit("updateState/updateHash", [file.file.uid, hash]);
          let partList = this.chunkList(hash, file.file);
          this.$store.commit("updateState/updatePartList", [file.file.uid, partList]);
        }

      }
    },

    async dragUploadFile(fileList) {
      for(let i = 0; i< fileList.length; i++){
        const uid = Date.now() + i;
        fileList[i].uid = uid;
        let dragfile = fileList[i];
        const fs = this.fileSize(dragfile.size);
        this.$store.commit("updateState/pushFile", [dragfile, fs]);
        this.$notify({
          title: '上传准备中！',
          type: 'info',
          message: `${dragfile.name} 正在为上传做准备，请稍后！注意：文件越大，电脑内存越小，CPU越菜，所需时间越长！`,
          position: 'bottom-right',
          customClass: "message",
        });
        let worker = new Worker();
        worker.postMessage(dragfile);
        worker.onmessage = (event) => {
          const hash = event.data;
          if(hash === "error"){
            this.$notify({
              title: '转换文件',
              type: 'error',
              message: `${dragfile.name} 转换文件格式发生错误！`,
              position: 'bottom-right',
              customClass: "message",
            });
            this.$store.commit("updateState/updateTotallyCompleteFailed", dragfile.uid);
            return;
          }else{
            this.$store.commit("updateState/updateHash", [dragfile.uid, hash]);
            let partList = this.chunkList(hash, dragfile);
            this.$store.commit("updateState/updatePartList", [dragfile.uid, partList]);
          }

        }
      }
    },
    async getUpdatedFiles(hash,uid,name,length,realSize) {
      this.$store.commit("updateState/updateStatus",[uid,"正在上传"]);
      this.$notify({
        title: '上传开始！',
        type: 'info',
        message: `${name} 已开始上传作业！`,
        position: 'bottom-right',
        customClass: "message",
      });
      let { data: res} = await this.$http.get("/file/createTask",{
        params:{
          hash:hash,
          uid:uid,
          file_name:name,
          user_id:this.$store.state.user_id,
          node_id:this.$store.state.updateState.idToGo,
          file_size:realSize
        }})
          .catch((error) => {
                if(error.status !== 401) {
                  this.$message.error("上传发起出现未知异常，请联系Van! Code: " + error.message);
                  this.$store.commit("updateState/updateCompleteFailed", uid);
                  this.uploadVisible = false;
                }
      });
      if(res.code === 200) {
        if(res.data.content_type){
          this.$store.commit("updateState/updateFileType",[uid,res.data.content_type]);
        }
        if(res.data.sliceNo === -1) {
          this.uploadBegin(0,hash,uid,length);
        }else {
          const progress = res.data.sliceNo * Math.ceil(100 / length);
          this.$store.commit("updateState/updateCompleteNess",[hash,progress]);
          this.uploadBegin(res.data.sliceNo,hash,uid,length);
        }

      }else if(res.code === 455){
        this.$notify({
          title: '空间不够了！',
          type: 'error',
          message: `您的剩余空间不足以装下这个文件，建议捐款给Van以扩充硬盘`,
          position: 'bottom-right',
          customClass: "message",
        });
        await this.fileSizeAbortMission(uid);
      }else if(res.code === 453){
        this.$notify({
          title: '你怎么做到的？',
          type: 'error',
          message: `我无法找到你的上传目的地，你是如何做到的？`,
          position: 'bottom-right',
          customClass: "message",
        });
        await this.fileSizeAbortMission(uid);
      }

    },
    async uploadBegin(index,hash,uid,length) {
      if(index >= length){
        return await this.uploadComplete(hash,uid);
      }
      else{
        let uploadList = [];
        let total = 0;
        for (let element of this.$store.state.updateState.uploadingFiles) {
          if (element.hash === hash) {
            uploadList = element.filePartList.slice(index);
            total = element.realSize;
            break;
          }
        }

        uploadList = this.mapPostRequest(uploadList,uid);
        await this.uploadSend(uploadList,hash,uid,total);
      }

    },

    async uploadSend(uploadList,hash,uid,total){
      try {
        let i = 0;
        let lastTime = new Date().getTime();
        let realLastSize = 0;
        while( i< uploadList.length){
          for (let element of this.$store.state.updateState.uploadingFiles) {
            if (element.id === uid) {
              realLastSize = element.finishSize;

              if (element.isPause === true){
                this.$store.commit("updateState/pauseList",[element,uploadList.slice(i)]);
                return;
              }
              if(element.isGG === true){
                await this.uploadAbort(uid,element.status);
                return;
              };
              break;
            }
          }
          const { data: res } = await uploadList[i]();
          if (res.code === 200){
            //计算interval 级别速度 时间
            let nowTime = new Date().getTime();
            let intervalTime = (nowTime - lastTime)/1000;//时间单位为毫秒，需转化为秒
            let speed = this.blockSize/intervalTime;
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
            let leftTime = Math.ceil(((total - (realLastSize + this.blockSize))/ bSpeed));
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

            this.$store.commit("updateState/updateCompleteNess",[uid,speed.toFixed(2) + units,str]);
            lastTime = nowTime;
            i++;
            if(i == uploadList.length){
              await this.uploadComplete(hash,uid);
            }
          }
          else{
            console.log("回报有错误！")
            break;
          }
        }

      } catch (error) {
        if(error.status !== 401) {
          console.log(error)
        }
      }


    },
    async uploadComplete(hash,uid){
      this.$store.commit("updateState/updateStatus",[uid,"少女祈祷中.."]);
      let name = "";
      let tmpElement = {};
      for (let element of this.$store.state.updateState.uploadingFiles) {
        if (element.id === uid) {
          tmpElement = element;
          name =  element.name;
          break;
        }
      }
      let { data: res} = await this.$http.get("/file/merge",{
        params:{
          hash:hash,
          uid:uid,
        }})
          .catch((error) => {
                if(error.status !== 401) {
                  this.$message.error("上传结束时出现未知异常，请联系Van! Code: " + error.message);
                  this.$store.commit("updateState/updateCompleteFailed", uid);
                  this.uploadVisible = false;
                }
          });
      if(res.code == 200){
        this.$store.commit("updateState/updateCompleted",uid);
        await this.uploadhistory(tmpElement);
        this.reload();
        this.updateTotalBar();
        this.$notify({
          title: '上传完成',
          type: 'success',
          message: `${name} 已完成上传作业！`,
          position: 'bottom-right',
          customClass: "message",
        });
      }else if(res.code === 453){
        this.$store.commit("updateState/updateCompleteFailed", uid);
        this.reload();
        this.updateTotalBar();
        this.$notify({
          title: '上传失败',
          type: 'error',
          message: `${name}上传中可能出现丢包或坏包，或上传的目的地文件夹已被删除，请重新尝试或联系Van！`,
          position: 'bottom-right',
          customClass: "message",
        });
      }
    },

    async uploadAbort(uid,status){
      let name = "";
      let tmpElement = {};
      if(status == '排队中..') {
        await this.$store.dispatch("updateState/updateWaitAbortAsync",uid);
        for (let element of this.$store.state.updateState.waitingFiles) {
          if (element.id === uid) {
            tmpElement = element;
            name =  element.name;
            break;
          }
        }
      }
      else if(status == '正在上传' || status == '已暂停'){
        for (let element of this.$store.state.updateState.uploadingFiles) {
          if (element.id === uid) {
            tmpElement = element;
            name =  element.name;
            break;
          }
        }
      }
      let { data: res} = await this.$http.get("/file/abort",{
        params:{
          hash:tmpElement.hash,
          uid:uid,
        }})
          .catch((error) => {
            if(error.status !== 401) {
              this.$message.error("上传终止结束时出现未知异常，请联系Van! Code: " + error.message);
              this.$store.commit("updateState/updateCompleteFailed", uid);
              this.uploadVisible = false;
            }
          });
      if(res.code == 200){
        this.$store.commit("updateState/realAbort",[uid,status]);
        await this.uploadhistory(tmpElement);
        this.$notify({
          title: '上传终止',
          type: 'warning',
          message: `${name} 已被傻逼的你手动终止上传！`,
          position: 'bottom-right',
          customClass: "message",
        });
      }else{
        this.$notify({
          title: '上传终止失败',
          type: 'error',
          message: `${name}上传终止失败，请重新尝试或联系Van！`,
          position: 'bottom-right',
          customClass: "message",
        });
      }
    },
    paused(uid){
      this.$store.dispatch("updateState/updatePausedStatusAsync", [true,uid]);
    },
    async fileSizeAbortMission(uid){
      for (let element of this.$store.state.updateState.uploadingFiles) {
        if(element.id === uid){
          this.$store.dispatch("updateState/updateAbortAsync",uid);
          this.$store.commit("updateState/realAbort",[uid,element.status]);
          await this.uploadhistory(element);
          break;
        }
      }
    },
    abortMission(uid,status){
      if(status == '排队中..'){
        this.uploadAbort(uid,status);
      }
      else if(status == '正在上传' || status == '已暂停'){
        for (let element of this.$store.state.updateState.uploadingFiles) {
          if(element.id === uid){
            this.$store.dispatch("updateState/updateAbortAsync",uid);
            if(element.isPause === true){
              this.uploadAbort(uid,element.status);
            }
            break;
          }
        }
      }
    },
    async unPaused(uid){
      this.$store.dispatch("updateState/updatePausedStatusAsync", [false,uid]);
      for(let element of this.$store.state.updateState.uploadingFiles){
        if(element.id === uid){
          await this.uploadSend(element.pausedList, element.hash, uid,element.realSize);
          break;
        }
      }
    },
    async uploadhistory(element){
      let {data:res} = await this.$http.post('/setHistory',{
        user_id:this.$store.state.user_id,
        name:element.name,
        size:element.size,
        id:element.id,
        date:element.date,
        status:element.status,
        complete:element.complete,
        hash:element.hash,
        fileType:element.fileType,
        noErrorFlag:element.noErrorFlag,
        isFinished:element.isFinished,
        isPause:element.isPause,
        isGG:element.isGG,
      });
      if(res.code === 200){
        return true;
      }
      else {
        return false;
      }
    },

    mapPostRequest(uploadList,uid){
        let total = 0;
        for(let element of this.$store.state.updateState.uploadingFiles){
          if(element.id === uid){
            total = element.realSize;
          }
        }
        return uploadList.map(item => {
            const formData = new FormData();
            formData.append("chunk", item.chunk);
            formData.append("name", item.filename);
            formData.append("uid", uid);
            return this.request.bind(null, formData, total);
          });
    },
    request(formData,total) {
      let uid = formData.get("uid");

      return this.$http.post("/file/uploadSlice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            let percent = progressEvent.loaded / progressEvent.total;
            let progressPercent = percent * (this.blockSize/total) *100;
           this.$store.commit("updateState/addCompleteNess",[uid,progressPercent]);
        },
      });
    },
    chunkList(md5hash, file) {
      const partList = [];
      const count = Math.ceil(file.size / this.blockSize);
      //更多的包，但是每个包大小必定相等。
      //const partSize = file.size / count;
      const suffix = /\.([0-9A-z-_]+)$/i.exec(file.name)[1];
      let i = 1, cur = 0;
      while (i <= count) {
        const item = { chunk: file.slice(cur, cur+this.blockSize), filename: `${md5hash}_${i}.${suffix}` };
        cur += this.blockSize;
        partList.push(item);
        i++;
      }


      return partList;
    },

    dealError(error,id){
      console.log(id);
      this.$message.error(error.message);
      this.$store.commit("updateState/updateCompleteFailed", id);
    },
    fileSize(size){
      if(size < 1024) {

        return size + 'B';
      } else if(size >= 1024 && size < 1048576) {

        return (size/1024).toFixed(1) + 'KB';
      } else if(size >= 1048576 && size < 1073741824) {

        return (size/1048576).toFixed(1) + 'MB';
      } else if(size >= 1073741824) {

        return (size/1073741824).toFixed(1) + 'GB';
      }
    },
  },
  computed:{
    waitMonitor(){
      return this.$store.state.updateState.uploadingFiles.concat(this.$store.state.updateState.waitingFiles);
    }
  },
  watch:{
    waitMonitor:{
      handler(val){
        if (this.$store.state.updateState.uploadingFiles.length < 5 && this.$store.state.updateState.waitingFiles.length > 0){
          this.$store.commit("updateState/popFile");
          let tmp = this.$store.state.updateState.tmpElement;
          this.$store.commit("updateState/pushToUploading");
          this.getUpdatedFiles(tmp.hash,tmp.id,tmp.name,tmp.filePartList.length,tmp.realSize);

        }
      }

    }
  },
  created() {
    window.onunload = async () => {
      let {data:res} = this.$http.post("/abortAll",{user_id:this.$store.state.user_id}).then(data => {console.log("全完了")});
      return "handle your events or msgs here";
    }
  }
}
</script>

<style scoped>

</style>