# intro

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


## 使用 vue + intro 实现后台管理系统的新手引导

### 1. 首先打开项目，下载Intro.js模块

```js
//使用yarn
yarn add intro.js

//npm
npm i intro.js -S

//cnpm
cnpm i intro.js -S
```

### 2. 找到需要加新手引导的组件，导入Intro.js组件和样式

```js
import introJs from 'intro.js'
import 'intro.js/introjs.css'
```

- 在methods中封装guide方法

```js
// 导出组件数据
export default {
    // 定义方法
    methods: {
        guide() {
            introJs()
            .setOptions({
                nextLabel: '下一个',  // 下一个按钮文字
                prevLabel: '上一个',  // 上一个按钮文字
                skipLabel: '跳过',    // 跳过按钮文字
                doneLabel: '立即体验',// 完成按钮文字
                hidePrev: true,       // 在第一步中是否隐藏上一个按钮
                hideNext: true,       // 在最后一步中是否隐藏下一个按钮
                exitOnOverlayClick: false,  // 点击叠加层时是否退出介绍
                showStepNumbers: false,     // 是否显示红色圆圈的步骤编号
                disableInteraction: true,   // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
                showBullets: false          // 是否显示面板指示点
            }).start()
        },
    },
}
```

- 接着在钩子函数mounted中调用

```js
import introJs from 'intro.js'
import 'intro.js/introjs.css'

// 导出组件数据
export default {
    // 钩子函数
    mounted() {
        this.guide()
    },
    // 定义方法
    methods: {
        guide() {
            introJs()
            .setOptions({
                nextLabel: '下一个',  // 下一个按钮文字
                prevLabel: '上一个',  // 上一个按钮文字
                skipLabel: '跳过',    // 跳过按钮文字
                doneLabel: '立即体验',// 完成按钮文字
                hidePrev: true,       // 在第一步中是否隐藏上一个按钮
                hideNext: true,       // 在最后一步中是否隐藏下一个按钮
                exitOnOverlayClick: false,  // 点击叠加层时是否退出介绍
                showStepNumbers: false,     // 是否显示红色圆圈的步骤编号
                disableInteraction: true,   // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
                showBullets: false          // 是否显示面板指示点
            }).start()
        },
    },
}
```

- 最后就是给需要加引导的盒模型加属性就大功告成了

```js
data-step="步骤数字" data-intro="每一步的介绍字符串"
```

### 全部参考代码

```js
<template>
<div class="admin">

    <!-- 
    <section class="menu">
        <ul>
            <li data-step="1" data-intro="1" >测试1</li>
            <li data-step="2" data-intro="2" >测试2</li>
            <li data-step="3" data-intro="3" >测试3</li>
            <li data-step="4" data-intro="4" >测试4</li>
        </ul>
    </section>
    --> 

    <!-- 左侧导航 --> 
    <div class="menu" v-bind:style="{width: menuWStyle}"  data-step="1" data-intro="导航菜单">
        <!-- <el-radio-group v-model="isHiddenMenu" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
        <el-menu 
            v-loading="menuLoading"
            :default-active="$route.path" 
            class="el-menu-vertical-demo"
            :collapse="isHiddenMenu"
            :collapse-transition="false"
            background-color="#263445"
            text-color="rgb(191, 203, 217)"
        >
            <el-submenu v-for="(firstItem) in menus" :index="firstItem.auth_id" :key="firstItem.auth_id">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{firstItem.auth_name}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item 
                        v-for="twoItem in firstItem.children"
                         :key="twoItem.auth_id"
                        :index="twoItem.url" 
                        @click="jump(twoItem.url)"
                    ><i class="el-icon-setting"></i>{{twoItem.auth_name}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>

        </el-menu>
    </div>
    <!-- /左侧导航 -->
    <!-- 右侧内容 -->
    <div class="main">
        <!-- 顶部 -->
        <div class="top">
            <div class="l">
                <div class="btn" @click="changeMenuFn">
                    <!-- <i class="el-icon-s-fold"></i> -->
                    <i v-bind:class="changeMenuIcon"></i>
                </div>
                <div class="breadcrumb">
                    <Breadcrumb v-bind:name1="name1" v-bind:name2="name2" />
                </div>
            </div>
            <div class="r">
                <span data-step="2" data-intro="用户名（角色）">{{uname}}（{{rolename}}）</span>
                <i    data-step="3" data-intro="退出登录" class="el-icon-switch-button"></i>
                <i    data-step="4" data-intro="窗口全屏" class="el-icon-full-screen"></i>
            </div>
        </div>
        <!-- /顶部 -->
        <!-- 内容 -->
        <div class="content" data-step="5" data-intro="主体内容" >
            <transition appear name="fade-transform" mode="out-in">
                <router-view />
            </transition>
        </div>
        <!-- /内容 -->
    </div>
    <!-- /右侧内容 -->
</div>
</template>

<script>
// 导出组件数据
import introJs from 'intro.js'
import 'intro.js/introjs.css'

// 导出组件数据
export default {
    // 钩子函数
    mounted() {
        this.guide()
    },
    // 定义方法
    methods: {
        guide() {
            introJs()
            .setOptions({
                nextLabel: '下一个',  // 下一个按钮文字
                prevLabel: '上一个',  // 上一个按钮文字
                skipLabel: '跳过',    // 跳过按钮文字
                doneLabel: '立即体验',// 完成按钮文字
                hidePrev: true,       // 在第一步中是否隐藏上一个按钮
                hideNext: true,       // 在最后一步中是否隐藏下一个按钮
                exitOnOverlayClick: false,  // 点击叠加层时是否退出介绍
                showStepNumbers: false,     // 是否显示红色圆圈的步骤编号
                disableInteraction: true,   // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
                showBullets: false          // 是否显示面板指示点
            }).start()
        },
    },
}
</script>

<style lang="scss" scoped>
</style>
```