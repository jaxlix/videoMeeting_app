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
      path: '/patrolPolice',
      name: 'patrolPolice',
      component: () => import('@/views/patrolPolice/index')
    },
    {
      path: '/railwayPolice',
      name: 'railwayPolice',
      component: () => import('@/views/railwayPolice/index')
    },
    {
      path: '/review',
      name: 'review',
      component: () => import('@/views/railwayPolice/review')
    }
  ]
})
