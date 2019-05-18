<template>
  <div id="main-header" class="drag bg-main-header">
    <div class="flex items-center h-full">
      <div class="flex flex-grow ml-10">
        <el-input
            class="no-drag search-input"
            size="small"
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

<style lang="less">
#main-header {
  height: 60px;
  .search-input {
    >input {
      border-radius: 100px;
    }
  }
}
</style>
