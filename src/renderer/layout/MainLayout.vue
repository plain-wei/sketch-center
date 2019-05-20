<template>
  <div id="main-layout" class="h-full">
    <div class="flex flex-col h-full">
      <div class="flex flex-grow h-1">
        <router-view name="sidebar"/>
        <div class="flex flex-col w-1 flex-grow">
          <router-view name="header"/>
          <router-view/>
        </div>
      </div>
      <router-view name="footer"/>
    </div>
  </div>
</template>

<script>
export default {
  name : 'MainLayout',
};
</script>

<style scoped lang="less">

</style>
