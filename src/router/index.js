import { createRouter, createWebHistory } from 'vue-router'
import firebase from 'firebase/compat'
import { translate } from '../utils/locales'

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: { title: translate('routerHome'), layout: 'main', auth: true },
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/register',
        name: 'Register',
        meta: { title: translate('routerRegister'), layout: 'empty' },
        component: () => import('@/views/Register.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        meta: { title: translate('routerProfile'), layout: 'main', auth: true },
        component: () => import('@/views/Profile.vue')
    },
    {
        path: '/categories',
        name: 'Categories',
        meta: { title: translate('routerCategories'), layout: 'main', auth: true },
        component: () => import('@/views/Categories.vue')
    },
    {
        path: '/detail-record/:id',
        name: 'Detail-record',
        meta: { title: translate('routerDetail-record'), layout: 'main', auth: true },
        component: () => import('@/views/Detail-record.vue')
    },
    {
        path: '/history',
        name: 'History',
        meta: { title: translate('routerHistory'), layout: 'main', auth: true },
        component: () => import('@/views/History.vue')
    },
    {
        path: '/login',
        name: 'Login',
        meta: { title: translate('routerLogin'), layout: 'empty' },
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/planning',
        name: 'Planning',
        meta: { title: translate('routerPlanning'), layout: 'main', auth: true },
        component: () => import('@/views/Planning.vue')
    },
    {
        path: '/record',
        name: 'Record',
        meta: { title: translate('routerRecord'), layout: 'main', auth: true },
        component: () => import('@/views/Record.vue')
    },
    {
        path: '/reset-password',
        name: 'Reset-password',
        meta: { title: 'Reset-password', layout: 'empty' },
        component: () => import('@/views/Reset-password.vue')
    },
    {
        path: '/update-password',
        name: 'Update-password',
        meta: { title: 'Update-password', layout: 'empty' },
        component: () => import('@/views/Update-password.vue')
    },
    {
        path: '/login-to-del',
        name: 'Login-to-del',
        meta: { title: 'Login-to-del', layout: 'empty' },
        component: () => import('@/views/Login-to-del.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} My App`
    const currentUser = firebase.auth().currentUser
    const requireAuth = to.matched.some(record => record.meta.auth)
    if (!currentUser && requireAuth) {
        next('/login?message=login')
    } else {
        next()
    }
})

export default router
