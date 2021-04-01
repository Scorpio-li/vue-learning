<template>
  <div id="app">
    <!-- <Header />
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <router-view />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import Header from './components/layout/header.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    // Header
  }
}
</script>

<style>
#app {
        width: 100%;
        height: 100%;
    } 
</style>
