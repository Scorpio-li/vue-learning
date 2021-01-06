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
