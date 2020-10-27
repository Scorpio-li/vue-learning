<template>
  <!-- <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p> -->
  <div>
    <h3>Vite is the future of Frontend Developement.</h3>
    <small>Thanks to Evan You</small>
    <br />
    <button @click="darkThemeSwitch">switch</button>
  </div>
</template>

<script>
import themeChanger from "../util/theme.js";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0,
      themeChanger: null,
    }
  },
  methods: {
    darkThemeSwitch() {
      this.themeChanger._darkThemeSwitch();
    },
  },
  created() {
    this.themeChanger = new themeChanger();
  }
}
</script>
