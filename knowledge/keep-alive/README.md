# keep-alive

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## **keep-alive**是什么，它有什么作用

- **keep-alive**是vue的内置组件，无需单独安装手动注册，**keep-alive**不会向DOM添加额外节点。

- **keep-alive**是一个能提供缓存功能，保存子组件内部状态的组件。

- **keep-alive**包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。

- 当被缓存的子组件再次切换为活动状态时，不会执行其完整的生命周期，而是相应的执行**activated、deactivated**生命周期函数。

## keep-alive的用法

Props：

- include - 字符串或正则表达式。只有名称匹配的组件会被缓存。

- exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。

- max - 数字。最多可以缓存多少组件实例。

### 路由中使用:

```js
<keep-alive :include="includeList" :exclude="excludeList" :max="maxNum">
  <router-view />
</keep-alive>
```

### 态组件中使用:

```js
<keep-alive>
  <component :is="view"/>
</keep-alive>
```

## 源码

```js
// 源码 => vue/src/core/components/keep-alive.js 
export default {
  name: 'keep-alive',
  abstract: true, //定义抽象组件 判断当前组件虚拟dom是否渲染成真实dom

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null) // 缓存VNode
    this.keys = [] // 缓存VNode的key
  },

  destroyed () {
    // 销毁时删除所有缓存的VNode
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    // 监听 include和exclude属性，及时的更新缓存
    // pruneCache 对cache做遍历，把不符合新规则的VNode从缓存中移除
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot) // 只处理第一个子元素
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    // 存在组件配置选项
    if (componentOptions) {
      // 获取组件名
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included || excluded
        (include && (!name || !matches(include, name))) || (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // 将当前活跃组件的位置放入末尾
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // 超出缓存最大数量，移除最前面的VNode
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      // 标记
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```

1、created时创建cache、keys缓存容器，用于收集需要缓存的VNode。

2、mounted时监听include、exclude，在缓存规则改变的时候过滤更新缓存集合cache、keys。其中pruneCache 对cache做遍历，它的核心是pruneCacheEntry，pruneCacheEntry会调用需要过滤的组件实例的$destroy()，销毁组件实例。
```js
function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
  
 function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```

3、destroyed 删除所有缓存的VNode，并调用对应组件实例的destory钩子函数。

4、keep-alive不是使用常规的templete模版的方式，而是直接实现了一个render函数，所以每次触发渲染的时候都会执行render函数。render函数的作用就是获取第一个子组件，先对其进行include、exclude判断，接下来再判断如果不存在于cache中，则将其添加至cache的末尾；如果已存在于cache中，则将其调整至cache的末尾。这样做的目的是将较为活跃的缓存组件保存在cache的末尾，当缓存的组件数量大于设定的max值时，销毁cache中位置靠前(不活跃)的组件实例。

5、keep-alive是一个抽象组件，不会生成真实的节点。由上知，keep-alive定义了abstract:true属性。那vue会忽略该组件的实例，因此不会在DOM树上生成相应的节点。

```js
// src/core/instance/lifecycle.js
export function initLifecycle (vm: Component) {
    const options= vm.$options
    // 找到第一个非abstract父组件实例
    let parent = options.parent
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
              parent = parent.$parent
        }
        parent.$children.push(vm)
    }
    vm.$parent = parent
    // ...
}
```

## keep-alive渲染过程

Vue的渲染过程：new Vue -> init -> $mount -> compile -> render -> vnode -> patch -> DOM

那被keep-alive包裹的组件和普通的组件有哪些不同呢？我想熟悉vue的人都应该能回答的上来：保存了组件内部的状态，被缓存后不会执行created、mounted等钩子函数，相应的会执行存activated、deactivated两个生命周期钩子函数。

```js
<template>
  <div id="app">
    <keep-alive>
      <component :is='view'></component>
      <p>这里是一个文本</p>
    </keep-alive>
    <el-button @click="changeView">切换组件</el-button>
  </div>
</template>

<script>
import A from './views/A'
import B from './views/B'
export default {
  name: 'App',
  components: {
    A,
    B
  },
  data(){
    return {
      view:'A'
    }
  },
  methods: {
    changeView(){
      this.view = this.view === 'A' ? 'B' : 'A'
    }
  },
};
</script>
```

1. 首次渲染A: 这里没有渲染p标签也验证了keep-alive只渲染第一个子组件。

Vue 的渲染最后都会到patch过程，而组件的patch过程会执行createComponent方法。

2. 接下来我们切换到组件B: 由于B也是首次渲染，可以看到与普通组件几乎没有区别。多执行了activated生命周期。

3. 再次切换到A组件: 这里在patch过程之前会执行prepatch的钩子函数。
