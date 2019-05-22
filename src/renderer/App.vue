<template>
  <div id="app" :style="{backgroundImage: appBackImage}">
    <router-view/>
  </div>
</template>

<script>
export default {
  name       : 'app',
  components : {
  },
  computed : {
    appBackImage() {
      return '';
      // return false ? `url(${require('../assets/img/app-bg.jpg')})` : '';
    },
  },
  mounted() {
    // console.warn(__static);
  },
};
</script>

<style lang="less">
  html {
    height: 100%;

    body {
      height: 100%;
      padding: 0;
      margin: 0;

      #app {
        height: 100%;
        background-size: cover;
      }
    }
  }

</style>
