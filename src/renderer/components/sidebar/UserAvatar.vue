<template>
  <shared-avatar :url="userInfo.avatar" :size="size"/>
</template>

<script>
/* eslint-disable global-require */
import SharedAvatar from '../shared/SharedAvatar.vue';

export default {
  name       : 'UserAvatar',
  components : {
    SharedAvatar,
  },
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
