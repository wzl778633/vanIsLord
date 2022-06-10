<template>
  <div>
    <viewer
        :images="images"
        :options="options"
        class="viewer"
        ref="viewer"
        @inited="inited"
        v-if="images && images.length"
    >
      <img
          v-for="item in images"
          :src="item.src"
          :realSrc="item.realSrc"
          :alt="item.name"
          :key="item.node_id"
          class="image"
      >
    </viewer>
  </div>
</template>

<script>
export default {
  name: "ImgViewer",
  data() {
    return {
      options: {
        movable:false,
        title: function (image) {
          return image.alt + ' (' + (this.index + 1) + '/' + this.length + ')';
        },
        url: "realSrc"
      },
      index: 0,
      images: []
    };
  },
  methods: {
    inited (viewer) {
      this.$viewer = viewer;
      this.$viewer.view(this.index);
    },
    view (index) {
      this.index = index;
      this.$viewer.view(this.index);
    },
    show (images, index = 0) {
      if (this.images === images) {
        this.view(index);
        return;
      }
      this.images = images;
      this.index = index;
    }
  }
}
</script>

<style scoped>
.image {
  display: none;
}
</style>
<style>
.viewer-loading > img {
  display: none;  /* hide big images when it is loading */
}
</style>