<template>
  <div id="system-nav">
    <div class="nav-items">
      <div v-for="(nav, index) in navList"
           :key="index"
           class="nav-item hover:bg-nav-hovered">
        <sk-icon class="ml-9" :type="nav.icon"></sk-icon>
        <span class="ml-2 text-sm">{{nav.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'SystemNav',
  data() {
    return {
      navList : [
        { name: '推荐', icon: 'sk-star' },
        { name: '电台', icon: 'sk-audio' },
        { name: '视频', icon: 'sk-video' },
        { name: '摄影', icon: 'sk-camera' },
      ],
    };
  },
};
</script>

<style scoped>

</style>
