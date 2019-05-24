<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
  <div id="user-info">
    <div class="flex items-center h-full">
      <user-avatar class="ml-6"
                   v-popover:userPopover
                   @click="visible = true"/>
      <div class="flex flex-grow w-1 pl-6">
        <span class="text-sm text-black6">{{userInfo.name}}</span>
      </div>
    </div>
    <el-popover
        v-model="visible"
        ref="userPopover"
        placement="right"
        width="224"
        :visible-arrow="false"
        popper-class="user-info-popper"
        trigger="click">
      <div>
        <div class="top-content flex items-center">
          <user-avatar/>
          <div class="user-desc flex flex-col flex-grow w-1 pl-2">
            <span class="text-sm text-indigo-400">{{userInfo.name}}</span>
            <span class="text-xs text-black9">累计听歌6488首</span>
          </div>
        </div>
        <div class="operation-content flex flex-col">
          <div class="operation-item hover:bg-item-hovered" @click="toSelfCenter">
            <sk-icon type="sk-user" />
            <span class="px-2 text-sm">个人中心</span>
          </div>
          <div class="operation-item hover:bg-item-hovered">
            <sk-icon type="sk-logout" />
            <span class="px-2 text-sm">退出登录</span>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import UserAvatar from './UserAvatar.vue';

export default {
  name       : 'UserInfo',
  components : {
    UserAvatar,
  },
  data() {
    return {
      userInfo : {
        name : '未思',
      },
      visible : false,
    };
  },
  methods : {
    toSelfCenter() {
      this.$router.push('/main/selfCenter');
      this.visible = false;
    },
  },
};
</script>

<style lang="less">
#user-info {
  height: 60px;
}
  .user-info-popper {
    left: -6px !important;
    padding: 0 !important;
    @apply bg-white;
    .top-content{
      height: 60px;
      border-bottom: 1px solid #EEE;
      @apply py-2 mx-4;
      .user-desc {
        height: 40px;
        justify-content: space-around;
      }
    }
    .operation-content{
      @apply py-2;
      .operation-item {
        @apply flex h-10 items-center leading-tight cursor-pointer pl-4 text-black6;
      }
    }
  }
</style>
