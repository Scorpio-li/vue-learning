# Vue 实现前端权限控制

> 首先我们确定的权限控制分为三大部分，其中根据粒度大小分的更细：


- 登录权限控制

- 页面权限控制

    - 菜单中的页面是否可以被访问

    - 页面中的按钮 (增、删、改、查)的权限控制是否显示

- 接口权限控制

## 一、登录权限控制

> 登录访问权限控制是对用户的校验。在用户登录成功之后，后台将返回一个token，之后前端每次进行接口请求的时候，都要带上这个token。后台拿到这个token后进行判断，如果此token确实存在并且没有过期，则可以通过访问。如果token不存在或后台判断已过期，则会跳转到登录页面，要求用户重新登录获取token。

- 做法一：

在用户登录成功的回调中将后台返回的token直接存储到localStorage，然后同步配置请求默认参数的形式将token取出放入headers中传给后台。代码如下：

```js
   let axiosOptions = {
     method,
     url,
     data,
     timeout,
     // 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'。default json
     responseType,
     // 请求头内追加authToken属性
     headers: {
       authtToken: window.localStorage.getItem(`base/token?`)
     }
   }
```

- 做法二

当前项目中使用axios.interceptors.request.use设置发送请求前的拦截,直接将token塞入req.headers.authToken中，作为全局传入。代码如下：

```js
// axios.interceptors.request.use 请求拦截：配置发送请求的信息
// axios.interceptors.response.use 响应拦截：配置请求回来的信息

axios.interceptors.request.use(req => {
  req.headers.authToken = window.localStorage.getItem(`base/token?`)
  return req
}, error => {
  return Promise.reject(error)
})
```

- 登录涉及到的知识点

    - vuex + localStorage: 本地通过vuex+localStorage持久化存储token(token:服务端创建用于唯一标识用户身份的Key)。

    - axios: 请求拦截验证token，可以使用axios的API:axios.interceptors.request.use，也可以通过添加默认参数的形式在请求头中追加token。

## 二、页面权限控制

上面已经说到，页面权限控制又分为两种：

- 菜单中的页面是否可以被访问

- 页面中的按钮 (增、删、改、查)的权限控制是否显示

### 先看菜单的页面访问权限

实现页面访问权限又可分为以下两种方案：

- 方案一、初始化即挂载全部路由，每次路由跳转前做校验

- 方案二、只挂载当前用户拥有的路由，如果用户通过URL进行强制访问，则会直接进入404，相当于从源头上做了控制

前者的缺点很明显，每次路由跳转都要做一遍检验是对计算资源的浪费，另外对于用户无权访问的路由，理论上就不应该挂载。 后者解决了上述问题，但按需挂载路由就需要知道用户的路由权限，也就是在用户登录进来的时候就要知道当前用户拥有哪些路由权限。 所以肯定是方案二比较符合良好的用户体验。

### 项目中的菜单权限控制

1. 权限涉及到的meta属性

    - noRequireAuth: true 无需权限直接挂载

    - manageFree: true 不在操作权限树中展示

2. router.beforeEach()拦截路由的钩子

    - 不需要权限的路由直接放行。meta内noRequireAuth和manageFree不受权限控制

    - 进入路由前，从后端请求获取需要展示的菜单。后端根据token判断当前用户权限，返回对应菜单。前端递归对比确定最终要显示的菜单列表

3. router.addRoutes()

    - 通过router.addRoutes()动态添加所有符合权限的路由

### 按钮级权限控制(Vue指令v-permission)

1. 每个模块对应有四种权限，查询(get)，添加(post)，更新(put)，删除(delete)

2. 利用十进制和二进制来表示当前模块所拥有的权限。1111(15)，转换后的二进制与权限的关系表示：从右至左数(1代表拥有该权限，0代表不拥有)，第一位代表查询，第二位代表添加，第三位代表更新，第四位代表删除。如eg：二进制1111(15)，代表用于查询，添加，更新，删除四种权限。

    - 判断对应模块没有此权限时，移除当前按钮dom元素。

```html
 <el-button @click="handleClick" v-permission:moduleName.post>新增</el-button>
 <el-button @click="handleClick" v-permission.delete="moduleName">删除</el-button>
```

## 三、接口访问权限控制

> 最后再加上请求控制作为最后一道防线，路由可能配置失误，按钮可能忘了加权限，这种时候请求控制可以用来兜底，越权请求将在前端被拦截。

前后端约定接口采用RESTful风格，同样对应四种权限，包括查询（get），添加（post），更新（put），删除（delete）。对于查询操作，正常如果参数只有一个，应该用get请求，如果有多个参数，需要改为post请求，但是需要在url后面添加/query以告诉服务端当前进行的是查询操作，用于和正常的添加(post)请求区分。同样的是，删除用户时如果有多个参数，DELETE请求同样改为POST请求，在后面添加/delete用于和正常的删除（delete）操作进行区分。
