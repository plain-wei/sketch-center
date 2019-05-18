<template>
  <div id="music-status">
    <div class="music-thumb">
      <img :src="musicInfo.thumb"/>
    </div>
    <div class="music-details">
      <div class="flex justify-between items-center">
        <span class="text-sm">{{musicInfo.name}}</span>
        <span class="text-xs text-black6">{{musicInfo.playTime}}/{{musicInfo.totalTime}}</span>
      </div>
      <el-progress class="mt-2"
                   :percentage="10"
                   :stroke-width="4"
                   :show-text="false"
      ></el-progress>
    </div>
  </div>
</template>

<script>
export default {
  name : 'MusicStatus',
  data() {
    return {
      musicInfo : {
        thumb     : 'http://p1.music.126.net/42nAVEpHboRsk0RkP9DnIQ==/109951164012864249.jpg',
        name      : 'The Truth That You Leave',
        singer    : 'Pianoboy',
        totalTime : '03:43',
        playTime  : '01:38',
      },
    };
  },
};
</script>

<style lang="less">
#music-status {
  @apply flex flex-grow w-1 items-center;
  .music-thumb {
    font-size: 0;
    @apply h-full;
    >img {
       @apply h-full;
    }
  }
  .music-details {
    @apply flex flex-col flex-grow justify-center mx-2 h-full;
  }
}
</style>
