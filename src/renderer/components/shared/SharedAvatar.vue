<template>
  <div id="user-avatar" @click="visible = true">
    <img :src="url" :style="{width: imageSize, height: imageSize}"/>
  </div>
</template>

<script>
/* eslint-disable global-require */

export default {
  name  : 'SharedAvatar',
  props : {
    size : {
      type    : Number,
      default : 40,
    },
    url : {
      type     : String,
      required : true,
    },
  },
  computed : {
    imageSize() {
      return `${this.size}px`;
    },
  },
};
</script>

<style scoped lang="less">
  #user-avatar {
    > img {
      border-radius: 50%;
      user-select: none;
      cursor: pointer;
    }
  }
</style>
