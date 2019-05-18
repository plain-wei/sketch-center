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
          <sk-icon class="ml-9" :type="nav.icon"></sk-icon>
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
        { name: '我的收藏', icon: 'sk-love' },
        { name: '安之若素', icon: 'sk-playlist' },
        { name: '松墨初上', icon: 'sk-playlist' },
        { name: '静默如初', icon: 'sk-playlist' },
        { name: '时光请浅', icon: 'sk-playlist' },
        { name: '轻吟浅唱，去拥抱一夏天的风', icon: 'sk-playlist' },
      ],
    };
  },
};
</script>

<style scoped>

</style>
