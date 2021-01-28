# Vue的前端架构知识点

## 1.分解需求

### 技术栈

- 框架（Vue or React）

- 根据公司业务判断是否需要vuex 和 vue-router

- UI框架（elementUI、Ant Design）

- 工具库（lodash、dayjs...）

### 建立脚手架

- 搭建 NPM 私服。

- 使用 Node 环境开发 CLI 工具。

- 基于 @vue/cli 搭建基础的模板（大家都比较了解，节省开发时间，远胜于从零开始搭建）。

- 根据业务需求定义各种开发中可能用到的功能（组件库、状态管理、过滤器、指令、CSS内置变量、CSS Mixins、表单验证、工具函数等）。

- 性能优化，例如对 Ant Design Vue 组件库的优化。

### 开发规范

- 对代码风格、命名规则、目录结构进行统一规范。

- 静态资源的使用规范。

- 单元测试、提交线上测试规范。

- Git 提交记录和多人协作规范。

## 2.样式

- Sass/Scss ✅

- Less ✅

- Stylus ⭕

### 局部样式

- 一般都是使用 scoped 方案：

```js
<style lang="scss" scoped>
  ...
</style>
```

### 全局样式

全局样式 目录：@/styles

variable.scss: 全局变量管理 mixins.scss: 全局 Mixins 管理 global.scss: 全局样式

其中 variable.scss 和 mixins.scss 会优先于 global.css 加载，并且可以不通过 import 的方式在项目中任何位置使用这些变量和 mixins。

```js
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import '@/styles/variable.scss';
        @import '@/styles/mixins.scss';
        `,
      },
    },
  },
}
```

### 体验优化

#### 页面载入进度条

使用 **nprogress** 对路由跳转时做一个伪进度条，这样做在网络不好的情况下可以让用户知道页面已经在加载了：

```js
import NProgress from 'nprogress';

router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});
```

#### 美化滚动条

```js
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  width: 6px;
  background: rgba(#101F1C, 0.1);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(#101F1C, 0.5);
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(#101F1C, 1);
}
```

#### 静态资源加载页面

首次加载页面时，会产生大量的白屏时间，这时做一个 loading 效果看起来会很友好，其实很简单，直接在 public/index.html 里写一些静态的样式即可。

### 移动端 100vh 问题

在移动端使用 100vh 时，发现在 Chrome、Safari 浏览器中，因为浏览器栏和一些导航栏、链接栏导致不一样的呈现：

你以为的 100vh === 视口高度

实际上 100vh === 视口高度 + 浏览器工具栏（地址栏等等）的高度

#### 解决方案

安装 vh-check **npm install vh-check --save**

```js
import vhCheck from 'vh-check';
vhCheck('browser-address-bar');
```

定义一个 CSS Mixin

```css
@mixin vh($height: 100vh) {
  height: $height;
  height: calc(#{$height} - var(--browser-address-bar, 0px));
}
```

## UI组件库

## 异步请求

### 封装 Axios

在 @/libs/request.js 路径下对 Axios 进行封装，封装了请求参数，请求头，以及错误提示信息、 request 拦截器、response 拦截器、统一的错误处理、baseURL 设置等。

```js
import axios from 'axios';
import get from 'lodash/get';
import storage from 'store';
// 创建 axios 实例
const request = axios.create({
 // API 请求的默认前缀
 baseURL: process.env.VUE_APP_BASE_URL,
 timeout: 10000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
 const status = get(error, 'response.status');
 switch (status) {
   /* eslint-disable no-param-reassign */
   case 400: error.message = '请求错误'; break;
   case 401: error.message = '未授权，请登录'; break;
   case 403: error.message = '拒绝访问'; break;
   case 404: error.message = `请求地址出错: ${error.response.config.url}`; break;
   case 408: error.message = '请求超时'; break;
   case 500: error.message = '服务器内部错误'; break;
   case 501: error.message = '服务未实现'; break;
   case 502: error.message = '网关错误'; break;
   case 503: error.message = '服务不可用'; break;
   case 504: error.message = '网关超时'; break;
   case 505: error.message = 'HTTP版本不受支持'; break;
   default: break;
   /* eslint-disabled */
 }
 return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config) => {
 // 如果 token 存在
 // 让每个请求携带自定义 token 请根据实际情况自行修改
 // eslint-disable-next-line no-param-reassign
 config.headers.Authorization = `bearer ${storage.get('ACCESS_TOKEN')}`;
 return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
 const dataAxios = response.data;
 // 这个状态码是和后端约定的
 const { code } = dataAxios;
 // 根据 code 进行判断
 if (code === undefined) {
   // 如果没有 code 代表这不是项目后端开发的接口
   return dataAxios;
 // eslint-disable-next-line no-else-return
 } else {
   // 有 code 代表这是一个后端接口 可以进行进一步的判断
   switch (code) {
     case 200:
       // [ 示例 ] code === 200 代表没有错误
       return dataAxios.data;
     case 'xxx':
       // [ 示例 ] 其它和后台约定的 code
       return 'xxx';
     default:
       // 不是正确的 code
       return '不是正确的code';
   }
 }
}, errorHandler);

export default request;
```

### 跨域问题

跨域问题一般情况直接找后端解决了，你要是不好意思打扰他们的话，可以用 devServer 提供的 proxy 代理：

```js
// vue.config.js
devServer: {
  proxy: {
    '/api': {
      target: 'http://47.100.186.132/your-path/api',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
```

### Mock 数据

- 所有的 mock 配置文件均应放置在 @/mock/services 路径内。

- 在 @/mock/services 内部可以建立业务相关的文件夹分类存放配置文件。

- 所有的配置文件应按照 ***.mock.js 的命名规范创建。

- 配置文件使用 ES6 Module 导出 export default 或 export 一个数组。

#### 入口文件

```js
import Mock from 'mockjs';

Mock.setup({
  timeout: '500-800',
});

const context = require.context('./services', true, /\.mock.js$/);

context.keys().forEach((key) => {
  Object.keys(context(key)).forEach((paramKey) => {
    Mock.mock(...context(key)[paramKey]);
  });
});
```

#### 示例模板

```js
import Mock from 'mockjs';

const { Random } = Mock;

export default [
  RegExp('/example.*'),
  'get',
  {
    'range|50-100': 50,
    'data|10': [
      {
        // 唯一 ID
        id: '@guid()',
        // 生成一个中文名字
        cname: '@cname()',
        // 生成一个 url
        url: '@url()',
        // 生成一个地址
        county: Mock.mock('@county(true)'),
        // 从数组中随机选择一个值
        'array|1': ['A', 'B', 'C', 'D', 'E'],
        // 随机生成一个时间
        time: '@datetime()',
        // 生成一张图片
        image: Random.dataImage('200x100', 'Mock Image'),
      },
    ],
  },
];
```

## 路由

### Layout

布局暂时分为三大类：

- frameIn：基于 BasicLayout，通常需要登录或权限认证的路由。

- frameOut：不需要动态判断权限的路由，如登录页或通用页面。

- errorPage：例如404。

### 权限验证

通过获取当前用户的权限去比对路由表，生成当前用户具的权限可访问的路由表，通过 router.addRoutes 动态挂载到 router 上。

- 判断页面是否需要登陆状态，需要则跳转到 /user/login

- 本地存储中不存在 token 则跳转到 /user/login

- 如果存在 token，用户信息不存在，自动调用 vuex '/system/user/getInfo'

在路由中，集成了权限验证的功能，需要为页面增加权限时，在 meta 下添加相应的 key：

### auth

- 类型：Boolean

- 说明：当 auth 为 true 时，此页面需要进行登陆权限验证，只针对 frameIn 路由有效。

### permissions

- 类型：Object

- 说明：permissions 每一个 key 对应权限功能的验证，当 key 的值为 true 时，代表具有权限，若 key 为 false，配合 v-permission 指令，可以隐藏相应的 DOM。

```js
import router from '@/router';
import store from '@/store';
import storage from 'store';
import util from '@/libs/utils';

// 进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const loginRoutePath = '/user/login';
const defaultRoutePath = '/home';

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 进度条
  NProgress.start();
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some((r) => r.meta.auth)) {
    // 是否存有token作为验证是否登录的条件
    const token = storage.get('ACCESS_TOKEN');
    if (token && token !== 'undefined') {
      // 是否处于登录页面
      if (to.path === loginRoutePath) {
        next({ path: defaultRoutePath });
        // 查询是否储存用户信息
      } else if (Object.keys(store.state.system.user.info).length === 0) {
        store.dispatch('system/user/getInfo').then(() => {
          next();
        });
      } else {
        next();
      }
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
        },
      });
      NProgress.done();
    }
  } else {
    // 不需要身份校验 直接通过
    next();
  }
});

router.afterEach((to) => {
  // 进度条
  NProgress.done();
  util.title(to.meta.title);
});
```

### 页面开发

- 根据业务需要划分，按照路由层级在 views 中创建相对应的页面组件，以文件夹的形式创建，并在文件夹内创建 index.vue 文件作为页面的入口文件。

- 页面内的组件：在页面文件夹下创建 components 文件夹，在其内部对应创建相应的组件文件，如果是复杂组件，应以文件夹的形式创建组件。

- 工具模块：能够高度抽象的工具模块，应创建在 @/src/libs 内创建 js 文件。

## 组件库

对于很多第三方的工具，我坚持认为二次封装成 vue 插件并没有多少开发成本，反而让你在后续的开发中变得很灵活。

- 数字动画

- 代码高亮

- 大文件上传（切片、断点续传、秒传）需要与后端配合

- 图片预览

- Excel 导入导出

- 富文本编辑器

- Markdown 编辑器

- 代码编辑器

## Vuex

内置一些功能，主要是对以下这些功能做了一些封装：

- 用户信息管理（储存信息、对 token 进行操作等）

- 登陆（调接口）

- 菜单管理（储存路由信息，生成菜单，模糊查询等功能）

- UA信息

- 全屏操作

- Loading

- 日志管理（消息提醒、日志留存、日志上报）

## 过滤器

- 日期时间

- 剩余时间

- 区分环境的链接（主要针对本地静态资源服务器和 OSS ）

- 文件大小

- 数字金额

- 浮点型精度

## 指令

- 组件权限验证

- 文本复制

- 快捷键绑定

- 滚动至指定位置

- 图片懒加载

- 焦点

## 开发规范

