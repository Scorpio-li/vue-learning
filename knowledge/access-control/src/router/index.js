// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

// Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/about',
//     name: 'About',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   }
// ]

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

// export default router

import Vue from 'vue'
import Router from 'vue-router'
import { allPermissions } from '@/utils/menulist.js'
import Layout from '@/components/common/Layout'
import store from '../store'

Vue.use(Router)

export const constRoutes = [{
    path: '/login',
    name: 'login',
    component: () =>
        import ( /* webpackChunkName: "login" */ '@page/Login.vue')
}, {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: '/overview/index',
    children: [{
            path: '/404',
            component: () =>
                import ( /* webpackChunkName: "404" */ '@page/error/404.vue'),
            meta: { title: '404' }
        },
        {
            path: '/403',
            component: () =>
                import ( /* webpackChunkName: "403" */ '@page/error/403.vue'),
            meta: { title: '403' }
        }
    ]
}]

const routes = []

const files = require.context('./modules', false, /\w+.js$/)
files.keys().forEach(fileName => {
    // 获取模块
    const file = files(fileName)
    routes.push(file.default || file)
})

export const asyncRoutes = [
    ...routes,
    {
        path: '/log',
        name: 'log',
        meta: { title: '日志', icon: 'el-icon-s-management', roles: ['admin'] },
        component: Layout,
        children: [{
            path: 'index',
            name: 'log_index',
            meta: { title: '操作记录', icon: 'el-icon-s-custom', roles: ['admin'] },
            component: () =>
                import ( /* webpackChunkName: "log_index" */ '@page/log/index')
        }]
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]

const router = new Router({
    routes: constRoutes.concat(asyncRoutes)
})

router.beforeEach((to, from, next) => {
    const hasToken = store.state.user.userId
    const permissions = store.getters.permissions

    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else if (allPermissions.includes(to.name) && !permissions.includes(to.name)) {
            next({ path: '/404' })
        } else {
            next()
        }
    } else {
        if (to.path !== '/login') {
            next('/login')
        } else {
            next()
        }
    }
})

export default router