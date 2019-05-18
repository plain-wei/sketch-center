<template>
  <div id="local-nav">
    <div class="flex flex-col">
      <div class="header flex h-9 items-center">
        <span class="text-xs text-black9 ml-9">我的音乐</span>
      </div>
      <div class="nav-items">
        <div v-for="(nav, index) in navList"
             :key="index"
             class="nav-item hover:bg-nav-hovered">
          <i class="ml-9" :class="nav.icon"></i>
          <span class="ml-2 text-sm">{{nav.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'LocalNav',
  data() {
    return {
      navList : [
        { name: '本地音乐', icon: 'el-icon-location-outline' },
        { name: '最近播放', icon: 'el-icon-time' },
      ],
    };
  },
};
</script>

<style scoped>

</style>
