<template>
  <div class="comment-item">
    <shared-avatar :url="comment.user.avatar"/>
    <div class="comment-details">
      <span class="name text-sm text-black3">{{comment.user.name}}</span>
      <span class="date text-xs text-black9 mt-1">{{comment.user.date}}</span>
      <span class="content text-sm text-black3 mt-2">{{comment.content}}</span>
    </div>
  </div>
</template>

<script>
import SharedAvatar from '../shared/SharedAvatar.vue';

export default {
  name       : 'CommentItem',
  components : { SharedAvatar },
  props      : {
    comment : {
      type     : Object,
      required : true,
    },
  },
};
</script>

<style scoped lang="less">
  .comment-item {
    @apply flex py-4;
    .comment-details {
      border-bottom: 1px solid #e4e4e4;
      @apply flex flex-col ml-4 pb-3 border-b;
    }
  }
</style>
