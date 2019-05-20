<template>
  <i class="sketch-icon">
    <svg class="icon svgfont" aria-hidden="true">
      <use :xlink:href="xlinkHref"></use>
    </svg>
  </i>
</template>

<script>
export default {
  name  : 'SketchIcon',
  props : {
    type : {
      type     : String,
      required : true,
    },
  },
  computed : {
    xlinkHref() {
      return `#${this.type}`;
    },
  },
};
</script>

<style scoped lang="less">
.sketch-icon {
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
