import { constRouters, asyncRouters } from '@/router'
const mutations = {
  SET_USER_ID: (state, id) => {
    state.userId = id
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTERS: (state, routers) => {
    state.asyncRouters = routers
    state.routers = constRouters.concat(routers)
  }
}

export default mutations