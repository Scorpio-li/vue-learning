import Vue from 'vue';

import Router from 'vue-router';

Vue.use(Router);

/**
 * requireAuth: 需要登录才可以访问
 * active: 当前路由激活的菜单
 * noAuth: 不需要菜单授权, 登录后可直接访问
 * bread: 面包屑数据
 */
const router = new Router({
    // mode: 'history',
    routes: [{
            path: '/pdf',
            component: resolve => require(['@/views/pdf'], resolve),
        }, {
            path: '/pdf1',
            component: resolve => require(['@/views/PdfPage1'], resolve),
        },
        {
            path: '/pdf2',
            component: resolve => require(['@/views/PdfPage2'], resolve),
        },
    ]
});

// router.beforeEach((to, from, next) => {
//     Vue.prototype.$showModal.hide();
//     if (to.meta.requireAuth) { // 判断该页面是否需要登录
//         if (store.state.login.token) { // 判断token是否存在
//             if (to.meta.noAuth) { // 不需菜单授权 (如账号信息页面)
//                 next();
//                 return;
//             }
//             let menu = getLocalStorage('userMenu');
//             if (menu.indexOf(to.meta.active) > -1) {
//                 next();
//             } else {
//                 next('/404'); // 无权限访问
//             }
//         } else {
//             next('/login'); // 未登录-去登录
//         }
//     } else { // 不需要登录-直接访问
//         next();
//     }
// });

// const constRoutes = [{
//     path: '/',
//     name: 'home',
//     component: Layout,
//     redirect: '/home/index',
//     children: [{
//             path: '/404',
//             component: () =>
//                 import ( /* webpackChunkName: "404" */ '@page/error/404.vue'),
//             meta: { title: '404' }
//         },
//         {
//             path: '/403',
//             component: () =>
//                 import ( /* webpackChunkName: "403" */ '@page/error/403.vue'),
//             meta: { title: '403' }
//         }
//     ]
// }]

export default router;