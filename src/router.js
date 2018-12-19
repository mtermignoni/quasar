import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => System.import(`@/${component}.vue`)
}

function loadPages (component) {
  // '@' is aliased to src/components/modules
  return () => System.import(`@/modules/${component}.vue`)
}

const router = new VueRouter({
  routes: [{
    path: '/login', component: load('Login'), name: 'login' },
  { path: '/app',
    component: load('Index'),
    children: [
      { path: '', component: load('Home'), name: 'app' },
      { path: 'home', component: load('Home') },
      { path: 'takt', component: loadPages('Takt') },
      { path: 'pareto', component: loadPages('Pareto') },
      { path: 'oee', component: loadPages('Oee') },
      { path: 'obc', component: loadPages('Obc') },
      { path: 'kanban', component: loadPages('Kanban') }
    ]
  },
  { path: '/', redirect: { name: 'login' } },
  { path: '*', component: load('Error404') } // Not found
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.path !== '/login') {
//     let token = localStorage.getItem('token')
//     if (token) {
//       next()
//     }
//     else {
//       this.$router.push({ name: 'login' })
//       next()
//     }
//   }
//   next()
// })

export default router
