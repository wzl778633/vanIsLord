<template>
    <!--transition-group name = "mainDev" class = "document" tag = "ul"-->
<ul class = "document">
  <li v-for="item in itemList" v-bind:key = "item.node_id">
    <Document :item = "item" @needRedirect = "passThough"></Document>
  </li>
</ul>
    <!--/transition-group-->
</template>

<script>
import Document from '@/components/Document.vue'

export default {
  name: "DocumentList",
  props: ["itemList"],
  data(){
    return{
    }
  },
  components:{
    Document,
  },
  methods:{
    passThough(path){
      this.$emit("pass",path);
    }
  }
}
</script>

<style scoped>
*{
  margin:0px;
  padding:0px;
}

.document{
  width: 100%;
  max-height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 176px;
  grid-gap: 5px 5px;
}
li{

  width: 100%;
  height: 100%;
  list-style: none;

}

.mainDev-enter-active, .mainDev-leave-active {
  transition: all 0.3s;
}
.mainDev-enter, .mainDev-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>