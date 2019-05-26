<template>
<div id="update-sheet">
  <span class="font-bold text-xl">编辑歌单信息</span>
  <div class="update-content">
    <div class="update-thumb">
      <img :src="updatedSheet.thumb"/>
      <span class="mt-4 text-sm">编辑封面</span>
      <div class="mt-2 text-black9 text-xs">封面请上传JPG,JPEG或PNG文件，且不超过1M</div>
      <el-button plain size="small" class="mt-4">上传</el-button>
    </div>
    <div class="update-details">
      <span class="label">歌单名：</span>
      <el-input class="item" size="small" placeholder="请输入内容"></el-input>
      <span class="label">添加标签：</span>
      <div class="item">
        <el-tag class="mr-2" closable>标签一</el-tag>
        <el-tag class="mr-2" closable>标签一</el-tag>
        <el-tag class="mr-2" closable>标签一</el-tag>
        <span class="text-xs text-black9 ml-2">还可以选择2个标签</span>
      </div>
      <span class="label">简介：</span>
      <el-input
          class="item"
          type="textarea"
          :rows="4"
          placeholder="请输入内容">
      </el-input>
      <div class="flex justify-end mt-4">
        <el-button type="primary" size="small" class="w-20">保存</el-button>
        <el-button size="small" class="w-20" @click="$router.back()">取消</el-button>
      </div>
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
    console.warn(this.updatedSheet);
  },
};
</script>

<style lang="less">
#update-sheet {
  @apply flex flex-col w-full px-9 py-2;
  .update-content {
    @apply flex h-full mt-8;
    .update-thumb ,.update-details{
      @apply flex flex-col;
      >img {
        width: 180px;
        height: 180px;
      }
    }
    .update-thumb{
      width: 180px;
    }
    .update-details {
      @apply w-1 flex-grow ml-10;

      .label:not(:first-child) {
        @apply text-sm mt-4;
      }
      .item {
        @apply mt-2;
        input, textarea {
          border: none;
          background-color: rgba(246, 246, 246, .8);
        }
      }
    }
  }
}
</style>
