<template>
  <div id="header-operation">
    <div class="flex text-xl">
      <div class="operation-item minimize no-drag">
        <sk-icon type="sk-minimize"/>
      </div>
      <div class="operation-item maximize no-drag">
        <sk-icon type="sk-maximize"/>
      </div>
      <div class="operation-item close no-drag">
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
  .maximize {

  }
}
</style>
