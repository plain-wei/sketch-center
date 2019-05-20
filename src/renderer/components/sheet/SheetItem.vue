<template>
<div class="sheet-item">
  <img :src="sheet.thumb" @click="toSheetDetails"/>
  <div class="name">
    <span class="truncate">{{sheet.name}}</span>
  </div>
  <span class="number">{{sheet.songNumber}}首歌曲</span>
</div>
</template>

<script>
export default {
  name  : 'SheetItem',
  props : {
    sheet : {
      type     : Object,
      required : true,
    },
  },
  methods : {
    toSheetDetails() {
      console.warn('/main/sheetDetails');
      this.$router.push('/main/sheetDetails');
    },
  },
};
</script>

<style lang="less">
.sheet-item {
  @apply flex flex-col items-center select-none;
  >img {
    width: 180px;
    height: 180px;
    @apply cursor-pointer;
  }
  >.name {
    width: 180px;
    @apply flex flex-grow text-sm text-black6 mt-2 justify-center;
  }
  >.number {
  @apply text-xs text-black9 mt-1;
  }
}
</style>
