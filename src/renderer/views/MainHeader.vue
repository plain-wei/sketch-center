<template>
  <div id="main-header" class="drag">
    <div class="flex items-center h-full">
      <div class="flex flex-grow ml-10">
        <el-input
            class="no-drag"
            size="medium"
            style="width: 280px"
            v-model="searchText"
            placeholder="请输入内容"
            suffix-icon="el-icon-search">
        </el-input>
      </div>
      <header-operation/>

    </div>
  </div>
</template>

<script>
import HeaderOperation from '../components/header/HeaderOperation.vue';

export default {
  name       : 'MainHeader',
  components : {
    HeaderOperation,
  },
  data() {
    return {
      searchText : '',
    };
  },
};
</script>

<style scoped lang="less">
#main-header {
  height: 60px;
  background-color: #f2eef2;
}
</style>
