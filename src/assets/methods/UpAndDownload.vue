<template>

</template>

<script>
import Worker from '@/assets/methods/test.worker.js'

export default {
  name: "UpAndDownload",
  inject:['reload','updateTotalBar'],
  data(){
    return{
      blockSize : 3*1024*1024,
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
            title: '转换文件失败',
            type: 'error',
            message: `${file.file.name} 转换文件格式发生错误，你放入了文件夹 或 你有太多同时准备上传的任务导致内存溢出 或 CPU线程出现错误 或 其他未知原因！`,
            position: 'bottom-right',
            customClass: "message",
          });
          this.$store.commit("updateState/updateTotallyCompleteFailed", file.file.uid);

        }else{
          this.$store.commit("updateState/updateHash", [file.file.uid, hash]);
          let partList = this.chunkList(hash, file.file);
          this.$store.commit("updateState/updatePartList", [file.file.uid, partList]);
        }

      }
    },

    async dragUploadFile(fileList) {
      for(let i = 0; i< fileList.length; i++){
        fileList[i].uid = Date.now() + i;
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
          //从未调用！ 断点续传会用 该代码无效！
          //const progress = res.data.sliceNo * Math.ceil(100 / length);
          //this.$store.commit("updateState/updateCompleteNess",[hash,progress]);
          //this.uploadBegin(res.data.sliceNo,hash,uid,length);
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
    //上传开始
    async uploadBegin(index,hash,uid,length) {
      //已经上传完成
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
        await this.uploadSend(uploadList,hash,uid);
      }

    },

    //真正的上传 upload slice
    async uploadSend(uploadList,hash,uid){
      try {
        //while( i< uploadList.length){
          let pool = [];//并发池
          //let fuckPool = [];//取消用的池子
          let leftList = uploadList.slice();

          let max = 3; //最大并发量
          let errorflag = false;
          for(let i=0;i<uploadList.length;i++){
            for (let element of this.$store.state.updateState.uploadingFiles) {
              if (element.id === uid) {
                //查pause

                if (element.isPause === true){

                  if(pool.length!==0){
                    await Promise.all(pool).catch(()=>{
                      this.$store.commit("updateState/updateCompleteFailed", uid);
                      errorflag = true;
                    })
                    //for(let i = 0; i < fuckPool.length; i++){
                    //  await fuckPool[i].cancel();
                    //}
                  }
                  if(errorflag){
                    this.reload();
                    this.updateTotalBar();
                    this.$notify({
                      title: '上传中暂停失败',
                      type: 'error',
                      message: `有毒的错误，请重新尝试或联系Van！`,
                      position: 'bottom-right',
                      customClass: "message",
                    });
                    return;
                  }

                  await this.$store.commit("updateState/pauseList",[element,leftList]);
                  await this.$store.dispatch("updateState/moveToTheEndOfWaitAsync",element.id);
                  return;
                }
                //查abort
                if(element.isGG === true){
                  if(pool.length!==0){
                    await Promise.all(pool).catch(()=>{
                      this.$store.commit("updateState/updateCompleteFailed", uid);
                      errorflag = true;
                    })
                  }
                  if(errorflag){
                    this.reload();
                    this.updateTotalBar();
                    this.$notify({
                      title: '中断时失败',
                      type: 'error',
                      message: `有病的错误，请重新尝试或联系Van！`,
                      position: 'bottom-right',
                      customClass: "message",
                    });
                    return Promise.resolve();
                  }
                  await this.uploadAbort(uid,"正在上传");
                  return;
                }

                break;
              }
            }

            let item = uploadList[i][0]();
            //let cancaler = uploadList[i][1];
            let removeTag = uploadList[i];
            item.then((data) => {
              if (data.data.code === 200) {
                //请求结束后将该Promise任务从并发池中移除
                let rindex = leftList.findIndex(t => t === removeTag);
                leftList.splice(rindex,1);

                //let cindex = fuckPool.findIndex(t => t === cancaler);
                //fuckPool.splice(cindex,1);

                let index = pool.findIndex(t => t === item);
                pool.splice(index,1);
              } else {
                if (!errorflag) {
                  this.$store.commit("updateState/updateCompleteFailed", uid);
                  errorflag = true;
                  return Promise.reject();
                } else {
                  return Promise.reject();
                }
              }
            }).catch(()=>{
              console.log("多余的错误包，扔掉");
            });
            pool.push(item);
            //fuckPool.push(cancaler);
            if(errorflag){
              break;
            }
            console.log(pool.length)
            if(pool.length >= max){
              //每当并发池跑完一个任务，就再塞入一个任务

              await Promise.race(pool).then((res)=>console.log(res)).catch((thrown)=>{
                  if(!this.$http.isCancel(thrown)){
                    this.$store.commit("updateState/updateCompleteFailed", uid);
                    errorflag = true;
                  }
                }
              )
            }
          }

        if(pool.length!==0){
          await Promise.all(pool).catch(()=>{
                this.$store.commit("updateState/updateCompleteFailed", uid);
                errorflag = true;
              })
        }
          if(errorflag){
            this.reload();
            this.updateTotalBar();
            this.$notify({
              title: '上传中失败',
              type: 'error',
              message: `分片上传中丢包或坏包，或上传的目的地文件夹已被删除，请重新尝试或联系Van！`,
              position: 'bottom-right',
              customClass: "message",
            });
          }
          else{
            await this.uploadComplete(hash,uid);
          }

          //const { data: res } = await uploadList[i]();
          //if (res.code === 200){
            //计算interval 级别速度 时间
           // i++;
            //if(i == uploadList.length){
              //await this.uploadComplete(hash,uid);
            //}
          //}
          //else{
            //console.log("回报有错误！")
            //break;
          //}
        //}
      } catch (error) {
        if(error.status !== 401) {
          console.log(error)
        }
      }


    },
    //上传最终阶段 上传完成
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
      if(res.code === 200){
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
      }else if(res.code === 458){
        this.$store.commit("updateState/updateCompleteFailed", uid);
        this.reload();
        this.updateTotalBar();
        this.$notify({
          title: '上传拼接失败',
          type: 'error',
          message: `${name}上传中出现了丢包或坏包，请重新尝试或联系Van！`,
          position: 'bottom-right',
          customClass: "message",
        });
      }
    },

    //真abort
    async uploadAbort(uid,status){
      let name = "";
      let tmpElement = {};
      if(status === '排队中..') {
        await this.$store.dispatch("updateState/updateWaitAbortAsync",uid);
        for (let element of this.$store.state.updateState.waitingFiles) {
          if (element.id === uid) {
            tmpElement = element;
            name =  element.name;
            break;
          }
        }
      }
      else if(status === '正在上传'){
        for (let element of this.$store.state.updateState.uploadingFiles) {
          if (element.id === uid) {
            tmpElement = element;
            name =  element.name;
            break;
          }
        }
      }
      else if(status === '已暂停'){
        await this.$store.dispatch("updateState/updatePausedAbortAsync",uid);
        for (let element of this.$store.state.updateState.pausedFiles) {
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
      if(res.code === 200){
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

    //上传状态改变部分 暂停算法 若没有排队 则已暂停 若有排队 则排队中
    paused(uid){
        this.$store.dispatch("updateState/updatePausedAndMoveAsync", [true,uid]);
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

    //上传状态改变部分 Abort 上传终止
    abortMission(uid,status){
      if(status === '排队中..'){
        this.uploadAbort(uid,status);
      }
      else if(status === '正在上传'){
        for (let element of this.$store.state.updateState.uploadingFiles) {
          if(element.id === uid){
            this.$store.dispatch("updateState/updateAbortAsync",uid);
            break;
          }
        }
      }
      else if(status === '已暂停'){
        this.uploadAbort(uid,status);
      }


    },

    //上传状态改变部分 解除暂停
    unPaused(uid){
      this.$store.dispatch("updateState/updatePausedStatusAsync",uid);

    },

    //上传终止/结束部分 上传历史记录
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
      return res.code === 200;
    },

    //上传准备部分 填充list 填充request进去，到时候直接调用
    mapPostRequest(uploadList,uid){
        const CancelToken = this.$http.CancelToken;
        return uploadList.map(item => {
            const source = CancelToken.source();
            let cancel = source.token;
            const formData = new FormData();
            formData.append("chunk", item.chunk);
            formData.append("name", item.filename);
            formData.append("uid", uid);
            return [this.request.bind(null, formData,cancel),source];
          });
    },
    request(formData,cancel) {

      let uid = formData.get("uid");
      let lastLoad = 0;
      return this.$http.post("/file/uploadSlice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          let loadThisTime = progressEvent.loaded - lastLoad;
          lastLoad = progressEvent.loaded;
          this.$store.dispatch("updateState/addCompleteNessAsync",[uid,loadThisTime]);
        },
        cancelToken: cancel
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
    },
  },
  watch:{
    waitMonitor:{
      handler(val){
        if (this.$store.state.updateState.uploadingFiles.length < 4 && this.$store.state.updateState.waitingFiles.length > 0){
          this.$store.dispatch("updateState/popFileAsync");
          let tmp = this.$store.state.updateState.tmpElement;
          if(tmp.isPause){
            this.$store.dispatch("updateState/pushToUploadingAsync",true);
            this.uploadSend(tmp.pausedList, tmp.hash, tmp.id);
          }else{
            this.$store.dispatch("updateState/pushToUploadingAsync",false);
            this.getUpdatedFiles(tmp.hash,tmp.id,tmp.name,tmp.filePartList.length,tmp.realSize);
          }

        }
      }
    },

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