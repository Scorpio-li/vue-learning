<!--
 * @Author: Li Zhiliang
 * @Date: 2021-01-22 15:53:02
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-01-22 15:55:54
 * @FilePath: /vue-learning/knowledge/vue3/API.MD
-->

# 全局API

## 1. 不再使用new Vue

vue2.0 使用new Vue会共享一个全局配置。这对于测试来说不太友好，每个测试用例都需要一个沙盒环境，全局变量去残留一些副作用。

```js
import Vue from 'vue'
import App from './App.vue'

new Vue({
    render: h => h(App)
}).$mount('#app)
```

所有开始使用application概念，创建一个App。

```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app') // 需要手动挂载根元素
```

## 2. 不再用Vue.prototype

```js
// before - Vue 2
Vue.prototype.$http = () => {}
```

```js
// after - Vue 3
const app = Vue.createApp({})
app.config.globalProperties.$http = () => {}
```

## 3. 全局方法现在在app实例上

vue2.x|	vue3
|--|--|
Vue.component	|app.component
Vue.directive	|app.directive
Vue.mixin	|app.mixin
Vue.use	|app.use

## 4. Tree-shaking

没有用到的方法(代码)最后不会被打包到最终的包中。这可以优化项目体积。 但是用法也需要进行改变：

```js
import { nextTick } from 'vue'

nextTick(() => {
  // something DOM-related
})
```

> 不能再使用Vue.nextTick/this.$nextTick


## 5. 🔥异步组件需要显示定义

```js
import { defineAsyncComponent } from 'vue'

const asyncPage = defineAsyncComponent(() => import('./NextPage.vue'))
```

## 6. 🔥指令

vue2.x|	vue3
|---|---|
bind	|beforeMount
inserted|	mounted
-	| beforeUpdate (新)
update (移除)	|-
componentUpdated|	updated
-	|beforeUnmount (新)
unbind|	unmounted

## 7. 事件API被移除

**$on,$off,$once**不再使用。2.x的EventBus方法不能再使用。

