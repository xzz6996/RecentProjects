import { login, getUserInfo } from '@/api/login' // api
import { constRouters, asyncRouters } from '@/router' // routes
import { setToken, removeToken } from '@/utils/auth' // token
import { Message } from 'element-ui'

const actions = {
  // 登录
  Login({commit}, userInfo) {
    console.log(userInfo)
    return new Promise((resolve,reject) => {
      login(userInfo).then(res => {
        const data = res.data
        if (res.data.success) {
          setToken(data.data.token)
          commit('SET_TOKEN', data.data.token)
          resolve(res)
        } else {
          reject(res)
        }
      })
    })
  },
  // 获取用户信息
  GetUserInfo ({commit, state}) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(res => {
        const data = JSON.parse(res.data.data)
        console.log('用户信息',data)
        commit('SET_USER_ID', data.id)
        commit('SET_NAME', data.userName)
        console.log('用户角色', data.roleCodes)
        commit('SET_ROLES', data.roleCodes)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取菜单
  GetAsyncRouters({ commit }, data) {
    return new Promise((resolve, reject) => {
      const { roles } = data
      let menuRouter
      if (roles.indexOf('admin') >= 0 || roles.indexOf('superadmin') >= 0) {
        menuRouter = asyncRouters
      } else {
        menuRouter = routerFilters(asyncRouters, roles)
      }
      commit('SET_ROUTERS', menuRouter)
      resolve()
    })
  },
  // 登出
  Logout ({commit}) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

function routerFilters(asyncRouters, roles) {
  const menuRouter = asyncRouters.filter(router => {
    if (hasPermission(roles, router)) {
      return true
    }
    return false
  })
  return menuRouter
}

function hasPermission(roles, router) {
  return roles.some(role => router.meta.roles.indexOf(role) >= 0)
}

export default actions