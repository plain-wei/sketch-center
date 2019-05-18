<template>
  <div id="play-controls">
    <sk-icon type="sk-sound"/>
    <sk-icon type="sk-comment"/>
    <sk-icon type="sk-love"/>
    <sk-icon type="sk-download"/>
    <sk-icon type="sk-lyric"/>
    <sk-icon type="sk-playlist"/>
  </div>
</template>

<script>
export default {
  name : 'PlayControls',
};
</script>

<style lang="less">
#play-controls {
  width: 290px;
  @apply flex justify-center items-center;
  .sketch-icon {
    @apply mx-3 cursor-pointer;
    >svg {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
