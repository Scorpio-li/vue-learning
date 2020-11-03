// src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FileUpload from '../views/file/upload.vue'

// createRouter 创建路由实例
const router = createRouter({
    history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
    routes: [{
        path: '/',
        component: Home
    }, {
        path: '/file/upload',
        name: 'fileUpload',
        component: FileUpload
            // component: resolve => require(['@/views/file/upload'], resolve)
    }]
})

// 抛出路由实例, 在 main.js 中引用
export default router