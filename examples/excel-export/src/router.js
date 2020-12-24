import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Example',
    component: resolve => require(['./views/example'], resolve)
}, {
    path: '/choose',
    name: 'ChooseExample',
    component: resolve => require(['./views/chooseData'], resolve)
}];

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
});

export default router