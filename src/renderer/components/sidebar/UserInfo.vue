<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
  <div id="user-info">
    <div class="flex items-center h-full">
      <div class="user-avatar ml-6">
        <img v-popover:userPopover :src="userInfo.avatar"/>
      </div>
      <div class="flex flex-grow w-1 pl-6">
        <span class="text-sm text-black6">{{userInfo.name}}</span>
      </div>
    </div>
    <el-popover
        ref="userPopover"
        placement="right"
        width="224"
        :visible-arrow="false"
        popper-class="user-info-popper"
        trigger="click">
      <div>
        <div class="top-content flex items-center">
          <div class="user-avatar">
            <img :src="userInfo.avatar"/>
          </div>
          <div class="user-desc flex flex-col flex-grow w-1 pl-2">
            <span class="text-sm text-indigo-400">{{userInfo.name}}</span>
            <span class="text-xs text-black9">累计听歌6488首</span>
          </div>
        </div>
        <div class="operation-content flex flex-col">
          <div class="operation-item hover:bg-item-hovered">
            <i class="el-icon-news"></i>
            <span class="px-2 text-sm">个人中心</span>
          </div>
          <div class="operation-item hover:bg-item-hovered">
            <i class="el-icon-back"></i>
            <span class="px-2 text-sm">退出登录</span>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name : 'UserInfo',
  data() {
    return {
      userInfo : {
        avatar : require('../../../assets/img/user-avatar.jpeg'),
        name   : '未思',
      },
    };
  },
};
</script>

<style lang="less">
#user-info {
  height: 60px;
  .user-avatar > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    user-select: none;
    cursor: pointer;
  }
}
  .user-info-popper {
    left: -6px !important;
    padding: 0px !important;
    .top-content{
      height: 60px;
      border-bottom: 1px solid #EEE;
      @apply py-2 mx-4;
      .user-avatar > img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        user-select: none;
        cursor: pointer;
      }
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
