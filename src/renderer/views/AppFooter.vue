<template>
  <div id="app-footer">
    <div class="flex h-full">
      <music-controls class="h-full"/>
      <music-status class="h-full"/>
      <play-controls class="h-full"/>
    </div>
  </div>
</template>

<script>
import MusicControls from '../components/footer/MusicControls.vue';
import MusicStatus from '../components/footer/MusicStatus.vue';
import PlayControls from '../components/footer/PlayControls.vue';

export default {
  name       : 'AppFooter',
  components : {
    MusicControls,
    MusicStatus,
    PlayControls,
  },
};
</script>

<style scoped lang="less">
#app-footer {
  height: 64px;
  @apply bg-footer;
}
</style>
