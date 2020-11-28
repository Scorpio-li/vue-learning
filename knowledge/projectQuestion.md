<!--
 * @Author: Li Zhiliang
 * @Date: 2020-11-28 09:20:52
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2020-11-28 11:55:41
 * @FilePath: /vue-learning/knowledge/projectQuestion.md
-->
# Vue 项目一些常见问题的解决方案

## 1. 页面权限控制和登陆验证

### 页面权限控制

页面权限控制是什么意思呢？

就是一个网站有不同的角色，比如管理员和普通用户，要求不同的角色能访问的页面是不一样的。如果一个页面，有角色越权访问，这时就得做出限制了。

一种方法是通过动态添加路由和菜单来做控制，不能访问的页面不添加到路由表里，这是其中一种办法。具体细节请看下一节的《动态菜单》。

另一种办法就是所有的页面都在路由表里，只是在访问的时候要判断一下角色权限。如果有权限就允许访问，没有权限就拒绝，跳转到 404 页面。

- 思路

在每一个路由的 meta 属性里，将能访问该路由的角色添加到 roles 里。用户每次登陆后，将用户的角色返回。然后在访问页面时，把路由的 meta 属性和用户的角色进行对比，如果用户的角色在路由的 roles 里，那就是能访问，如果不在就拒绝访问。

```js
routes: [
    {
        path: '/login',
        name: 'login',
        meta: {
            roles: ['admin', 'user']
        },
        component: () => import('../components/Login.vue')
    },
    {
        path: 'home',
        name: 'home',
        meta: {
            roles: ['admin']
        },
        component: () => import('../views/Home.vue')
    },
]
```

- 页面控制

```js
// 假设角色有两种：admin 和 user
// 这里是从后台获取的用户角色
const role = 'user'
// 在进入一个页面前会触发 router.beforeEach 事件
router.beforeEach((to, from, next) => {
    if (to.meta.roles.includes(role)) {
        next()
    } else {
        next({path: '/404'})
    }
})
```

### 登录验证

网站一般只要登陆过一次后，接下来该网站的其他页面都是可以直接访问的，不用再次登陆。 我们可以通过 token 或 cookie 来实现，下面用代码来展示一下如何用 token 控制登陆验证。

```js
router.beforeEach((to, from, next) => {
    // 如果有token 说明该用户已登陆
    if (localStorage.getItem('token')) {
        // 在已登陆的情况下访问登陆页会重定向到首页
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            next({path: to.path || '/'})
        }
    } else {
        // 没有登陆则访问任何页面都重定向到登陆页
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})
```

## 2. 动态菜单

写后台管理系统，估计有不少人遇过这样的需求：根据后台数据动态添加路由和菜单。为什么这么做呢？因为不同的用户有不同的权限，能访问的页面是不一样的。

### 动态添加路由

利用 vue-router 的 addRoutes 方法可以动态添加路由。

**router.addRoutes**

```js
router.addRoutes(routes: Array<RouteConfig>)
```

动态添加更多的路由规则。参数必须是一个符合 routes 选项要求的数组。

```js
const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../components/Login.vue')
        },
        {path: '/', redirect: '/home'},
    ]   
})
```

首先，要把项目所有的页面路由都列出来，再用后台返回来的数据动态匹配，能匹配上的就把路由加上，不能匹配上的就不加。 最后把这个新生成的路由数据用 addRoutes 添加到路由表里。

```js
const asyncRoutes = {
    'home': {
        path: 'home',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    't1': {
        path: 't1',
        name: 't1',
        component: () => import('../views/T1.vue')
    },
    'password': {
        path: 'password',
        name: 'password',
        component: () => import('../views/Password.vue')
    },
    'msg': {
        path: 'msg',
        name: 'msg',
        component: () => import('../views/Msg.vue')
    },
    'userinfo': {
        path: 'userinfo',
        name: 'userinfo',
        component: () => import('../views/UserInfo.vue')
    }
}

// 传入后台数据 生成路由表
menusToRoutes(menusData)

// 将菜单信息转成对应的路由信息 动态添加
function menusToRoutes(data) {
    const result = []
    const children = []

    result.push({
        path: '/',
        component: () => import('../components/Index.vue'),
        children,
    })

    data.forEach(item => {
        generateRoutes(children, item)
    })

    children.push({
        path: 'error',
        name: 'error',
        component: () => import('../components/Error.vue')
    })

    // 最后添加404页面 否则会在登陆成功后跳到404页面
    result.push(
        {path: '*', redirect: '/error'},
    )

    return result
}

function generateRoutes(children, item) {
    if (item.name) {
        children.push(asyncRoutes[item.name])
    } else if (item.children) {
        item.children.forEach(e => {
            generateRoutes(children, e)
        })
    }
}
```

上面的代码和下面的代码效果是一样的

```js
const router = new Router({
    routes: [
        {path: '/', redirect: '/home'},
    ]   
})

router.addRoutes([
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/Login.vue')
    }
])
```

> 在动态添加路由的过程中，如果有 404 页面，一定要放在最后添加，否则在登陆的时候添加完页面会重定向到 404 页面。

```js
// 类似于这样，这种规则一定要最后添加。

{path: '*', redirect: '/404'}
```

### 动态生成菜单

把生成菜单的过程封装成组件，然后递归调用，这样就能支持无限级的菜单。在生菜菜单时，需要判断一下是否还有子菜单，如果有就递归调用组件。

## 3. 前进刷新后退不刷新

### 需求一：

在一个列表页中，第一次进入的时候，请求获取数据。

点击某个列表项，跳到详情页，再从详情页后退回到列表页时，不刷新。

也就是说从其他页面进到列表页，需要刷新获取数据，从详情页返回到列表页时不要刷新。

#### 解决方案：

```js
<keep-alive include="list">
    <router-view/>
</keep-alive>
```

假设列表页为 list.vue，详情页为 detail.vue，这两个都是子组件。

我们在 keep-alive 添加列表页的名字，缓存列表页。

然后在列表页的 created 函数里添加 ajax 请求，这样只有第一次进入到列表页的时候才会请求数据，当从列表页跳到详情页，再从详情页回来的时候，列表页就不会刷新。 这样就可以解决问题了。

### 需求二：

在需求一的基础上，再加一个要求：可以在详情页中删除对应的列表项，这时返回到列表页时需要刷新重新获取数据。

我们可以在路由配置文件上对 detail.vue 增加一个 meta 属性。

```js
{
    path: '/detail',
    name: 'detail',
    component: () => import('../view/detail.vue'),
    meta: {isRefresh: true}
},
```

这个 meta 属性，可以在详情页中通过 this.$route.meta.isRefresh 来读取和设置。

设置完这个属性，还要在 App.vue 文件里设置 watch 一下 $route 属性。

```js
watch: {
    $route(to, from) {
        const fname = from.name
        const tname = to.name
        if (from.meta.isRefresh || (fname != 'detail' && tname == 'list')) {
            from.meta.isRefresh = false
            // 在这里重新请求数据
        }
    }
},
```

这样就不需要在列表页的 created 函数里用 ajax 来请求数据了，统一放在 App.vue 里来处理。

触发请求数据有两个条件：

1. 从其他页面（除了详情页）进来列表时，需要请求数据。

2. 从详情页返回到列表页时，如果详情页 meta 属性中的 isRefresh 为 true，也需要重新请求数据。

当我们在详情页中删除了对应的列表项时，就可以将详情页 meta 属性中的 isRefresh 设为 true。这时再返回到列表页，页面会重新刷新。

#### 解决方案二

对于需求二其实还有一个更简洁的方案，那就是使用 router-view 的 key 属性。

```js
<keep-alive>
    <router-view :key="$route.fullPath"/>
</keep-alive>
```

首先 keep-alive 让所有页面都缓存，当你不想缓存某个路由页面，要重新加载它时，可以在跳转时传一个随机字符串，这样它就能重新加载了。

例如从列表页进入了详情页，然后在详情页中删除了列表页中的某个选项，此时从详情页退回列表页时就要刷新，我们可以这样跳转：

```js
this.$router.push({
    path: '/list',
    query: { 'randomID': 'id' + Math.random() },
})
```

## 4. 多个请求下 loading 的展示与关闭

一般情况下，在 vue 中结合 axios 的拦截器控制 loading 展示和关闭，是这样的：

在 **App.vue** 配置一个全局 loading。

```js
<div class="app">
    <keep-alive :include="keepAliveData">
        <router-view/>
    </keep-alive>
    <div class="loading" v-show="isShowLoading">
        <Spin size="large"></Spin>
    </div>
</div>
```

同时设置 axios 拦截器。

```js
 // 添加请求拦截器
 this.$axios.interceptors.request.use(config => {
     this.isShowLoading = true
     return config
 }, error => {
     this.isShowLoading = false
     return Promise.reject(error)
 })

 // 添加响应拦截器
 this.$axios.interceptors.response.use(response => {
     this.isShowLoading = false
     return response
 }, error => {
     this.isShowLoading = false
     return Promise.reject(error)
 })
```

这个拦截器的功能是在请求前打开 loading，请求结束或出错时关闭 loading。

如果每次只有一个请求，这样运行是没问题的。但同时有多个请求并发，就会有问题了。

**举例**

这个拦截器的功能是在请求前打开 loading，请求结束或出错时关闭 loading。

如果每次只有一个请求，这样运行是没问题的。但同时有多个请求并发，就会有问题了。

造成的后果就是页面请求还没完成，loading 却关闭了，用户会以为页面加载完成了，结果页面不能正常运行，导致用户体验不好。

**解决方案**

增加一个 loadingCount 变量，用来计算请求的次数。

```js
loadingCount: 0
```

再增加两个方法，来对 loadingCount 进行增减操作。

```js
methods: {
    addLoading() {
        this.isShowLoading = true
        this.loadingCount++
    },

    isCloseLoading() {
        this.loadingCount--
        if (this.loadingCount == 0) {
            this.isShowLoading = false
        }
    }
}
```

- 拦截器修改

```js
// 添加请求拦截器
this.$axios.interceptors.request.use(config => {
    this.addLoading()
    return config
}, error => {
    this.isShowLoading = false
    this.loadingCount = 0
    this.$Message.error('网络异常，请稍后再试')
    return Promise.reject(error)
})

// 添加响应拦截器
this.$axios.interceptors.response.use(response => {
    this.isCloseLoading()
    return response
}, error => {
    this.isShowLoading = false
    this.loadingCount = 0
    this.$Message.error('网络异常，请稍后再试')
    return Promise.reject(error)
})
```

每当发起一个请求，打开 loading，同时 loadingCount 加 1。

每当一个请求结束， loadingCount 减 1，并判断  loadingCount 是否为 0，如果为 0，则关闭 loading。

这样即可解决，多个请求下有某个请求提前结束，导致 loading 关闭的问题。

### 切换路由时，取消之前的请求

使用 axios，可以在切换路由时把之前没完成的请求取消掉。

具体分析请看这篇文章[axios切换路由取消指定请求与取消重复请求并存方案](https://juejin.cn/post/6844903905625653262)。下面展示一下实现效果：

我新建了一个 Vue 项目，设置了 a b 两个路由，每次进入路由时，发起一个 get 请求：

```js
// a.vue
<template>
    <div class="about">
        <h1>This is an a page</h1>
    </div>
</template>

<script>
import { fetchAData } from '@/api'

export default {
    created() {
        fetchAData().then(res => {
            console.log('a 路由请求完成')
        })
    }
}
</script>
```

```js
// a.vue
<template>
    <div class="about">
        <h1>This is an a page</h1>
    </div>
</template>

<script>
import { fetchAData } from '@/api'

export default {
    created() {
        fetchAData().then(res => {
            console.log('a 路由请求完成')
        })
    }
}
</script>
```

从上图可以看到，每当进入路由时会发起一个请求，请求完成后打印一句话。现在我把网速调低，然后每次点击 a 路由时，马上就切换到 b 路由。目的是为了取消 a 路由页面的请求（页面中的黑条就是 loading 图）。

[Github Demo](https://github.com/woai3c/toggle-router-abort-request)


## 5. 表格打印

打印需要用到的组件为 [print-js]()

### 普通表格打印

一般的表格打印直接仿照组件提供的例子就可以了。

```js
printJS({
    printable: id, // DOM id
    type: 'html',
    scanStyles: false,
})

```

### element-ui 表格打印（其他组件库的表格同理）

element-ui 的表格，表面上看起来是一个表格，实际上是由两个表格组成的。

表头为一个表格，表体又是个表格，这就导致了一个问题：打印的时候表体和表头错位。

另外，在表格出现滚动条的时候，也会造成错位。

#### 解决方案

我的思路是将两个表格合成一个表格，print-js 组件打印的时候，实际上是把 id 对应的 DOM 里的内容提取出来打印。

所以，在传入 id 之前，可以先把表头所在的表格内容提取出来，插入到第二个表格里，从而将两个表格合并，这时候打印就不会有错位的问题了。

```js
function printHTML(id) {
    const html = document.querySelector('#' + id).innerHTML
    // 新建一个 DOM
    const div = document.createElement('div')
    const printDOMID = 'printDOMElement'
    div.id = printDOMID
    div.innerHTML = html

    // 提取第一个表格的内容 即表头
    const ths = div.querySelectorAll('.el-table__header-wrapper th')
    const ThsTextArry = []
    for (let i = 0, len = ths.length; i < len; i++) {
        if (ths[i].innerText !== '') ThsTextArry.push(ths[i].innerText)
    }

    // 删除多余的表头
    div.querySelector('.hidden-columns').remove()
    // 第一个表格的内容提取出来后已经没用了 删掉
    div.querySelector('.el-table__header-wrapper').remove()

    // 将第一个表格的内容插入到第二个表格
    let newHTML = '<tr>'
    for (let i = 0, len = ThsTextArry.length; i < len; i++) {
        newHTML += '<td style="text-align: center; font-weight: bold">' + ThsTextArry[i] + '</td>'
    }

    newHTML += '</tr>'
    div.querySelector('.el-table__body-wrapper table').insertAdjacentHTML('afterbegin', newHTML)
    // 将新的 DIV 添加到页面 打印后再删掉
    document.querySelector('body').appendChild(div)
    
    printJS({
        printable: printDOMID,
        type: 'html',
        scanStyles: false,
        style: 'table { border-collapse: collapse }' // 表格样式
    })

    div.remove()
}
```


## 6. 下载二进制文件

平时在前端下载文件有两种方式，一种是后台提供一个 URL，然后用 window.open(URL) 下载，另一种就是后台直接返回文件的二进制内容，然后前端转化一下再下载。

由于第一种方式比较简单，在此不做探讨。本文主要讲解一下第二种方式怎么实现。

第二种方式需要用到 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象， mdn 文档上是这样介绍的：

> Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据

```js
axios({
  method: 'post',
  url: '/export',
})
.then(res => {
  // 假设 data 是返回来的二进制数据
  const data = res.data
  const url = window.URL.createObjectURL(new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', 'excel.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
})
```

> 结果会出现乱码

最后发现是参数 responseType 的问题，responseType 它表示服务器响应的数据类型。由于后台返回来的是二进制数据，所以我们要把它设为 arraybuffer， 接下来再看看结果是否正确。

```js
axios({
  method: 'post',
  url: '/export',
  responseType: 'arraybuffer',
})
.then(res => {
  // 假设 data 是返回来的二进制数据
  const data = res.data
  const url = window.URL.createObjectURL(new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', 'excel.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
})
```

### 根据后台接口内容决定是否下载文件

作者的项目有大量的页面都有下载文件的需求，而且这个需求还有点变态。

具体需求如下

1. 如果下载文件的数据量条数符合要求，正常下载（每个页面限制下载数据量是不一样的，所以不能在前端写死）。

2. 如果文件过大，后台返回 { code: 199999, msg: '文件过大，请重新设置查询项', data: null }，然后前端再进行报错提示。

先来分析一下，首先根据上文，我们都知道下载文件的接口响应数据类型为 arraybuffer。返回的数据无论是二进制文件，还是 JSON 字符串，前端接收到的其实都是 arraybuffer。所以我们要对 arraybuffer 的内容作个判断，在接收到数据时将它转换为字符串，判断是否有 code: 199999。如果有，则报错提示，如果没有，则是正常文件，下载即可。具体实现如下：

```js
axios.interceptors.response.use(response => {
    const res = response.data
    // 判断响应数据类型是否 ArrayBuffer，true 则是下载文件接口，false 则是正常接口
    if (res instanceof ArrayBuffer) {
        const utf8decoder = new TextDecoder()
        const u8arr = new Uint8Array(res)
        // 将二进制数据转为字符串
        const temp = utf8decoder.decode(u8arr)
        if (temp.includes('{code:199999')) {
            Message({
            	// 字符串转为 JSON 对象
                message: JSON.parse(temp).msg,
                type: 'error',
                duration: 5000,
            })

            return Promise.reject()
        }
    }
    // 正常类型接口，省略代码...
    return res
}, (error) => {
    // 省略代码...
    return Promise.reject(error)
})
```

## 7. 自动忽略 console.log 语句

```js
export function rewriteLog() {
    console.log = (function (log) {
        return process.env.NODE_ENV == 'development'? log : function() {}
    }(console.log))
}
```

在 main.js 引入这个函数并执行一次，就可以实现忽略 console.log 语句的效果。