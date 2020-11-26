<!--
 * @Author: Li Zhiliang
 * @Date: 2020-11-24 18:30:58
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2020-11-24 21:07:38
 * @FilePath: /vue-learning/components-demo/src/components/layout/header.vue
-->
<template>
    <header class="c-header">
        <h1 class="c-logo"><a href="#">Logo</a></h1>
        <div class="c-header__nav">
            <nav class="c-nav">
            <ul>
                <li><a href="#">Product</a></li>
                <li><a href="#">Stores</a></li>
                <li><a href="#">Team</a></li>
            </ul>
            </nav>
            <a href="#" class="c-user">
            <span>Ahmad</span>
            <img class="c-avatar" src="shadeed.jpg" alt="">
            </a>
        </div>
    </header>
</template>
<script>
export default {
    name: "Header"
}
</script>
<style scoped>
.c-header {
  padding-left: 16px;
  padding-right: 16px;
}
.c-nav a {
  display: block;
  padding: 16px 8px;
}
.c-nav li {
  /* 这将创建你在骨架中看到的间距 */
  display: inline-block;
}
.c-user img,.c-user span {
    margin-left: 10px;
    margin-inline-start: 1rem;
}

.c-user {
  margin-left: 8px;
}

</style>