<template>

</template>

<script>
export default {
  name: "checkAndPOP",

  methods:{

    charCheck(str){
      str = str.replace(/[\W]/ig,'');
      return str;
    },

    checkPasswordAvailable(event,inputID,errorMsgID){
  let pattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[-*/+.~!@#$%^&*(),]).*$/g;
  if(!pattern.test(this.password)){
    this.errorDealing(event,inputID,errorMsgID);
    return true;
  }else{
    this.recover(event,inputID,errorMsgID);
    return false;
  }
},

    checkOldPasswordAvailable(event,inputID,errorMsgID){
      let pattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[-*/+.~!@#$%^&*(),]).*$/g;
      if(!pattern.test(this.oldPassword)){
        this.errorDealing(event,inputID,errorMsgID);
        return true;
      }else{
        this.recover(event,inputID,errorMsgID);
        return false;
      }
    },
    checkIfSame(event,inputID,errorMsgID){
      if(this.rePassword !== this.password){
        this.errorDealing(event,inputID,errorMsgID);
        return true;
      }else{
        this.recover(event,inputID,errorMsgID);
        return false;
      }
    },
    checkEmail(event,inputID,errorMsgID){
      let pattern = /[\w]+(\.[\w]+)*@[\w]+(\.[\w])+/g;
      if(!pattern.test(this.email)){
        this.errorDealing(event,inputID,errorMsgID);
        return true;
      }else{
      this.recover(event,inputID,errorMsgID);
      return false;
      }
    },

    checkCodeName(event,inputID,errorMsgID){
      let pattern = "621496049";
      if(this.codeName !== pattern){
        this.errorDealing(event,inputID,errorMsgID);
        return true;
      }else{
        this.recover(event,inputID,errorMsgID);
        return false;
      }
    },

errorDealing(event,inputID,errorMsgID){
  if(document.getElementById(errorMsgID)){
    let errMsg = document.getElementById(errorMsgID);
    this.shakingAnime(errMsg);
  }
  let v = document.getElementById(inputID);
  v.style.backgroundColor = "#fbc4c4";
},

recover(event,inputID,errorMsgID){
  let v = document.getElementById(inputID);
  v.style.backgroundColor = "transparent";
} ,

shakingAnime(target) {
  target.animate([{transform: 'translateX(0)'}, {transform: 'translateX(-3%)'}, {transform: 'translateX(0%)'}, {transform: 'translateX(3%)'},
        {transform: 'translateX(0%)'}, {transform: 'translateX(-3%)'}, {transform: 'translateX(0%)'}, {transform: 'translateX(3%)'},
        {transform: 'translateX(0%)'}, {transform: 'translateX(-3%)'}, {transform: 'translateX(0%)'}, {transform: 'translateX(3%)'},
        {transform: 'translateX(0%)'}, {transform: 'translateX(-3%)'}, {transform: 'translateX(0%)'}, {transform: 'translateX(3%)'},
        {transform: 'translateX(0%)'}, {transform: 'translateX(-3%)'}, {transform: 'translateX(0%)'}, {transform: 'translateX(3%)'},
        {transform: 'translateX(0%)'}],
      {
        duration: 300
      }
  )
}
  }
}
</script>

<style scoped>

</style>