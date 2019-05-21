<template>
<div id="update-sheet">
  <span>编辑歌单信息</span>
  <div class="update-content">
    <div class="update-thumb">
      <img :src="updatedSheet.thumb"/>
      <span>编辑封面</span>
      <div>封面请上传JPG,JPEG或PNG文件，且不超过1M</div>
      <el-button plain size="small">上传</el-button>
    </div>
    <div class="update-details">

    </div>
  </div>
</div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { cloneDeep } from 'lodash';

export default {
  name : 'UpdateSheet',
  data() {
    return {
      updatedSheet : {},
    };
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     console.warn(from)
  //     // vm.updatedSheet = cloneDeep(from);
  //   })
  // },
  created() {
    const { params } = this.$router.currentRoute;

    this.updatedSheet = cloneDeep(params);
    console.warn(this.updatedSheet)
  },
};
</script>

<style lang="less">
#update-sheet {
  @apply flex flex-col;
  .update-content {
    @apply flex;
    .update-thumb ,.update-details{
      @apply flex flex-col;
      >img {
        width: 180px;
        height: 180px;
      }
    }
  }
}
</style>
