<!--
 * @Author: Li Zhiliang
 * @Date: 2020-10-26 11:26:30
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2020-10-26 15:20:57
 * @FilePath: /vue-learning/README.md
-->
# vue-learning

<p align="center">
  <img src="https://s.yezgea02.com/1602639218100/vue3-exmples%E4%BB%93%E5%BA%93%E5%AE%A3%E4%BC%A0%E5%9B%BE1.png" alt="One Piece" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/%E5%95%A5%E9%83%BD%E5%88%AB%E8%AF%B4-%E6%89%B6%E6%88%91%E8%B5%B7%E6%9D%A5-%2341b883?style=for-the-badge&logo=appveyor">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-green">
  <img src="https://img.shields.io/badge/license-MIT-%23ccc">
</p>

## Vue 学习相关

<!--   0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟 -->
⌛ 最近更新时间：2️⃣ 0️⃣ 2️⃣ 0️⃣ / 1️⃣ 0️⃣ / 2️⃣ 6️⃣ ⏳

👀 本人会在仓库内更新一些 `Vue` 相关的学习资料及小Demo，供大家学习和参考。

### vue-examples

1、[Vue3.0 + Vue-Router4.0 + Vuex4.0 + Vant3.0 种子项目搭建过程](https://github.com/Scorpio-li/vue-learning/tree/master/examples/vant-v3)

- vite初始化项目

```shell
cva vant-v3
或者
create-vite-app vant-v3
```

- vue-router 4.0

```js
// Vue-Router 3.x
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:  [
  	// 路由配置不变
  ]
})

// Vue-Router 4.0
const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      component: Home
    }
  ]
})
```

```js
// Vue-Router 3.x
export default {
  methods: {
    goToHome() {
      this.$router.push('Home')
    }
  }
}

// Vue-Router 4.0
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const goToHome = () => router.push('Home')
    return { goToHome }
  }
}
```

- 移动端rem适配
    - postcss-pxtorem 是一款postcss插件，用于将单位转换成rem
    - lib-flexible用于设置rem基准值

```shell
yarn add lib-flexible -S
yarn add postcss-pxtorem -D
```

:::tips
这里 lib-flexible 是网页做 html 的 font-size 适配用的，所以需要安装到 dependencies。而 postcss-pxtorem 是在编译的时候对 px 单位转换为 rem 单位时使用，所以安装到 devDependencies 便可。
:::


📖 下面是 `Vue3.0` 及周边相关文档地址：

| 相关库名称 | 在线地址 🔗 |
| --------- | ----- |
| Vue3.0 官方文档 | [在线地址](https://v3.vuejs.org/) |
| Vue3.0 中文文档 | [在线地址](https://v3.cn.vuejs.org/) [国内加速版](https://vue3js.cn/docs/zh/)|
| Composition-API手册 | [在线地址](https://vue3js.cn/vue-composition-api/) |
| Vue3.0 源码学习 | [在线地址](https://vue3js.cn/start/) |
| Vue-Router 官方文档 | [在线地址](https://next.router.vuejs.org/) |
| Vuex4.0（目前在 beta 阶段） | [Github](https://github.com/vuejs/vuex/tree/4.0) |
| vue-devtools | [Github](https://github.com/vuejs/vue-devtools/releases)(Vue3.0 需要使用最新版本) |

🎨 更新 `Vue3.0` 版本的 UI 库：

| 相关库名称 | 文档地址 🔗 | 仓库地址 🏠 |
| --------- | ----- | ----- |
| Vant | [在线地址](https://vant-contrib.gitee.io/vant/next/#/) | [在线地址](https://github.com/youzan/vant/tree/next) |
| Ant Design Vue | [在线地址](https://2x.antdv.com/docs/vue/introduce-cn/) | [在线地址](https://github.com/vueComponent/ant-design-vue/) |
| Element-plus(社区版) | [在线地址](https://element3.vercel.app/#/zh-CN) | [在线地址](https://github.com/element-plus/element-plus/issues/171) |
| Taro(Vue3) | [在线地址](http://taro-docs.jd.com/taro/docs/vue3) | [在线地址](https://github.com/nervjs/taro) |



