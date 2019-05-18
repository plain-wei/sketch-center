<template>
  <div id="personal-nav">
    <div class="flex flex-col">
      <div class="header flex h-9 items-center">
        <span class="text-xs text-black9 ml-9">我的歌单</span>
      </div>
      <div class="nav-items">
        <div v-for="(nav, index) in navList"
             :key="index"
             class="nav-item hover:bg-nav-hovered">
          <i class="ml-9" :class="nav.icon"></i>
          <span class="px-2 text-sm truncate">{{nav.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'PersonalNav',
  data() {
    return {
      navList : [
        { name: '我的收藏', icon: 'el-icon-menu' },
        { name: '安之若素', icon: 'el-icon-document' },
        { name: '松墨初上', icon: 'el-icon-document' },
        { name: '静默如初', icon: 'el-icon-document' },
        { name: '时光请浅', icon: 'el-icon-document' },
        { name: '轻吟浅唱，去拥抱一夏天的风', icon: 'el-icon-document' },
      ],
    };
  },
};
</script>

<style scoped>

</style>
