<!--
 * @Author: Li Zhiliang
 * @Date: 2020-11-24 18:25:54
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2020-11-24 21:08:27
 * @FilePath: /vue-learning/components-demo/src/App.vue
-->
<template>
  <div id="app">
    <Header />
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Header from './components/layout/header.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Header
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
