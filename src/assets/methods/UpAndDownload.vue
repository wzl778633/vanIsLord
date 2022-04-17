<template>

</template>

<script>
import SparkMD5 from "spark-md5";
export default {
  name: "UpAndDownload",
  inject:['reload'],
  data(){
    return{
      blockSize : 5*1024*1024,

    }
  },
  methods:{
    async uploadFile(file) {
      const buffer =this.preHandleFile(file.file);
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(buffer);
      const hash = spark.end();
      const fs = this.fileSize(file.file.size);
      this.$store.commit("updateState/pushFile", [file.file, fs, hash]);

      let partList = this.chunkList(hash, file.file);
      this.$store.commit("updateState/updatePartList", [file.file.uid, partList]);
    },

    async dragUploadFile(fileList) {
      for(let i = 0; i< fileList.length; i++){
        const uid = Date.now() + i;
        fileList[i].uid = uid;
        const buffer = this.preHandleFile(fileList[i]);
        const spark = new SparkMD5.ArrayBuffer();
        spark.append(buffer);
        const hash = spark.end();
        const fs = this.fileSize(fileList[i].size);
        this.$store.commit("updateState/pushFile", [fileList[i], fs, hash]);

        let partList = this.chunkList(hash, fileList[i]);
        this.$store.commit("updateState/updatePartList", [fileList[i].uid, partList]);
      }
    },
    async getUpdatedFiles(hash,uid,name,length) {
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
          node_id:this.$store.state.updateState.idToGo
        }})
          .catch((error) => {
        this.$message.error("上传发起出现未知异常，请联系Van! Code: " + error.message);
        this.$store.commit("updateState/updateCompleteFailed", uid);
        this.uploadVisible = false;
      });
      if(res.code === 200) {
        this.$store.commit("updateState/updateFileType",res.data.content_type);
        if(res.data.sliceNo === -1) {
          this.uploadBegin(0,hash,uid,length);
        }else {
          const progress = res.data.sliceNo * Math.ceil(100 / length);
          this.$store.commit("updateState/updateCompleteNess",[hash,progress]);
          this.uploadBegin(res.data.sliceNo,hash,uid,length);
        }

      }

    },
    async uploadBegin(index,hash,uid,length) {
      if(index >= length){
        return await this.uploadComplete(hash,uid);
      }
      else{
        let uploadList = [];
        for (let element of this.$store.state.updateState.uploadingFiles) {
          if (element.hash === hash) {
            uploadList = element.filePartList.slice(index);
            break;
          }
        }

        uploadList = this.mapPostRequest(uploadList,uid);
        await this.uploadSend(uploadList,hash,uid);
      }

    },

    async uploadSend(uploadList,hash,uid){
      try {
        let i = 0;
        while( i< uploadList.length){
          for (let element of this.$store.state.updateState.uploadingFiles) {
            if (element.id === uid) {
              if (element.isPause === true){
                this.$store.commit("updateState/pauseList",[element,uploadList.slice(i)]);
                return;
              }
              if(element.isGG === true){
                await this.uploadAbort(hash,uid);
                return;
              };
              break;
            }
          }
          const { data: res } = await uploadList[i]();
          if (res.code === 200){
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
        console.log(error)
      }


    },
    async uploadComplete(hash,uid){
      this.$store.commit("updateState/updateStatus",[uid,"少女祈祷中.."]);
      let name = "";
      for (let element of this.$store.state.updateState.uploadingFiles) {
        if (element.id === uid) {
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
            this.$message.error("上传结束时出现未知异常，请联系Van! Code: " + error.message);
            this.$store.commit("updateState/updateCompleteFailed", uid);
            this.uploadVisible = false;
          });
      if(res.code == 200){
        this.$store.commit("updateState/updateCompleted",uid);
        this.reload();
        this.$notify({
          title: '上传完成',
          type: 'success',
          message: `${name} 已完成上传作业！`,
          position: 'bottom-right',
          customClass: "message",
        });
      }else{
        this.$notify({
          title: '上传失败',
          type: 'error',
          message: `${name}上传中可能出现丢包或坏包，请重新尝试或联系Van！`,
          position: 'bottom-right',
          customClass: "message",
        });
      }
    },

    async uploadAbort(hash,uid){
      let name = "";
      for (let element of this.$store.state.updateState.uploadingFiles) {
        if (element.id === uid) {
          name =  element.name;
          break;
        }
      }
      let { data: res} = await this.$http.get("/file/abort",{
        params:{
          hash:hash,
          uid:uid,
        }})
          .catch((error) => {
            this.$message.error("上传终止结束时出现未知异常，请联系Van! Code: " + error.message);
            this.$store.commit("updateState/updateCompleteFailed", uid);
            this.uploadVisible = false;
          });
      if(res.code == 200){
        this.$store.commit("updateState/realAbort",uid);
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
    abortMission(uid){
      for (let element of this.$store.state.updateState.uploadingFiles) {
        if(element.id === uid){
          this.$store.dispatch("updateState/updateAbortAsync",uid);
          if(element.isPause === true){
            let hash = element.hash;
            this.uploadAbort(hash,uid);
          }
          break;
        }

      }
    },
    async unPaused(uid){
      this.$store.dispatch("updateState/updatePausedStatusAsync", [false,uid]);
      for(let element of this.$store.state.updateState.uploadingFiles){
        if(element.id === uid){
          await this.uploadSend(element.pausedList, element.hash, uid);
          break;
        }
      }
    },
    preHandleFile(file){

       return new Promise((resolve, reject) => {
          const fr = new FileReader()
          fr.readAsArrayBuffer(file)
          fr.onload = e => {
            resolve(e.target.result)
          }
          fr.onerror = () => {
            this.$notify({
              title: '转换文件',
              type: 'error',
              message: `${file.name} 转换文件格式发生错误！`,
              position: 'bottom-right',
              customClass: "message",
            });
            reject(new Error('转换文件格式发生错误'))
          }
        })
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
      this.$store.commit("updateState/updateCompleteNess",uid);
      let lastTime = new Date().getTime();
      let lastSize = 0;
      let realLastSize = 0;
      for (let element of this.$store.state.updateState.uploadingFiles){
        if(element.id == uid){
          realLastSize = element.finishSize;
          break;
        }
      }

      return this.$http.post("/file/uploadSlice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            let percent = progressEvent.loaded / progressEvent.total;
            let progressPercent = percent * (this.blockSize/total) *100;
            let nowTime = new Date().getTime();
            let intervalTime = (nowTime - lastTime)/1000;//时间单位为毫秒，需转化为秒
            let intervalSize = progressEvent.loaded - lastSize;

            lastTime = nowTime;
            lastSize = progressEvent.loaded;
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
            let leftTime = Math.ceil(((total - (realLastSize + lastSize))/ bSpeed));
            let str = "";
            let h = (leftTime / 60 / 60 % 24).toFixed(0)
            str = str + (h == 0 ? "" : (h +"小时"));
            let m = (leftTime / 60 % 60).toFixed(0)
            str = str + (m == 0 ? "" : (m +"分钟"));
            let s = (leftTime % 60).toFixed(0)
            str = str + (s == 0 ? "" : (s +"秒"));

           this.$store.commit("updateState/addCompleteNess",[uid,progressPercent,(speed.toFixed(2)+units),str]);
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
      console.log(suffix)
      while (i <= count) {
        console.log(suffix)
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
      } else if(size >= 1048576) {

        return (size/1048576).toFixed(1) + 'MB';
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
          this.getUpdatedFiles(tmp.hash,tmp.id,tmp.name,tmp.filePartList.length);

        }
      }

    }
  }
}
</script>

<style scoped>

</style>