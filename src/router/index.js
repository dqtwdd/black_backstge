import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home'
import welcome from '@/components/welcome.vue'
import users from '@/components/menu/users/users.vue'
import rights from '@/components/menu/rights/rights.vue'
import roles from '@/components/menu/rights/roles.vue'
import reports from '@/components/menu/reports/reports.vue'
import orders from '@/components/menu/orders/orders.vue'
import categories from '@/components/menu/goods/categories.vue'
import goods from '@/components/menu/goods/goods.vue'
import params from '@/components/menu/goods/params.vue'

Vue.use(Router)

const vueRouter = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      name: 'welcome',
      component: welcome
    }, {
      path: '/users',
      name: 'users',
      component: users
    }, {
      path: '/rights',
      name: 'rights',
      component: rights
    }, {
      path: '/roles',
      name: 'roles',
      component: roles
    }, {
      path: '/reports',
      name: 'reports',
      component: reports
    }, {
      path: '/orders',
      name: 'orders',
      component: orders
    }, {
      path: '/categories',
      name: 'categories',
      component: categories
    }, {
      path: '/goods',
      name: 'goods',
      component: goods
    }, {
      path: '/params',
      name: 'params',
      component: params
    }]
  }
  ]
})

vueRouter.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (window.sessionStorage.token) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
})
export default vueRouter
