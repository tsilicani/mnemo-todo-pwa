import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/signup',
        component: () => import('../views/Account.vue'),
    },
    {
        path: '/login',
        component: () => import('../views/Account.vue'),
    },
    {
        path: '/sendcode',
        component: () => import('../views/Account.vue'),
    },
    {
        path: '/verify',
        component: () => import('../views/Account.vue'),
    },
    {
        path: '/newpassword',
        component: () => import('../views/Account.vue'),
    },
    {
        path: '/forgot',
        component: () => import('../views/Account.vue'),
    },
    {
        path: '/profile',
        component: () => import('../views/Account.vue'),
    },
    {
        path: '/todos',
        component: () => import('../views/Todos.vue'),
    }
]

const router = new VueRouter({
    routes
})

export default router