### vite初始化项目

```shell
cva vant-v3
或者
create-vite-app vant-v3
```

### vue-router 4.0

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

### 移动端rem适配

- postcss-pxtorem 是一款postcss插件，用于将单位转换成rem

- lib-flexible用于设置rem基准值

```shell
yarn add lib-flexible -S
yarn add postcss-pxtorem -D
```

:::tips
这里 lib-flexible 是网页做 html 的 font-size 适配用的，所以需要安装到 dependencies。而 postcss-pxtorem 是在编译的时候对 px 单位转换为 rem 单位时使用，所以安装到 devDependencies 便可。
:::

## 模拟数据

### 使用插件实现数据模拟

1. 安装依赖

```shell
npm i -D apite
```

2. 配置插件

```
import { viteExt } from 'apite'
export default {
	// ...
	configureServer: [viteExt({
		// apite config
	})]
}
```