<!--
 * @Author: Li Zhiliang
 * @Date: 2020-12-31 15:34:04
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2020-12-31 15:34:23
 * @FilePath: /vue-learning/knowledge/jsVariable/index.vue
-->
<template>
  <div class="box" :style="styleVar">
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: Number,
      default: 54,
    },
  },
  computed: {
    styleVar() {
      return {
        '--box-height': this.height + 'px'
      }
    }
  },
}
</script>
<style scoped>
.box {
  height: var(--box-height);
}
</style>
