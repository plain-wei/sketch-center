<template>
  <div id="system-nav">
    <div class="nav-items">
      <div v-for="(nav, index) in navList"
           :key="index"
           class="nav-item hover:bg-nav-hovered">
        <i class="ml-9" :class="nav.icon"></i>
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
        { name: '推荐', icon: 'el-icon-star-off' },
        { name: '电台', icon: 'el-icon-service' },
        { name: '视频', icon: 'el-icon-mobile-phone' },
        { name: '摄影', icon: 'el-icon-picture-outline' },
      ],
    };
  },
};
</script>

<style scoped>

</style>
