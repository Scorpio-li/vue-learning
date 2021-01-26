<!--
 * @Author: Li Zhiliang
 * @Date: 2020-11-24 18:26:07
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-01-06 17:44:00
 * @FilePath: /vue-learning/components-demo/README.md
-->
# components-demo

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

## Vue前端HTML保存为PDF的两种常用方式

### 1. 使用html2Canvas和JsPDF库，转化为图片后保存PDF。

- 优点：
    
    - 没有预览点击即可保存
    
    - 不需要手动配置保存
    
    - 可选取部分Dom保存

- 缺点：

    - 较不清晰

    - 需要先转化为图片

    - 没有提前预览

    - 不适合保存过长分页内容

    - 依赖html2Canvas和JsPDF库


1. 安装html2canvas库 npm install html2canvas

2. 安装jspdf库 npm install jspdf

3. 编写保存函数 文件位置：src/utils/htmlToPdf.js



### 2. 调用浏览器window.print()，然后手动保存为PDF。

- 优点

    - 可以提前预览

    - 适合保存过长分页内容比较合适

    - 直接由浏览器API保存，内容清晰

    - 开发便利快速。

- 缺点

    - 第一次需要在预览框手动配置参数

    - 需要手动点击保存

    - 会有Print预览弹窗

    - 不可选取部分Dome，只能保存当前整页面。

1. 代码位置：src/views/PdfPage2.vue

## Layout组件

```js
├── src                        
    ├── components             
        └── common  
            ├── Sidebar              # 侧边菜单栏
            │   ├── MenuItem.vue     # 菜单子项
            │   └── index.vue        # 菜单栏
            ├── Header.vue           # 顶部导航
            └── Layout.vue           # Layout组件
```

## 权限控制

权限控制是每个控制台都逃不掉的课题，最普遍简单的做法就是通过constRoutes静态路由和asyncRoutes动态路由来实现。

这里我们做个小小的升级，为了可以更灵活的配置权限，除了可配置的角色权限外，我们还额外引入一个全局可以展示的所有菜单列表，添加这个列表的好处是，当我们在版本迭代时，会存在删减需求的情况，这时候比起一个个角色修改可显示菜单，还是直接修改可展示列表更为高效便捷。

权限控制的流程：

1. 未登录的情况跳转登录页面

2. 用户登录获取token及权限可访问菜单

3. 在浏览器地址栏输入访问地址时比较可展示菜单和用户可访问菜单，满足条件则跳转

4. 菜单栏比较可展示菜单和用户可访问菜单显示符合条件的菜单

目录：

```js
├── router                        
│   ├── modules                  # 划分路由
│   │   ├── page.js              # page菜单下所有路由配置           
│   │   └── setting.js           # setting菜单下所有路由配置
│   └── index.js                 # 路由主路径
├── utils
    └── menulist.js              # 所有可展示菜单
```

## 全局组件注册

项目中必然会存在一些全局公用的组件，但如果我们一个个去注册会很麻烦，所以这里我们把全局组件提到一个专门的目录下，通过一个registerComponent的方法，批量注册，以后，我们就可以直接在页面里引用这些组件。

```js
├── src                        
    ├── components             
        └── global             # 存放全局组件的目录
            ├── TableData.vue  # 全局组件  
            └── index.js       # 用来批量处理组件组册的函数入口
```

- app.js

```js
import Vue from 'vue'
import registerComponent from './components/global'

registerComponent(Vue)
```

- 页面中无需引入

```js
<template>
  <div>
    <TableData></TableData>
  </div>
</template>
```

## 全局过滤器注册

在项目中，我们会频繁遇到对诸如时间、金额的格式化，将他们作为全局的过滤器，将更方便我们后续的使用。

```js
├── src                        
    ├── utils             
        └── filters.js           # 存放全局过滤器函数入口
```

- app.js

```js
import Vue from 'vue'
import registerFilter from './utils/filters'

registerFilter(Vue)
```

- 组件中使用：

```js
<template>
  <div>{{ price | formatPrice }}</div>
</template>
```

## 表格过滤组件


