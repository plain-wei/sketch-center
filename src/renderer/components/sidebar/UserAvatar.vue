<template>
  <div id="user-avatar" @click="visible = true">
    <img :src="userInfo.avatar" :style="{width: imageSize, height: imageSize}"/>
  </div>
</template>

<script>
export default {
  name  : 'UserAvatar',
  props : {
    size : {
      type    : Number,
      default : 40,
    },
  },
  data() {
    return {
      userInfo : {
        avatar : require('../../../assets/img/user-avatar.jpeg'),
      },
    };
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
