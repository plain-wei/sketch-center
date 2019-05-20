<template>
  <div id="system-nav">
    <div class="nav-items">
      <div v-for="(nav, index) in navList"
           :key="index"
           class="nav-item hover:bg-nav-hovered"
           @click="$router.push(nav.route)">
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
        { name: '推荐', icon: 'sk-star', route: '/main/recommendation' },
        { name: '电台', icon: 'sk-audio', route: '/main/radioCenter' },
        { name: '视频', icon: 'sk-video', route: '/main/videoCenter' },
        { name: '摄影', icon: 'sk-camera', route: '/main/photoCenter' },
      ],
    };
  },
};
</script>

<style scoped>

</style>
