import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/index')
    },
    {
      path: '/attendees',
      name: 'attendees',
      component: () => import('@/views/attendees/attendees')
    },
    {
      path: '/meeting',
      name: 'meeting',
      component: () => import('@/views/meeting/meeting')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/search/search')
    },
    {
      path: '/addPhone',
      name: 'addPhone',
      component: () => import('@/views/addPhone/addPhone')
    }
  ]
})
