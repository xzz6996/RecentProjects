import router from './router'
import store from './store'
import { getToken } from '@/utils/auth'

const whiteRiuterList = ['/login', '/platformManagement']

router.beforeEach((to, from, next) => {
  // store.dispatch('Logout')
  console.log(getToken())
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.state.roles.length === 0) {
        console.log('开始获取用户信息')
        store.dispatch('GetUserInfo').then(res => {
          const roles = store.state.roles
          console.log(roles)
          if (roles.length === 0) { // 判断登录用户的`roles`长度 若无角色则执行登出操作
            store.dispatch('Logout')
          }
          store.dispatch('GetAsyncRouters', { roles }).then(() => { // 获取路由
            console.log('开始动态添加路由')
            console.log('添加的路由',store.state.asyncRouters)
            router.addRoutes(store.state.asyncRouters)
            next({...to, replace: true})
          })
        }).catch(() => {
          store.dispatch('Logout')
          next({ path: `/login?time=${new Date().getTime()}` })
          // next({ path: '/login?time=' + new Date().getTime() })
        })
      } else {
        console.log('已添加路由')
        console.log(store.state.asyncRouters)
        console.log(2)
        next()
      }
    }
  } else {
    console.log(to.path)
    if (whiteRiuterList.indexOf(to.path) !== -1) {
      console.log(3)
      next()
    } else {
      console.log(4)
      next({ path: `/login?time=${new Date().getTime()}` })
      // next({ path: '/login?time=' + new Date().getTime() })
    }
  }
})