<template>
  <div id ="userListStage">
    <ul class = "user">
      <li v-for="item in userList.filter(data => !this.$store.state.searchStr || data.user_name.toLowerCase().includes(this.$store.state.searchStr.toLowerCase()))" v-bind:key = "item.node_id">
          <UserCard :user = "item"></UserCard>
      </li>
    </ul>
    <div class = "nothing" v-if="isNoContent">
      <p>太悲伤了，没有镇民愿意分享ta的资源！<br/>Nothing Here!</p>
    </div>

  </div>
</template>

<script>
import UserCard from "@/components/UserCard";
export default {
  name: "UserList",
  components: {UserCard},
  props:["userList"],
  data(){
    return{
      isNoContent:false,
    }
  },
  methods:{
    reload(){
      this.$emit("reload");
    },
    passThough(path){
      this.$emit("pass",path);
    }
  },

  watch:{
    'itemList':{
      handler(val){
        if(val.length === 0){
          this.isNoContent = true;
        }
        else{
          this.isNoContent = false;
        }
      }
    },
}
}
</script>

<style scoped>
*{
  margin:0px;
  padding:0px;
}
#userListStage{
  box-sizing: border-box;
  width: 100%;
  padding-bottom: 170px;
}
.nothing{
  width: 100%;
  height: calc(100vh - 300px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.nothing > p{
  font-family: "AaGothic (Non-Commercial Use)";
  text-align: center;
  color: white;
}

.user{
  width: 100%;
  max-height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;

  grid-gap: 5px 5px;
}
li{

  width: 100%;
  height: 100%;
  list-style: none;

}
</style>