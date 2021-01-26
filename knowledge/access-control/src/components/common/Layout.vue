<template>
  <div class="wrapper">
    <!-- <v-sidebar></v-sidebar> -->
    <div class="content-box">
      <!-- <v-head></v-head> -->
      <div class="content">
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
// import vHead from './Header.vue'
// import vSidebar from './Sidebar/Index.vue'
export default {
  name: 'Layout',
  components: {
    // vHead,
    // vSidebar
  }
}
</script>
