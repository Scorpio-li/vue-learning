import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 全局注册pdf插件
// 在 main.js 中导入插件
import pdf from "./utils/htmlToPdf2";

// 注册插件
Vue.use(pdf);

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')