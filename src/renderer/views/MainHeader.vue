<template>
  <div id="main-header" class="drag bg-main-header">
    <div class="flex items-center h-full">
      <sk-icon class="mx-2 px-2 cursor-pointer no-drag text-theme-color hover:text-black6"
               type="sk-arrowleft"
               @click.native="goBack"/>
      <div class="flex flex-grow">
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
  methods : {
    goBack() {
      this.$router.back();
    },
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
