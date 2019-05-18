<template>
  <div id="app-sidebar" class="bg-sidebar">
    <div class="flex flex-col h-full">
      <user-info/>
      <el-scrollbar class="nav h-1 flex flex-col flex-grow">
        <system-nav/>
        <local-nav/>
        <personal-nav/>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import UserInfo from '../components/sidebar/UserInfo.vue';
import SystemNav from '../components/sidebar/SystemNav.vue';
import LocalNav from '../components/sidebar/LocalNav.vue';
import PersonalNav from '../components/sidebar/PersonalNav.vue';

export default {
  name       : 'AppSidebar',
  components : {
    UserInfo,
    SystemNav,
    LocalNav,
    PersonalNav,
  },
};
</script>

<style lang="less">
  #app-sidebar {
    width: 200px;
    .el-scrollbar {
      .el-scrollbar__wrap {
        overflow-x: auto;
      }
    }
    .nav {
      .nav-items {
        @apply flex flex-col;
        .nav-item {
          @apply flex leading-tight items-center h-9 cursor-pointer select-none;
        }
      }
    }
  }
</style>
