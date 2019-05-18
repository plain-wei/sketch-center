<template>
  <div id="music-controls">
      <sk-icon type="sk-start"/>
      <sk-icon type="sk-play" class="mx-6 play-icon"/>
      <sk-icon type="sk-end"/>
  </div>
</template>

<script>
export default {
  name : 'MusicControls',
};
</script>

<style lang="less">
#music-controls {
  width: 200px;
  @apply flex justify-center items-center;
  .sketch-icon {
    font-size: 24px;
    @apply text-music-controls cursor-pointer;
  }
  .play-icon {
    font-size: 30px !important;
  }
}
</style>
