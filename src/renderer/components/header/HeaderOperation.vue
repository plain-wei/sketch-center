<template>
  <div id="header-operation">
    <div class="flex text-xl px-2">
      <div class="operation-item minimize no-drag hover:text-black6">
        <sk-icon type="sk-minimize"/>
      </div>
      <div class="operation-item maximize no-drag hover:text-black6">
        <sk-icon type="sk-maximize"/>
      </div>
      <div class="operation-item close no-drag hover:text-danger">
        <sk-icon type="sk-close"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'HeaderOperation',
};
</script>

<style scoped lang="less">
#header-operation {
  .operation-item {
    @apply flex items-center cursor-pointer mx-2 text-black8;
  }
}
</style>
